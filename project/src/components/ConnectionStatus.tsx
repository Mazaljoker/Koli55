import React, { useEffect, useState } from 'react';
import { testSupabaseConnection } from '../lib/supabaseTest';
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

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

export function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionTestResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const result = await testSupabaseConnection();
      setStatus(result);
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-500 animate-spin" />
          <span>Testing connection...</span>
        </div>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>Failed to perform connection test</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Supabase Connection Status</h2>
      
      <div className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Overall Status</span>
          <div className="flex items-center space-x-2">
            {status.success ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span className={status.success ? 'text-green-600' : 'text-red-600'}>
              {status.success ? 'Connected' : 'Connection Issues'}
            </span>
          </div>
        </div>

        {/* Latency */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Latency</span>
          <span className={status.latency > 1000 ? 'text-yellow-600' : 'text-green-600'}>
            {status.latency}ms
          </span>
        </div>

        {/* Database */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="font-medium mb-2">Database</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Connection</span>
              {status.details.database.connected ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>Read Access</span>
              {status.details.database.readAccess ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>Write Access</span>
              {status.details.database.writeAccess ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
          {status.details.database.error && (
            <div className="mt-2 text-sm text-red-600">
              {status.details.database.error}
            </div>
          )}
        </div>

        {/* Auth */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="font-medium mb-2">Authentication</div>
          <div className="flex items-center justify-between">
            <span>Configuration</span>
            {status.details.auth.configured ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          {status.details.auth.error && (
            <div className="mt-2 text-sm text-red-600">
              {status.details.auth.error}
            </div>
          )}
        </div>

        {/* Realtime */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="font-medium mb-2">Realtime</div>
          <div className="flex items-center justify-between">
            <span>Connection</span>
            {status.details.realtime.connected ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          {status.details.realtime.error && (
            <div className="mt-2 text-sm text-red-600">
              {status.details.realtime.error}
            </div>
          )}
        </div>

        {/* RLS */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="font-medium mb-2">Row Level Security</div>
          <div className="flex items-center justify-between">
            <span>Enabled</span>
            {status.details.rls.enabled ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
          {status.details.rls.policies.length > 0 && (
            <div className="mt-2">
              <div className="text-sm font-medium">Active Policies:</div>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {status.details.rls.policies.map((policy, index) => (
                  <li key={index}>{policy}</li>
                ))}
              </ul>
            </div>
          )}
          {status.details.rls.error && (
            <div className="mt-2 text-sm text-red-600">
              {status.details.rls.error}
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={checkConnection}
          className="w-full mt-4 bg-[#435175] text-white px-4 py-2 rounded-lg hover:bg-[#5b6a91] transition-colors"
        >
          Refresh Connection Status
        </button>
      </div>
    </div>
  );
}