import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Send,
  Upload,
  FileText,
  Globe,
  MessageSquare,
  Phone,
  Play,
  Pause,
  CheckCircle,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  options?: string[];
  component?: string;
  data?: any;
}

interface AssistantConfig {
  business_type?: string;
  assistant_name?: string;
  tone?: string;
  key_information?: string[];
  user_contact?: string;
  vapi_assistant_id?: string;
  phone_number?: string;
}

export default function AlloKoliChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 **Bonjour !** Je suis AlloKoli, votre assistant pour créer des assistants vocaux.\n\nVoulez-vous commencer par **parler** 🎤 ou **écrire** 💬 ?",
      timestamp: new Date(),
      options: ["🎤 Commencer par la voix", "💬 Commencer par le chat"],
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mode, setMode] = useState<"chat" | "voice">("chat");
  const [assistantConfig, setAssistantConfig] = useState<AssistantConfig>({});
  const [vapiCall, setVapiCall] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (
    role: "user" | "assistant",
    content: string,
    options?: string[],
    component?: string,
    data?: any
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        role,
        content,
        timestamp: new Date(),
        options,
        component,
        data,
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    addMessage("user", inputValue);
    const userInput = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Appeler votre API route pour traiter la conversation
      const response = await fetch("/api/allokoli-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          step: currentStep,
          assistantConfig,
          mode,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      addMessage(
        "assistant",
        result.content,
        result.options,
        result.component,
        result.data
      );

      if (result.config) {
        setAssistantConfig(result.config);
      }

      if (result.nextStep !== undefined) {
        setCurrentStep(result.nextStep);
      }

      if (result.mode) {
        setMode(result.mode);
      }
    } catch (error) {
      console.error("Chat error:", error);
      addMessage(
        "assistant",
        "❌ Désolé, une erreur est survenue. Pouvez-vous réessayer ?"
      );
    }

    setIsLoading(false);
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      // Arrêter l'enregistrement
      setIsRecording(false);
      if (vapiCall) {
        vapiCall.stop();
        setVapiCall(null);
      }
    } else {
      // Démarrer l'enregistrement avec Vapi
      setIsRecording(true);

      try {
        // Dynamically import Vapi Web SDK
        const { default: Vapi } = await import("@vapi-ai/web-sdk");

        const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY!);

        // Démarrer l'appel avec l'assistant configurateur
        const call = await vapi.start({
          assistantId: process.env.NEXT_PUBLIC_VAPI_CONFIGURATOR_ID,
          // Configuration pour interface web
          assistantOverrides: {
            clientMessages: [
              "conversation-update",
              "function-call",
              "transcript",
              "tool-calls",
            ],
          },
        });

        setVapiCall(vapi);

        // Écouter les événements Vapi
        vapi.on("message", (message: any) => {
          console.log("Vapi message:", message);

          switch (message.type) {
            case "transcript":
              if (message.transcriptType === "final") {
                addMessage("user", `🎤 "${message.transcript}"`);
              }
              break;

            case "function-call":
              if (message.functionCall.name === "create_user_assistant") {
                // L'assistant va créer l'assistant utilisateur
                addMessage(
                  "assistant",
                  "🔧 **Création de votre assistant en cours...**"
                );
              }
              break;

            case "conversation-update":
              if (message.content) {
                addMessage("assistant", message.content);
              }
              break;

            case "call-end":
              setIsRecording(false);
              setVapiCall(null);
              break;
          }
        });

        vapi.on("error", (error: any) => {
          console.error("Vapi error:", error);
          addMessage("assistant", "❌ Erreur vocale. Basculons en mode texte.");
          setIsRecording(false);
          setVapiCall(null);
        });
      } catch (error) {
        console.error("Failed to start voice:", error);
        addMessage(
          "assistant",
          "❌ Impossible de démarrer la voix. Continuons par écrit !"
        );
        setIsRecording(false);
      }
    }
  };

  const handleOptionClick = (option: string) => {
    addMessage("user", option);

    // Traitement spécial pour les options de mode
    if (option.includes("🎤")) {
      setMode("voice");
      addMessage(
        "assistant",
        "🎤 **Mode vocal activé !** Cliquez sur le micro pour commencer à parler."
      );
    } else if (option.includes("💬")) {
      setMode("chat");
      addMessage(
        "assistant",
        "💬 **Parfait !** Commençons par le chat. **Parlez-moi de votre activité ?**"
      );
      setCurrentStep(1);
    } else {
      // Traiter comme un message normal
      handleMessageFromOption(option);
    }
  };

  const handleMessageFromOption = async (message: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/allokoli-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          step: currentStep,
          assistantConfig,
          mode,
        }),
      });

      const result = await response.json();

      addMessage(
        "assistant",
        result.content,
        result.options,
        result.component,
        result.data
      );

      if (result.config) {
        setAssistantConfig(result.config);
      }

      if (result.nextStep !== undefined) {
        setCurrentStep(result.nextStep);
      }
    } catch (error) {
      addMessage("assistant", "❌ Erreur lors du traitement. Réessayons !");
    }

    setIsLoading(false);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFilesSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/upload-knowledge-base", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const fileNames = files.map((f) => f.name).join(", ");
        addMessage("user", `📄 **Fichiers uploadés :** ${fileNames}`);
        addMessage(
          "assistant",
          "✅ **Base de connaissances ajoutée !** Votre assistant connaît maintenant vos documents. Prêt pour un test ?",
          null,
          "testAssistant"
        );

        // Mettre à jour la config avec les knowledge bases
        setAssistantConfig((prev) => ({
          ...prev,
          knowledge_base_ids: result.knowledge_base_ids,
        }));
      }
    } catch (error) {
      addMessage(
        "assistant",
        "❌ Erreur lors de l'upload. Réessayez ou passez cette étape."
      );
    }

    setIsLoading(false);
  };

  // Composants spéciaux
  const KnowledgeBaseComponent = () => (
    <div className="bg-gray-50 rounded-lg p-4 my-3 border">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <FileText size={20} />
        📚 Base de connaissances (optionnel)
      </h4>
      <p className="text-sm text-gray-600 mb-4">
        Enrichissez votre assistant avec vos documents pour des réponses plus
        précises.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={handleFileUpload}
          className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FileText size={18} />
          <span className="text-sm">PDF, DOC, TXT</span>
        </button>

        <button
          onClick={() =>
            addMessage("assistant", "Fonctionnalité bientôt disponible !", [
              "Continuer sans documents",
            ])
          }
          className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Globe size={18} />
          <span className="text-sm">Site Web</span>
        </button>

        <button
          onClick={() =>
            addMessage("assistant", "Ajoutez du texte libre :", [], "textInput")
          }
          className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MessageSquare size={18} />
          <span className="text-sm">Texte libre</span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilesSelected}
        multiple
        accept=".pdf,.doc,.docx,.txt,.json,.csv,.md"
        className="hidden"
      />

      <button
        onClick={() => {
          addMessage("user", "⏭️ Passer cette étape");
          addMessage(
            "assistant",
            "Pas de problème ! Votre assistant peut déjà répondre aux questions de base. Testons-le ?",
            null,
            "testAssistant"
          );
        }}
        className="text-blue-600 hover:text-blue-800 underline text-sm"
      >
        Passer cette étape
      </button>
    </div>
  );

  const TestAssistantComponent = () => (
    <div className="bg-blue-50 rounded-lg p-4 my-3 border border-blue-200">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Phone size={20} className="text-blue-600" />
        🎧 Test de votre assistant
      </h4>

      {assistantConfig.assistant_name && (
        <div className="bg-white rounded border p-3 mb-4">
          <div className="text-sm text-gray-600 mb-1">Aperçu :</div>
          <div className="font-medium">{assistantConfig.assistant_name}</div>
          <div className="text-sm text-gray-500">
            {assistantConfig.business_type} • Ton {assistantConfig.tone}
          </div>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => {
            addMessage(
              "assistant",
              "🎧 **Test vocal en cours...** (Simulation - fonctionnalité bientôt disponible)",
              ["✅ Le test fonctionne !", "❌ Il y a un problème"]
            );
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Mic size={18} />
          <span>Test vocal</span>
        </button>

        <button
          onClick={() => {
            addMessage(
              "assistant",
              "💬 **Test chat :** Comment puis-je vous aider ?",
              [
                "Quels sont vos horaires ?",
                "Je voudrais un rendez-vous",
                "Quels sont vos tarifs ?",
              ]
            );
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          <MessageSquare size={18} />
          <span>Test chat</span>
        </button>
      </div>

      <button
        onClick={() => {
          addMessage("user", "✅ Le test fonctionne parfaitement !");
          addMessage(
            "assistant",
            "🎉 **Excellent !** Votre assistant est prêt. Obtenons maintenant votre numéro de téléphone pour le déployer !",
            null,
            "phoneNumber"
          );
        }}
        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
      >
        ✅ Valider et continuer
      </button>
    </div>
  );

  const PhoneNumberComponent = () => (
    <div className="bg-green-50 rounded-lg p-4 my-3 border border-green-200">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Phone size={20} className="text-green-600" />
        📞 Votre numéro de téléphone
      </h4>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Région préférée :
        </label>
        <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500">
          <option value="01">🏢 Paris - Île-de-France (01)</option>
          <option value="02">🌊 Nord-Ouest (02)</option>
          <option value="03">🏔️ Nord-Est (03)</option>
          <option value="04">☀️ Sud-Est (04)</option>
          <option value="05">🌿 Sud-Ouest (05)</option>
        </select>
      </div>

      <div className="bg-white rounded border p-4 mb-4">
        <div className="flex justify-between items-start mb-2">
          <h5 className="font-semibold text-lg">AlloKoli Starter</h5>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">19€</div>
            <div className="text-sm text-gray-500">/mois</div>
          </div>
        </div>
        <ul className="text-sm space-y-1">
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            Assistant vocal personnalisé
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            Numéro de téléphone dédié
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            100 minutes d'appels inclus
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            Interface de gestion simple
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-500" />
            Support par email
          </li>
        </ul>
      </div>

      <button
        onClick={() => {
          addMessage("user", "🚀 Je finalise mon abonnement");
          addMessage(
            "assistant",
            "🎉 **Félicitations !** Votre assistant est en cours de déploiement...\n\n📞 **Votre numéro :** 01.23.45.67.89\n\nVous recevrez un email de confirmation avec tous les détails. Vous pouvez dès maintenant appeler ce numéro pour tester votre assistant !",
            ["🏠 Aller au tableau de bord", "📞 Tester maintenant"],
            "success"
          );
        }}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
      >
        🚀 Finaliser - 19€/mois
      </button>
    </div>
  );

  const SuccessComponent = () => (
    <div className="bg-green-100 rounded-lg p-6 my-3 border border-green-300 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="text-xl font-bold text-green-800 mb-2">
        Assistant créé avec succès !
      </h3>
      <p className="text-green-700 mb-4">
        Votre assistant vocal est maintenant opérationnel et accessible au
        numéro ci-dessus.
      </p>
      <div className="flex gap-3 justify-center">
        <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
          📊 Tableau de bord
        </button>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          📞 Tester l'assistant
        </button>
      </div>
    </div>
  );

  const renderSpecialComponent = (componentType: string) => {
    switch (componentType) {
      case "knowledgeBase":
        return <KnowledgeBaseComponent />;
      case "testAssistant":
        return <TestAssistantComponent />;
      case "phoneNumber":
        return <PhoneNumberComponent />;
      case "success":
        return <SuccessComponent />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AlloKoli</h1>
              <p className="text-sm text-gray-500">
                Assistant vocal en 5 minutes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div
              className={`w-2 h-2 rounded-full ${mode === "voice" ? "bg-red-500" : "bg-green-500"}`}
            ></div>
            Mode {mode === "voice" ? "vocal" : "chat"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {message.content
                    .split("**")
                    .map((part, i) =>
                      i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                    )}
                </div>

                {/* Options de réponse rapide */}
                {message.options && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(option)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors border ${
                          message.role === "user"
                            ? "bg-blue-700 text-white border-blue-500 hover:bg-blue-800"
                            : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                {/* Composants spéciaux */}
                {message.component && renderSpecialComponent(message.component)}

                <div
                  className={`text-xs mt-2 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <span className="text-sm text-gray-600 ml-2">
                    AlloKoli réfléchit...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={handleVoiceToggle}
              className={`p-3 rounded-full transition-colors ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
              title={
                isRecording
                  ? "Arrêter l'enregistrement"
                  : "Commencer l'enregistrement vocal"
              }
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSendMessage()
              }
              placeholder="Tapez votre message ou utilisez le micro..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isRecording}
            />

            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Envoyer le message"
            >
              <Send size={20} />
            </button>
          </div>

          {isRecording && (
            <div className="mt-2 text-center">
              <p className="text-sm text-red-600 animate-pulse">
                🔴 Enregistrement en cours... Parlez maintenant !
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
