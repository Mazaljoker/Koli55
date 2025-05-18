import React, { useState } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import AudioRecorder from './AudioRecorder';

interface TestCase {
  id: string;
  prompt: string;
  expectedOutput: string;
  actualOutput?: string;
  status: 'pending' | 'success' | 'failed' | 'running';
  accuracy?: number;
}

const initialTestCases: TestCase[] = [
  {
    id: '1',
    prompt: "Bonjour, je souhaite prendre rendez-vous pour la semaine prochaine",
    expectedOutput: "Je comprends que vous souhaitez prendre un rendez-vous pour la semaine prochaine. Je peux vous aider avec cela.",
    status: 'pending'
  },
  {
    id: '2',
    prompt: "Quels sont vos horaires d'ouverture ?",
    expectedOutput: "Nous sommes ouverts du lundi au vendredi de 9h à 18h, et le samedi de 9h à 12h.",
    status: 'pending'
  },
  {
    id: '3',
    prompt: "J'ai un problème technique avec mon compte",
    expectedOutput: "Je suis désolé d'entendre que vous rencontrez des difficultés. Pouvez-vous me décrire plus précisément le problème ?",
    status: 'pending'
  }
];

function calculateAccuracy(expected: string, actual: string): number {
  const expectedWords = expected.toLowerCase().split(' ');
  const actualWords = actual.toLowerCase().split(' ');
  
  let matches = 0;
  for (const word of actualWords) {
    if (expectedWords.includes(word)) {
      matches++;
    }
  }
  
  return (matches / expectedWords.length) * 100;
}

export default function TestSuite() {
  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases);
  const [currentTest, setCurrentTest] = useState<TestCase | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleTranscriptionComplete = (text: string) => {
    if (!currentTest) return;

    const accuracy = calculateAccuracy(currentTest.expectedOutput, text);
    const status = accuracy >= 80 ? 'success' : 'failed';

    setTestCases(prev => prev.map(test => 
      test.id === currentTest.id 
        ? { ...test, actualOutput: text, status, accuracy }
        : test
    ));
    setCurrentTest(null);
    setIsRecording(false);
  };

  const startTest = (testCase: TestCase) => {
    setCurrentTest(testCase);
    setIsRecording(true);
    setTestCases(prev => prev.map(test => 
      test.id === testCase.id 
        ? { ...test, status: 'running' }
        : test
    ));
  };

  const exportResults = () => {
    const results = {
      timestamp: new Date().toISOString(),
      results: testCases.map(test => ({
        prompt: test.prompt,
        expectedOutput: test.expectedOutput,
        actualOutput: test.actualOutput,
        accuracy: test.accuracy,
        status: test.status
      }))
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#141616]">Tests de Transcription</h2>
        <button
          onClick={exportResults}
          className="flex items-center space-x-2 px-4 py-2 bg-[#435175] text-white rounded-lg hover:bg-[#5b6a91]"
        >
          <Download size={16} />
          <span>Exporter les résultats</span>
        </button>
      </div>

      {isRecording && currentTest && (
        <div className="bg-[#f7f9fb] p-4 rounded-lg">
          <h3 className="font-medium text-[#141616] mb-2">Test en cours</h3>
          <p className="text-gray-600 mb-4">{currentTest.prompt}</p>
          <AudioRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        </div>
      )}

      <div className="space-y-4">
        {testCases.map(test => (
          <div
            key={test.id}
            className="border border-[#e9ecef] rounded-lg p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-[#141616]">Prompt #{test.id}</h3>
                <p className="text-gray-600 mt-1">{test.prompt}</p>
              </div>
              {test.status === 'pending' && (
                <button
                  onClick={() => startTest(test)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-[#435175] text-white rounded-lg hover:bg-[#5b6a91]"
                  disabled={isRecording}
                >
                  <Play size={16} />
                  <span>Démarrer</span>
                </button>
              )}
              {test.status === 'running' && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <AlertCircle size={20} />
                  <span>En cours...</span>
                </div>
              )}
              {test.status === 'success' && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle size={20} />
                  <span>Réussi</span>
                </div>
              )}
              {test.status === 'failed' && (
                <div className="flex items-center space-x-2 text-red-600">
                  <XCircle size={20} />
                  <span>Échoué</span>
                </div>
              )}
            </div>

            {test.actualOutput && (
              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Sortie attendue :</h4>
                  <p className="text-gray-600 bg-gray-50 p-2 rounded mt-1">
                    {test.expectedOutput}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Transcription obtenue :</h4>
                  <p className="text-gray-600 bg-gray-50 p-2 rounded mt-1">
                    {test.actualOutput}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Précision :</h4>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          test.accuracy && test.accuracy >= 80 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${test.accuracy}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{test.accuracy?.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}