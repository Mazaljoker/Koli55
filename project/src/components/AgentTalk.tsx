import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Loader } from 'lucide-react';
import AudioRecorder from './AudioRecorder';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AgentTalkProps {
  agentName: string;
  systemPrompt: string;
  firstMessage?: string;
}

const AgentTalk: React.FC<AgentTalkProps> = ({ agentName, systemPrompt, firstMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (firstMessage) {
      setMessages([
        {
          id: '0',
          role: 'assistant',
          content: firstMessage,
          timestamp: new Date()
        }
      ]);
    }
  }, [firstMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Verify environment variables
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Missing Supabase configuration');
      }

      // Call the Edge Function for chat
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.content,
            systemPrompt,
            conversationHistory: messages
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Edge function error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error('Invalid response format from server');
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add the error message to the chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Une erreur est survenue: ${error.message}. Veuillez réessayer.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscriptionComplete = (text: string) => {
    setInputValue(text);
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg border border-[#e9ecef]">
      {/* Chat Header */}
      <div className="p-4 border-b border-[#e9ecef]">
        <h2 className="text-lg font-semibold text-[#141616]">{agentName}</h2>
        <p className="text-sm text-gray-500">Test de conversation en direct</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-[#435175] text-white'
                  : 'bg-gray-100 text-[#141616]'
              }`}
            >
              <p>{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader className="w-5 h-5 animate-spin text-[#435175]" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-[#e9ecef]">
        {isRecording ? (
          <AudioRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Tapez votre message..."
              className="flex-1 rounded-lg border border-[#e9ecef] p-2 focus:outline-none focus:ring-2 focus:ring-[#435175]"
            />
            <button
              onClick={() => setIsRecording(true)}
              className="p-2 rounded-lg text-[#435175] hover:bg-[#f7f9fb]"
            >
              <Mic className="w-6 h-6" />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-[#435175] text-white px-4 py-2 rounded-lg hover:bg-[#5b6a91] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentTalk;