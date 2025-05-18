import { supabase } from './supabase';

interface ConnectionTestResult {
  success: boolean;
  latency: number;
  error?: string;
  details: {
    database: {
      connected: boolean;
      readAccess: boolean;
      writeAccess: boolean;
      error?: string;
    };
    auth: {
      configured: boolean;
      error?: string;
    };
    realtime: {
      connected: boolean;
      error?: string;
    };
    rls: {
      enabled: boolean;
      policies: string[];
      error?: string;
    };
  };
}

export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  const result: ConnectionTestResult = {
    success: false,
    latency: 0,
    details: {
      database: {
        connected: false,
        readAccess: false,
        writeAccess: false,
      },
      auth: {
        configured: false,
      },
      realtime: {
        connected: false,
      },
      rls: {
        enabled: false,
        policies: [],
      },
    },
  };

  try {
    // Test 1: Basic Connection & Read Access
    const { data: readTest, error: readError } = await supabase
      .from('agents')
      .select('id, name, language')
      .limit(1);

    if (readError) {
      result.details.database.error = `Read test failed: ${readError.message}`;
    } else {
      result.details.database.connected = true;
      result.details.database.readAccess = true;
    }

    // Test 2: Write Access (only if read access succeeded)
    if (result.details.database.readAccess) {
      const testId = crypto.randomUUID();
      const { error: writeError } = await supabase
        .from('agents')
        .insert([
          {
            id: testId,
            name: 'Connection Test Agent',
            language: 'en',
          },
        ]);

      if (writeError) {
        result.details.database.error = `Write test failed: ${writeError.message}`;
      } else {
        result.details.database.writeAccess = true;
        
        // Clean up test data
        await supabase
          .from('agents')
          .delete()
          .eq('id', testId);
      }
    }

    // Test 3: Auth Configuration
    const { data: authConfig, error: authError } = await supabase.auth.getSession();
    if (authError) {
      result.details.auth.error = `Auth configuration test failed: ${authError.message}`;
    } else {
      result.details.auth.configured = true;
    }

    // Test 4: Realtime
    const channel = supabase.channel('connection_test');
    const realtimePromise = new Promise((resolve) => {
      channel
        .subscribe((status) => {
          result.details.realtime.connected = status === 'SUBSCRIBED';
          resolve(true);
        })
        .unsubscribe();
    });

    await Promise.race([
      realtimePromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Realtime subscription timeout')), 5000)),
    ]).catch((error) => {
      result.details.realtime.error = `Realtime test failed: ${error.message}`;
    });

    // Test 5: RLS Policies
    const { data: rlsData, error: rlsError } = await supabase
      .rpc('get_policies', { table_name: 'agents' });

    if (rlsError) {
      result.details.rls.error = `RLS policy check failed: ${rlsError.message}`;
    } else {
      result.details.rls.enabled = true;
      result.details.rls.policies = rlsData || [];
    }

    // Calculate final latency
    result.latency = Date.now() - startTime;
    
    // Set overall success status
    result.success = (
      result.details.database.connected &&
      result.details.database.readAccess &&
      result.details.database.writeAccess &&
      result.details.auth.configured &&
      result.details.realtime.connected
    );

    return result;

  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error occurred';
    result.latency = Date.now() - startTime;
    return result;
  }
}