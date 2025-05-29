"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Alert, Form, Steps } from "antd";
// Migration vers le SDK AlloKoli
import { useAlloKoliSDKWithAuth } from "../../../lib/hooks/useAlloKoliSDK";
import { AssistantCreate } from "../../../lib/api/allokoli-sdk";
import { AssistantFormData } from "../../../components/assistants/AssistantFormTypes";

// Import des nouveaux composants d'étape
import WelcomeStep from "./_components/WelcomeStep";
import TemplateStep from "./_components/TemplateStep";
import NameStep from "./_components/NameStep";
import ModelStep from "./_components/ModelStep";
import VoiceStep from "./_components/VoiceStep";
import ConfigStep from "./_components/ConfigStep";
import SummaryStep from "./_components/SummaryStep";

// Import des styles
import "./styles/wizard.css";
import "./styles/page.css";

const { Title } = Typography;

export default function NewAssistantPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const router = useRouter();
  const [form] = Form.useForm<AssistantFormData>();

  // Utilisation du SDK AlloKoli
  const sdk = useAlloKoliSDKWithAuth();

  const handleStart = () => {
    setShowWelcome(false);
    setCurrentStep(0);
  };

  const handleNext = async () => {
    try {
      // Valider les champs de l'étape actuelle
      await form.validateFields();

      if (currentStep < wizardSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } catch (errorInfo) {
      console.log("Validation des champs échouée:", errorInfo);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowWelcome(true);
    }
  };

  const handleEditStep = (stepKey: string) => {
    const stepIndex = wizardSteps.findIndex((step) => step.key === stepKey);
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      const formData = form.getFieldsValue();

      // Préparer les données pour le SDK AlloKoli
      const createRequest: AssistantCreate = {
        name: formData.name,
        model: {
          provider: formData.modelProvider as
            | "openai"
            | "anthropic"
            | "groq"
            | "azure-openai",
          model: formData.modelName,
          systemPrompt: formData.systemPrompt,
          temperature: formData.modelTemperature,
          maxTokens: formData.modelMaxTokens,
        },
        voice: {
          provider: formData.voiceProvider as
            | "azure"
            | "eleven-labs"
            | "playht"
            | "deepgram"
            | "openai",
          voiceId: formData.voiceId,
        },
        firstMessage: formData.firstMessage,
        instructions: formData.systemPrompt,
        metadata: {
          endCallMessage: formData.endCallMessage,
          endCallPhrases: formData.endCallPhrases
            ? formData.endCallPhrases.split(",").map((phrase) => phrase.trim())
            : [],
          forwardingPhoneNumber: formData.forwardingPhoneNumber,
        },
      };

      // Vérification préalable des données
      if (!createRequest.name?.trim()) {
        throw new Error("Le nom de l'assistant est requis");
      }

      console.log("Submitting assistant data with SDK:", createRequest);

      // Utiliser le SDK pour créer l'assistant
      const response = await sdk.createAssistant(createRequest);
      console.log("Assistant created successfully:", response.data);

      router.push(`/assistants/${response.data.id}`);
    } catch (err: unknown) {
      console.error("Error creating assistant with SDK:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(`Erreur: ${errorMessage}`);
    }

    setLoading(false);
  };

  // Définition des étapes du wizard (après la bienvenue)
  const wizardSteps = [
    {
      key: "template",
      title: "Template",
      description: "Choisir un modèle",
      component: <TemplateStep form={form} />,
    },
    {
      key: "basic",
      title: "Identité",
      description: "Informations de base",
      component: <NameStep form={form} />,
    },
    {
      key: "model",
      title: "Modèle IA",
      description: "Intelligence artificielle",
      component: <ModelStep form={form} />,
    },
    {
      key: "voice",
      title: "Voix",
      description: "Personnalisation vocale",
      component: <VoiceStep form={form} />,
    },
    {
      key: "advanced",
      title: "Configuration",
      description: "Paramètres avancés",
      component: <ConfigStep form={form} />,
    },
    {
      key: "summary",
      title: "Résumé",
      description: "Validation finale",
      component: (
        <SummaryStep
          formData={form.getFieldsValue()}
          onEdit={handleEditStep}
          onConfirm={handleSubmit}
          loading={loading}
        />
      ),
    },
  ];

  // Rendu de l'étape de bienvenue
  if (showWelcome) {
    return (
      <div className="min-h-screen assistant-creation-page bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container px-4 py-8 mx-auto">
          <WelcomeStep onStart={handleStart} />
        </div>
      </div>
    );
  }

  // Rendu du wizard principal
  return (
    <div className="min-h-screen assistant-creation-page bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header avec progression */}
          <div className="mb-8 text-center">
            <Title level={2} className="!mb-4">
              Création de votre assistant AlloKoli
            </Title>

            <div className="max-w-3xl mx-auto mb-6">
              <Steps
                current={currentStep}
                size="small"
                items={wizardSteps.map((step) => ({
                  title: step.title,
                  description: step.description,
                }))}
              />
            </div>

            <div className="text-sm text-gray-500">
              Étape {currentStep + 1} sur {wizardSteps.length}
            </div>
          </div>

          {error && (
            <Alert
              message="Erreur"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
              style={{ marginBottom: 24 }}
            />
          )}

          {/* Contenu de l'étape actuelle */}
          <div className="p-8 mb-6 bg-white shadow-lg rounded-2xl">
            <Form
              form={form}
              layout="vertical"
              scrollToFirstError
              initialValues={{
                modelProvider: "openai",
                modelName: "gpt-4o",
                modelTemperature: 0.7,
                modelMaxTokens: 1024,
                voiceProvider: "eleven-labs",
                voiceId: "jennifer",
                firstMessage:
                  "Bonjour, je suis votre assistant. Comment puis-je vous aider aujourd'hui ?",
              }}
            >
              {wizardSteps[currentStep].component}
            </Form>
          </div>

          {/* Navigation */}
          {currentStep < wizardSteps.length - 1 && (
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                className="px-6 py-3 font-medium text-gray-600 transition-colors hover:text-gray-800"
              >
                ← Précédent
              </button>

              <button
                onClick={handleNext}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Suivant →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
