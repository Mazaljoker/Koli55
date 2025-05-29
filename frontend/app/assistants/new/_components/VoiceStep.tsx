"use client";

import React, { useState, useEffect } from "react";
import { Form, Select, Typography, Button, Card } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import {
  AssistantStepProps,
  VOICE_PROVIDERS,
  VOICES,
} from "../../../../components/assistants/AssistantFormTypes";

const { Paragraph } = Typography;
const { Option } = Select;

const VoiceStep: React.FC<AssistantStepProps> = ({ form }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoiceProvider, setSelectedVoiceProvider] = useState<string>(
    form.getFieldValue("voiceProvider") || "11labs"
  );
  const [availableVoices, setAvailableVoices] = useState(
    VOICES[selectedVoiceProvider] || []
  );
  const [selectedVoice, setSelectedVoice] = useState<string | null>(
    form.getFieldValue("voiceId") || null
  );

  useEffect(() => {
    // Mettre à jour les voix disponibles quand le provider change
    const voices = VOICES[selectedVoiceProvider] || [];
    setAvailableVoices(voices);

    // Si la voix actuelle n'est pas disponible avec le nouveau provider,
    // sélectionner la première voix disponible
    const currentVoice = form.getFieldValue("voiceId");
    const voiceExists = voices.some((v) => v.value === currentVoice);

    if (!voiceExists && voices.length > 0) {
      const newVoice = voices[0].value;
      form.setFieldsValue({ voiceId: newVoice });
      setSelectedVoice(newVoice);
    }
  }, [selectedVoiceProvider, form]);

  // Simuler la lecture d'un exemple audio de la voix
  const handlePlaySample = () => {
    setIsPlaying(true);
    // Dans une implémentation réelle, ici on jouerait l'audio sample
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000); // Simule une lecture de 3 secondes
  };

  const handleVoiceProviderChange = (value: string) => {
    setSelectedVoiceProvider(value);
  };

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value);
  };

  // Déterminer si on peut écouter l'exemple (voix sélectionnée)
  const canPreview = selectedVoice !== null;

  return (
    <div className="wizard-form-section">
      {/* Section: Choix du fournisseur de voix */}
      <Card
        title="Fournisseur de voix"
        variant="borderless"
        className="mb-4"
        style={{ marginBottom: "24px" }}
      >
        <Paragraph style={{ marginBottom: "16px" }}>
          Choisissez le service qui produira la voix de votre assistant lors des
          appels téléphoniques.
        </Paragraph>

        <Form.Item
          name="voiceProvider"
          rules={[
            { required: true, message: "Le fournisseur de voix est requis" },
          ]}
        >
          <Select
            size="large"
            onChange={handleVoiceProviderChange}
            style={{ width: "100%" }}
          >
            {VOICE_PROVIDERS.map((provider) => (
              <Option key={provider.value} value={provider.value}>
                <div style={{ padding: "4px 0" }}>
                  <div style={{ fontWeight: 500 }}>{provider.label}</div>
                  {provider.description && (
                    <div className="option-description">
                      {provider.description}
                    </div>
                  )}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Card>

      {/* Section: Choix de la voix spécifique */}
      <Card
        title="Voix"
        variant="borderless"
        className="mb-4"
        style={{ marginBottom: "24px" }}
      >
        <Paragraph style={{ marginBottom: "16px" }}>
          Sélectionnez la voix qui définira comment votre assistant sonnera lors
          des appels.
        </Paragraph>

        <Form.Item
          name="voiceId"
          rules={[{ required: true, message: "La voix est requise" }]}
        >
          <Select
            size="large"
            onChange={handleVoiceChange}
            style={{ width: "100%" }}
          >
            {availableVoices.map((voice) => (
              <Option key={voice.value} value={voice.value}>
                <div style={{ padding: "4px 0" }}>
                  <div style={{ fontWeight: 500 }}>{voice.label}</div>
                  {voice.description && (
                    <div className="option-description">
                      {voice.description}
                    </div>
                  )}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Card>

      {/* Section: Prévisualisation de la voix */}
      <Card
        title="Prévisualisation de la voix"
        variant="borderless"
        className="mb-4"
        style={{ textAlign: "center" }}
      >
        <Paragraph style={{ marginBottom: "16px" }}>
          Écoutez un exemple de la voix sélectionnée pour vous assurer
          qu&apos;elle correspond à l&apos;identité de votre assistant.
        </Paragraph>

        <div style={{ padding: "20px 0" }}>
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={handlePlaySample}
            disabled={!canPreview}
            style={
              canPreview
                ? { boxShadow: "0 0 10px rgba(119, 69, 255, 0.5)" }
                : {}
            }
          />

          <Paragraph
            style={{ marginTop: "12px", opacity: canPreview ? 1 : 0.6 }}
          >
            {canPreview
              ? "Cliquez pour écouter un exemple"
              : "Sélectionnez une voix pour l'aperçu"}
          </Paragraph>
        </div>
      </Card>
    </div>
  );
};

export default VoiceStep;
