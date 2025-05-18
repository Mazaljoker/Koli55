import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder';

interface TranscriptionSectionProps {
  onTranscriptionComplete?: (text: string) => void;
}

const TranscriptionSection: React.FC<TranscriptionSectionProps> = ({ onTranscriptionComplete }) => {
  const [transcription, setTranscription] = useState('');

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
    if (onTranscriptionComplete) {
      onTranscriptionComplete(text);
    }
  };

  return (
    <div className="space-y-4">
      <AudioRecorder onTranscriptionComplete={handleTranscriptionComplete} />
      
      {transcription && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Transcription</h4>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-800">{transcription}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranscriptionSection;