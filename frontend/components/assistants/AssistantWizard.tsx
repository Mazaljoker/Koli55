"use client";

import React, { useState } from "react";
import {
  Form,
  Button,
  Alert,
  Typography,
  Space,
  Steps,
  FormInstance,
  Card,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { AssistantFormData } from "./AssistantFormTypes";
import "../../app/styles/wizard.css";

const { Title, Text } = Typography;
const { Step } = Steps;

// Types pour les étapes du wizard
interface WizardStep {
  key: string;
  title: string;
  description?: string;
  content: React.ReactNode;
  validationSchema?: {
    required?: string[];
    validator?: (values: Partial<AssistantFormData>) => {
      error: boolean;
      message?: string;
    };
  };
}

// Props pour le composant AssistantWizard
interface AssistantWizardProps {
  steps: WizardStep[];
  initialValues?: Partial<AssistantFormData>;
  onSubmit: (values: AssistantFormData) => Promise<void>;
  loading?: boolean;
  finishButtonText?: string;
  nextButtonText?: string;
  prevButtonText?: string;
  form?: FormInstance<AssistantFormData>;
}

const AssistantWizard: React.FC<AssistantWizardProps> = ({
  steps,
  initialValues = {},
  onSubmit,
  loading = false,
  finishButtonText = "Créer l'assistant",
  nextButtonText = "Suivant",
  prevButtonText = "Précédent",
  form, // Récupération du form depuis les props
}) => {
  // Utiliser soit le form passé en props, soit en créer un nouveau si non fourni
  const [internalForm] = Form.useForm<AssistantFormData>();
  const formInstance = form || internalForm;

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] =
    useState<Partial<AssistantFormData>>(initialValues);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Validation de l'étape courante et passage à la suivante
  const handleNext = async () => {
    try {
      // Valider les champs de l'étape actuelle
      const values = await formInstance.validateFields();

      // Validation personnalisée
      const step = steps[currentStep];
      if (step.validationSchema?.validator) {
        const { error, message } = step.validationSchema.validator(values);
        if (error) {
          setValidationError(message || "Validation échouée pour cette étape");
          return;
        }
      }

      // Mettre à jour les données du formulaire
      const updatedData = { ...formData, ...values };
      setFormData(updatedData);
      setValidationError(null);

      // Passer à l'étape suivante
      setCurrentStep(currentStep + 1);

      // Scroll en haut de la page
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (errorInfo) {
      console.log("Validation des champs échouée:", errorInfo);
    }
  };

  // Retourner à l'étape précédente
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setValidationError(null);

    // Scroll en haut de la page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Soumission finale du formulaire
  const handleFinish = async () => {
    try {
      // Valider les champs de la dernière étape
      const values = await formInstance.validateFields();

      // Validation personnalisée
      const step = steps[currentStep];
      if (step.validationSchema?.validator) {
        const { error, message } = step.validationSchema.validator(values);
        if (error) {
          setValidationError(message || "Validation échouée pour cette étape");
          return;
        }
      }

      // Préparer les données finales
      const finalData = { ...formData, ...values } as AssistantFormData;
      setValidationError(null);

      // Soumettre les données
      await onSubmit(finalData);
    } catch (errorInfo) {
      console.log("Validation des champs échouée:", errorInfo);
    }
  };

  return (
    <div className="wizard-container">
      {/* Indicateurs d'étapes et progression */}
      <div style={{ marginBottom: 40 }}>
        <Steps
          current={currentStep}
          onChange={(step) => step < currentStep && setCurrentStep(step)}
          style={{ maxWidth: 800, margin: "0 auto" }}
        >
          {steps.map((step) => (
            <Step
              key={step.key}
              title={step.title}
              description={step.description}
            />
          ))}
        </Steps>
      </div>

      {/* Card principale */}
      <Card className="wizard-card" style={{ maxWidth: 800, margin: "0 auto" }}>
        <Form
          form={formInstance}
          layout="vertical"
          initialValues={formData}
          scrollToFirstError
        >
          <Title level={4}>{steps[currentStep].title}</Title>

          {steps[currentStep].description && (
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 24 }}
            >
              {steps[currentStep].description}
            </Text>
          )}

          {validationError && (
            <Alert
              message="Erreur de validation"
              description={validationError}
              type="error"
              showIcon
              style={{ marginBottom: 24 }}
              closable
              onClose={() => setValidationError(null)}
            />
          )}

          <Divider style={{ margin: "16px 0" }} />

          <div className="wizard-form-content">
            {steps[currentStep].content}
          </div>

          <Divider style={{ margin: "24px 0 16px" }} />

          <div className="wizard-nav">
            <div>
              <Text style={{ fontSize: 14, fontWeight: 500 }}>
                Étape {currentStep + 1} sur {steps.length}
              </Text>
            </div>
            <Space>
              {currentStep > 0 && (
                <Button onClick={handlePrevious} icon={<ArrowLeftOutlined />}>
                  {prevButtonText}
                </Button>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  onClick={handleNext}
                  icon={<ArrowRightOutlined />}
                >
                  {nextButtonText}
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleFinish}
                  loading={loading}
                  icon={<CheckOutlined />}
                >
                  {finishButtonText}
                </Button>
              )}
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default AssistantWizard;
