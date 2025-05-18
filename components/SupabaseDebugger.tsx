'use client';

import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

interface RequestLog {
  timestamp: string;
  type: string;
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: any;
}

export default function SupabaseDebugger() {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [userSession, setUserSession] = useState<any>(null);
  const [expandedLog, setExpandedLog] = useState<number | null>(null);

  // Vérifier la connexion à Supabase
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Utiliser une requête simple pour vérifier la connexion
        const { data, error } = await supabase.from('_pgrpc').select('*').limit(1);
        setIsConnected(!error);
        
        // Ajouter au log
        addLog('check_connection', '_pgrpc.select', !error ? 'success' : 'error', data, error);
      } catch (err) {
        setIsConnected(false);
        addLog('check_connection', '_pgrpc.select', 'error', null, err);
      }

      // Récupérer la session
      const { data: { session } } = await supabase.auth.getSession();
      setUserSession(session);
      addLog('get_session', 'auth.getSession', session ? 'success' : 'error', session, !session ? 'No session found' : null);
    };

    checkConnection();
  }, []);

  // Fonction pour ajouter un log
  const addLog = (type: string, endpoint: string, status: 'pending' | 'success' | 'error', data?: any, error?: any) => {
    setLogs(prev => [
      {
        timestamp: new Date().toISOString(),
        type,
        endpoint,
        status,
        data,
        error
      },
      ...prev.slice(0, 19) // Garder seulement les 20 derniers logs
    ]);
  };

  // Tester une requête Edge Function
  const testEdgeFunction = async () => {
    const testFunctionName = 'test'; // Fonction la plus simple pour le test
    
    addLog('edge_function', `functions/${testFunctionName}`, 'pending');
    
    try {
      const { data, error } = await supabase.functions.invoke(testFunctionName);
      
      addLog('edge_function', `functions/${testFunctionName}`, error ? 'error' : 'success', data, error);
      
      alert(error 
        ? `Erreur lors de l'appel à la fonction Edge: ${error.message}` 
        : `Fonction Edge appelée avec succès: ${JSON.stringify(data)}`
      );
    } catch (err: any) {
      addLog('edge_function', `functions/${testFunctionName}`, 'error', null, err);
      alert(`Exception lors de l'appel à la fonction Edge: ${err.message}`);
    }
  };

  // Tester la création d'un assistant fictif
  const testCreateAssistant = async () => {
    addLog('edge_function', 'functions/assistants', 'pending');
    
    try {
      const { data, error } = await supabase.functions.invoke('assistants', {
        method: 'POST',
        body: {
          name: 'Test Assistant',
          model: 'gpt-4o',
          language: 'fr-FR'
        }
      });
      
      addLog('edge_function', 'functions/assistants', error ? 'error' : 'success', data, error);
      
      alert(error 
        ? `Erreur lors de la création de l'assistant: ${error.message}` 
        : `Assistant créé avec succès: ${JSON.stringify(data)}`
      );
    } catch (err: any) {
      addLog('edge_function', 'functions/assistants', 'error', null, err);
      alert(`Exception lors de la création de l'assistant: ${err.message}`);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 mt-4 shadow">
      <h2 className="text-lg font-bold mb-3">Diagnostic Supabase</h2>
      
      <div className="mb-4">
        <p className="mb-2">
          <span className="font-medium">État de la connexion: </span>
          {isConnected === null ? (
            <span className="bg-gray-200 animate-pulse px-2 py-1 rounded">Vérification...</span>
          ) : isConnected ? (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Connecté</span>
          ) : (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Non connecté</span>
          )}
        </p>
        
        <p className="mb-2">
          <span className="font-medium">Session utilisateur: </span>
          {userSession ? (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Authentifié</span>
          ) : (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Non authentifié</span>
          )}
        </p>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <button 
          onClick={testEdgeFunction}
          className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
        >
          Tester Fonction Edge
        </button>
        
        <button 
          onClick={testCreateAssistant}
          className="px-3 py-1 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700"
        >
          Tester Création Assistant
        </button>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Logs des requêtes ({logs.length})</h3>
        <div className="h-64 overflow-y-auto border rounded">
          {logs.length === 0 ? (
            <p className="p-3 text-gray-500 italic">Aucun log pour le moment</p>
          ) : (
            <ul className="divide-y">
              {logs.map((log, index) => (
                <li 
                  key={index} 
                  className={`p-2 text-sm cursor-pointer hover:bg-gray-50 ${
                    log.status === 'error' ? 'bg-red-50' : 
                    log.status === 'success' ? 'bg-green-50' : 'bg-yellow-50'
                  }`}
                  onClick={() => setExpandedLog(expandedLog === index ? null : index)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium">{log.type}</span> - 
                      <span className="text-gray-600"> {log.endpoint}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        log.status === 'error' ? 'bg-red-200 text-red-800' : 
                        log.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {log.status}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  
                  {expandedLog === index && (
                    <div className="mt-2 overflow-x-auto">
                      {log.data && (
                        <div className="mb-1">
                          <div className="font-medium text-xs text-gray-500 mb-1">Données:</div>
                          <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap break-all">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {log.error && (
                        <div>
                          <div className="font-medium text-xs text-gray-500 mb-1">Erreur:</div>
                          <pre className="bg-red-100 p-2 rounded text-xs whitespace-pre-wrap break-all">
                            {typeof log.error === 'object' 
                              ? JSON.stringify(log.error, null, 2)
                              : log.error.toString()
                            }
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 