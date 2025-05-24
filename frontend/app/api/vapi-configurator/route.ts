import { NextRequest, NextResponse } from 'next/server';
import { supabaseConfig, edgeFunctionUrls } from '../../../lib/config/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Appeler l'Edge Function vapi-configurator
    const response = await fetch(edgeFunctionUrls.vapiConfigurator, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseConfig.anonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erreur Edge Function:', errorText);
      return NextResponse.json(
        { success: false, error: 'Erreur de communication avec le serveur' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Erreur API route:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'API Vapi Configurateur - Utilisez POST pour interagir' },
    { status: 200 }
  );
} 