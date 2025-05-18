import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import OpenAI from 'npm:openai@4.28.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Verify OpenAI API key
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const openai = new OpenAI({
      apiKey: openaiKey,
    });

    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    // Parse and validate request body
    const requestBody = await req.json().catch(() => null);
    if (!requestBody) {
      throw new Error('Invalid JSON in request body');
    }

    const { message, systemPrompt, conversationHistory } = requestBody;

    if (!message || !systemPrompt) {
      throw new Error('Missing required fields: message and systemPrompt are required');
    }

    if (!Array.isArray(conversationHistory)) {
      throw new Error('Invalid conversation history format');
    }

    // Format conversation history for the API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    console.log('Sending request to OpenAI with messages:', JSON.stringify(messages));

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    if (!completion.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    const response = completion.choices[0].message.content;

    console.log('Received response from OpenAI:', response);

    return new Response(
      JSON.stringify({ response }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in chat function:', error);
    
    // Determine if it's a known error type
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error.message.includes('OpenAI API key')) {
      errorMessage = 'Configuration error: OpenAI API key is missing';
      statusCode = 503;
    } else if (error.message.includes('Missing required fields')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('Invalid JSON')) {
      errorMessage = 'Invalid request format';
      statusCode = 400;
    }

    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message 
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: statusCode,
      }
    );
  }
});