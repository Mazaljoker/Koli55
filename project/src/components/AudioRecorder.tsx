import React, { useState, useRef } from 'react';
import { Mic, Square, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AudioRecorderProps {
  onTranscriptionComplete: (text: string) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' });
        
        setIsProcessing(true);
        try {
          // Create form data
          const formData = new FormData();
          formData.append('audio', audioFile);

          // Call the Edge Function
          const response = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

          const data = await response.json();
          onTranscriptionComplete(data.text);
        } catch (error) {
          console.error('Transcription failed:', error);
          alert('La transcription a échoué. Veuillez réessayer.');
        } finally {
          setIsProcessing(false);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Impossible d\'accéder au microphone. Veuillez vérifier les permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {isProcessing ? (
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Transcription en cours...</span>
        </div>
      ) : isRecording ? (
        <button
          onClick={stopRecording}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Square className="w-5 h-5" />
          <span>Arrêter l'enregistrement</span>
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="flex items-center space-x-2 px-4 py-2 bg-[#435175] text-white rounded-lg hover:bg-[#5b6a91] transition-colors"
        >
          <Mic className="w-5 h-5" />
          <span>Démarrer l'enregistrement</span>
        </button>
      )}
    </div>
  );
};

export default AudioRecorder;