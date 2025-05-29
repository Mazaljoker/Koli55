// frontend/app/configurateur/components/ConfiguratorChat.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input, Space, Typography, Card, Avatar, Spin } from "antd";
import {
  Mic,
  MicOff,
  Send,
  RotateCcw,
  Volume2,
  VolumeX,
  Bot,
  User,
} from "lucide-react";
import { useVapiConfigurator } from "@/lib/hooks/useVapiConfigurator";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const { Text, Paragraph } = Typography;

interface ConfiguratorChatProps {
  className?: string;
}

const ConfiguratorChat: React.FC<ConfiguratorChatProps> = ({
  className = "",
}) => {
  const [textMessage, setTextMessage] = useState("");
  const [showTextInput, setShowTextInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isCallActive,
    isSpeaking,
    isListening,
    volumeLevel,
    messages,
    currentStep,
    error,
    isLoading,
    configuratorData,
    startCall,
    stopCall,
    sendMessage,
    resetConversation,
    isConnected,
  } = useVapiConfigurator();

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!textMessage.trim()) return;

    await sendMessage(textMessage);
    setTextMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const stepTitles = [
    "Accueil",
    "Nom du restaurant",
    "Type de cuisine",
    "Services offerts",
    "Horaires d'ouverture",
    "Spécialités",
    "Configuration générée",
  ];

  // Indicateur de volume visuel
  const VolumeIndicator = () => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 h-4 rounded-full transition-all duration-150 ${
            volumeLevel * 5 > i ? "bg-green-400" : "bg-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div
      className={`h-[700px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ${
                  isSpeaking ? "animate-pulse" : ""
                }`}
              >
                <Bot size={20} className="text-white" />
              </div>
              {isCallActive && (
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    isListening ? "bg-green-400 animate-pulse" : "bg-gray-400"
                  }`}
                />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Assistant Configurateur
              </h3>
              <Text className="text-sm text-blue-200">
                {isCallActive ? "En ligne" : "Hors ligne"}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isCallActive && <VolumeIndicator />}

            <Button
              onClick={isCallActive ? stopCall : startCall}
              isLoading={isLoading}
              className={`${
                isCallActive
                  ? "bg-red-500 hover:bg-red-600 border-red-500"
                  : "bg-green-500 hover:bg-green-600 border-green-500"
              } text-white`}
              icon={isCallActive ? <MicOff size={16} /> : <Mic size={16} />}
            >
              {isCallActive ? "Arrêter" : "Commencer"}
            </Button>

            <Button
              onClick={resetConversation}
              className="text-white border-white/20 hover:bg-white/10"
              icon={<RotateCcw size={16} />}
            />

            <Button
              onClick={() => setShowTextInput(!showTextInput)}
              className="text-white border-white/20 hover:bg-white/10"
              icon={
                showTextInput ? <VolumeX size={16} /> : <Volume2 size={16} />
              }
            />
          </div>
        </div>
      </div>

      {/* Progression */}
      <div className="p-4 border-b bg-blue-500/20 border-blue-500/30">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-white">
              {stepTitles[currentStep]}
            </h4>
            <p className="text-sm text-blue-200">
              Étape {currentStep + 1} sur {stepTitles.length}
            </p>
          </div>
          <div className="w-24 h-2 rounded-full bg-white/20">
            <div
              className="h-2 transition-all duration-300 bg-blue-400 rounded-full"
              style={{
                width: `${((currentStep + 1) / stepTitles.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 p-4 space-y-4 overflow-y-auto">
        {!isConnected && (
          <div className="py-8 text-center">
            <Text className="text-red-400">Connexion Vapi non établie</Text>
          </div>
        )}

        {error && (
          <Card className="bg-red-500/20 border-red-500/30">
            <Text className="text-red-200">{error}</Text>
          </Card>
        )}

        {messages.length === 0 && !error && isConnected && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot size={48} className="mx-auto mb-4 text-white/40" />
              <p className="text-center text-gray-400">
                {!isCallActive
                  ? "Cliquez sur 'Commencer' pour démarrer la configuration vocale"
                  : "Parlez ou écrivez pour commencer..."}
              </p>
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${
                message.type === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar
                icon={
                  message.type === "assistant" ? (
                    <Bot size={16} />
                  ) : (
                    <User size={16} />
                  )
                }
                className={`${
                  message.type === "assistant"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600"
                    : "bg-gradient-to-r from-green-500 to-teal-600"
                }`}
              />
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === "assistant"
                    ? "bg-blue-500/20 text-white border border-blue-500/30"
                    : "bg-green-500/20 text-white border border-green-500/30"
                }`}
              >
                <Paragraph className="mb-0 text-sm text-white">
                  {message.message}
                </Paragraph>
                <Text className="text-xs text-white/60">
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-center">
            <Spin size="small" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input texte (optionnel) */}
      {showTextInput && isCallActive && (
        <div className="p-4 border-t border-white/20">
          <Space.Compact className="w-full">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              className="text-white bg-white/10 border-white/20 placeholder-white/50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!textMessage.trim()}
              className="text-white bg-blue-500 border-blue-500 hover:bg-blue-600"
              icon={<Send size={16} />}
            />
          </Space.Compact>
        </div>
      )}

      {/* Debug info (développement) */}
      {process.env.NODE_ENV === "development" && (
        <div className="p-2 text-xs text-gray-300 bg-gray-800/50">
          Active: {isCallActive ? "Oui" : "Non"} | Speaking:{" "}
          {isSpeaking ? "Oui" : "Non"} | Listening:{" "}
          {isListening ? "Oui" : "Non"} | Volume:{" "}
          {Math.round(volumeLevel * 100)}% | Messages: {messages.length}
        </div>
      )}
    </div>
  );
};

export default ConfiguratorChat;
