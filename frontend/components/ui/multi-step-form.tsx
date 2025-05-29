'use client';

import React, { useState } from 'react';
import { Form, Steps, Card, Space, Divider, Alert } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import { Button } from "@/components/ui/Button";

const { Step } = Steps;

// Interface pour définir une étape du formulaire
interface FormStep {
  title: string;
  content: React.ReactNode;
  validationSchema?: {
    required?: string[];
    validator?: (values: Record<string, unknown>) => { error: boolean; message?: string };
  };
}

// Interface pour les propriétés du composant
interface MultiStepFormProps {
  steps: FormStep[];
  initialValues?: Record<string, unknown>;
  onFinish: (values: Record<string, unknown>) => void;
  loading?: boolean;
  showStepNumbers?: boolean;
  finishButtonText?: string;
  nextButtonText?: string;
  prevButtonText?: string;
}

// Composant principal du formulaire multi-étapes
const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  initialValues = {},
  onFinish,
  loading = false,
  showStepNumbers = true,
  finishButtonText = 'Terminer',
  nextButtonText = 'Suivant',
  prevButtonText = 'Précédent',
}) => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>(initialValues);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Fonction pour passer à l'étape suivante après validation
  const handleNext = async () => {
    try {
      // Valider les champs de l'étape actuelle
      const values = await form.validateFields();
      
      // Exécuter la validation personnalisée si elle existe
      const currentStep = steps[current];
      const validator = currentStep.validationSchema?.validator;
      
      if (validator) {
        const { error, message } = validator(values);
        if (error) {
          setValidationError(message || 'Validation échouée pour cette étape');
          return;
        }
      }
      
      // Fusionner les nouvelles valeurs avec les données existantes
      const updatedData = { ...formData, ...values };
      setFormData(updatedData);
      setValidationError(null);
      
      // Passer à l'étape suivante
      setCurrent(current + 1);
    } catch (errorInfo) {
      console.log('Validation des champs échouée:', errorInfo);
    }
  };

  // Fonction pour revenir à l'étape précédente
  const handlePrevious = () => {
    setCurrent(current - 1);
    setValidationError(null);
  };

  // Fonction pour compléter le formulaire
  const handleFinish = async () => {
    try {
      // Valider les champs de la dernière étape
      const values = await form.validateFields();
      
      // Exécuter la validation personnalisée si elle existe
      const currentStep = steps[current];
      const validator = currentStep.validationSchema?.validator;
      
      if (validator) {
        const { error, message } = validator(values);
        if (error) {
          setValidationError(message || 'Validation échouée pour cette étape');
          return;
        }
      }
      
      // Fusionner les nouvelles valeurs avec les données existantes
      const finalData = { ...formData, ...values };
      setValidationError(null);
      
      // Appeler la fonction de finalisation
      onFinish(finalData);
    } catch (errorInfo) {
      console.log('Validation des champs échouée:', errorInfo);
    }
  };

  // Obtenir le pourcentage de progression
  const getProgressPercentage = () => {
    return Math.round(((current + 1) / steps.length) * 100);
  };

  // Rendre le contenu de l'étape actuelle
  const renderStepContent = () => {
    return steps[current]?.content;
  };

  // Rendre les boutons de navigation
  const renderNavigationButtons = () => {
    const isLastStep = current === steps.length - 1;
    const isFirstStep = current === 0;
    
    return (
      <Space size="middle">
        {!isFirstStep && (
          <Button 
            onClick={handlePrevious}
            icon={<ArrowLeftOutlined />}
          >
            {prevButtonText}
          </Button>
        )}
        
        {isLastStep ? (
          <Button 
            type="primary" 
            onClick={handleFinish} 
            loading={loading}
            icon={<CheckOutlined />}
          >
            {finishButtonText}
          </Button>
        ) : (
          <Button 
            type="primary" 
            onClick={handleNext}
            icon={<ArrowRightOutlined />}
          >
            {nextButtonText}
          </Button>
        )}
      </Space>
    );
  };

  return (
    <div className="multi-step-form">
      <Card>
        <Steps 
          current={current} 
          size="small" 
          style={{ marginBottom: 20 }}
          percent={showStepNumbers ? getProgressPercentage() : undefined}
        >
          {steps.map((step, index) => (
            <Step key={index} title={step.title} />
          ))}
        </Steps>
        
        <Divider />
        
        {validationError && (
          <Alert
            message="Erreur de validation"
            description={validationError}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
            closable
            onClose={() => setValidationError(null)}
          />
        )}
        
        <Form
          form={form}
          layout="vertical"
          initialValues={formData}
          scrollToFirstError
        >
          {renderStepContent()}
        </Form>
        
        <Divider />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            Étape {current + 1} sur {steps.length}
          </div>
          {renderNavigationButtons()}
        </div>
      </Card>
    </div>
  );
};

export default MultiStepForm; 