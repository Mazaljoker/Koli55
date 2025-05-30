import React, { useState } from "react";
import cn from "classnames";
import { Button } from "@/components/ui";
import { Slider } from "@/components/ui/forms/Slider";
import { FiRefreshCw, FiSave, FiMessageSquare } from "react-icons/fi";

interface AvatarConfig {
  backgroundColorKey: string; // Va stocker la clé de la couleur Tailwind ex: 'avatar-blue'
  size: number;
}

const AVATAR_COLOR_PALETTE_KEYS = [
  "avatar-orange",
  "avatar-green",
  "avatar-blue",
  "avatar-gray",
  "allokoli-primary", // Utiliser une couleur du thème principal
];

const PRESET_AVATARS = [
  {
    id: "preset1",
    name: "Classique Cool",
    config: { backgroundColorKey: "avatar-blue", size: 100 },
  },
  {
    id: "preset2",
    name: "Énergie Vive",
    config: { backgroundColorKey: "avatar-orange", size: 110 },
  },
  {
    id: "preset3",
    name: "Nature Douce",
    config: { backgroundColorKey: "avatar-green", size: 90 },
  },
  {
    id: "preset4",
    name: "Thème AlloKoli",
    config: { backgroundColorKey: "allokoli-primary", size: 100 },
  },
];

const VOICE_SAMPLES = [
  { id: "voice1", name: "Voix Douce" },
  { id: "voice2", name: "Voix Énergique" },
];

export const AvatarCustomizer: React.FC = () => {
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    backgroundColorKey: "avatar-gray", // Clé par défaut
    size: 100,
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // État pour le chargement de la sauvegarde
  const [saveStatus, setSaveStatus] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null); // Pour les messages de succès/erreur

  const handleColorChange = (colorKey: string) => {
    setAvatarConfig((prev) => ({ ...prev, backgroundColorKey: colorKey }));
  };

  const handleSliderChange = (value: number[]) => {
    setAvatarConfig((prev) => ({ ...prev, size: value[0] }));
  };

  const applyPreset = (config: Partial<AvatarConfig>) => {
    setAvatarConfig((prev) => ({ ...prev, ...config }));
  };

  const handleReset = () => {
    setAvatarConfig({ backgroundColorKey: "avatar-gray", size: 100 });
    setSaveStatus(null); // Effacer les messages de statut lors du reset
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const response = await fetch("/api/avatar/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(avatarConfig),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la sauvegarde.");
      }

      setSaveStatus({ message: result.message, type: "success" });
      console.log("Configuration sauvegardée:", result.savedConfig);
    } catch (error) {
      let errorMessage = "Impossible de sauvegarder la configuration.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSaveStatus({ message: errorMessage, type: "error" });
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSpeaking = () => {
    setIsSpeaking(true);
    setTimeout(() => setIsSpeaking(false), 2000);
  };

  // Construit la classe Tailwind dynamiquement
  const avatarBgClass = `bg-${avatarConfig.backgroundColorKey}`;

  return (
    <div className="flex flex-col gap-8 p-4 rounded-lg shadow-xl lg:flex-row md:p-6 bg-allokoli-background text-allokoli-text-primary">
      <div className="flex flex-col items-center w-full gap-6 p-6 lg:w-1/3 rounded-xl glassmorphism card-primary">
        <h3 className="text-xl font-semibold text-allokoli-primary">
          Prévisualisation de l'Avatar
        </h3>
        <div
          className={cn(
            "relative rounded-full flex items-center justify-center transition-all duration-300 ease-in-out",
            avatarBgClass // Application de la classe de fond dynamique
          )}
          style={{
            width: `${64 * (avatarConfig.size / 100)}px`,
            height: `${64 * (avatarConfig.size / 100)}px`,
          }}
        >
          <div
            className="flex items-center justify-center rounded-full opacity-50 bg-allokoli-surface"
            style={{ width: "75%", height: "75%" }}
          >
            <span className="text-sm text-allokoli-text-secondary">Avatar</span>
          </div>
          {isSpeaking && (
            <div className="absolute p-3 bg-white rounded-lg shadow-md -top-8 -right-8 animate-pulse">
              <FiMessageSquare className="w-6 h-6 text-allokoli-primary" />
              <span className="absolute w-0 h-0 transform -translate-x-1/2 border-t-8 border-l-8 border-r-8 -bottom-2 left-1/2 border-l-transparent border-r-transparent border-t-white"></span>
            </div>
          )}
        </div>
        <Button variant="secondary" onClick={toggleSpeaking} className="w-full">
          Tester l'animation (Parler)
        </Button>
        <p className="mt-2 text-xs text-center text-allokoli-text-secondary">
          Cliquez sur l'avatar ou le bouton pour simuler une animation.
        </p>
      </div>

      <div className="w-full p-6 lg:w-2/3 rounded-xl glassmorphism card-secondary">
        <h3 className="mb-6 text-xl font-semibold text-allokoli-primary">
          Personnaliser votre Avatar
        </h3>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-allokoli-text-secondary">
            Couleur de fond
          </label>
          <div className="flex flex-wrap gap-2">
            {AVATAR_COLOR_PALETTE_KEYS.map((colorKey) => (
              <button
                key={colorKey}
                title={colorKey.replace("avatar-", "").replace("allokoli-", "")}
                onClick={() => handleColorChange(colorKey)}
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-all duration-150",
                  `bg-${colorKey}`, // Applique la couleur via classe Tailwind
                  avatarConfig.backgroundColorKey === colorKey
                    ? "border-allokoli-primary scale-110 ring-2 ring-allokoli-primary ring-offset-2 ring-offset-allokoli-surface"
                    : "border-allokoli-surface hover:border-allokoli-secondary"
                )}
              />
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-allokoli-text-secondary">
            Ajustements
          </label>
          <div className="space-y-4">
            <Slider
              label={`Taille de l'avatar (${avatarConfig.size}%)`}
              defaultValue={[avatarConfig.size]}
              min={50}
              max={150}
              step={1}
              onValueChange={handleSliderChange} // Simplifié
            />
            <p className="text-xs text-allokoli-text-secondary">
              D'autres sliders (yeux, bouche, etc.) peuvent être ajoutés.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-allokoli-text-secondary">
            Avatars Prédéfinis
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {PRESET_AVATARS.map((preset) => (
              <Button
                key={preset.id}
                variant="outline"
                onClick={() => applyPreset(preset.config)}
                className="justify-start h-auto py-2 text-xs leading-tight"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full mr-2 flex-shrink-0",
                    `bg-${preset.config.backgroundColorKey}`
                  )}
                />
                <span className="truncate">{preset.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block mb-2 text-sm font-medium text-allokoli-text-secondary">
            Échantillons Vocaux
          </label>
          <div className="space-y-2">
            {VOICE_SAMPLES.map((sample) => (
              <div
                key={sample.id}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer bg-allokoli-surface hover:bg-opacity-80"
              >
                <span className="text-sm">{sample.name}</span>
                <div className="w-20 h-5 rounded opacity-50 bg-allokoli-primary"></div>
              </div>
            ))}
            <p className="text-xs text-allokoli-text-secondary">
              Waveform animations à implémenter.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 border-t sm:flex-row border-allokoli-surface">
          <Button
            variant="secondary"
            onClick={handleReset}
            icon={<FiRefreshCw />}
            disabled={isSaving}
          >
            Réinitialiser
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            icon={<FiSave />}
            className="flex-grow"
            isLoading={isSaving} // Utilisation de la prop isLoading
            disabled={isSaving}
          >
            {isSaving ? "Sauvegarde..." : "Sauvegarder l&apos;Avatar"}
          </Button>
        </div>
        {/* Affichage des messages de succès ou d'erreur */}
        {saveStatus && (
          <div
            className={cn("mt-4 p-3 text-sm rounded-md text-center", {
              "bg-green-500/20 text-green-400 border border-green-500/50":
                saveStatus.type === "success",
              "bg-red-500/20 text-red-400 border border-red-500/50":
                saveStatus.type === "error",
            })}
          >
            {saveStatus.message}
          </div>
        )}
        <p className="mt-4 text-xs text-center text-allokoli-text-secondary">
          Drag & drop et aperçu en temps réel plus poussé à venir.
        </p>
      </div>
    </div>
  );
};
