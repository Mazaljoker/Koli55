"use client";

import React from "react";
import { Button } from "@/components/ui/buttons";
import { Plus, Download, Settings, Trash2, Save } from "lucide-react";

export default function TestButtonsPage() {
  const handleAsyncAction = async () => {
    console.log("Action asynchrone démarrée...");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Action asynchrone terminée !");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          🎛️ Système de Boutons Unifié - AlloKoli
        </h1>

        <div className="space-y-8">
          {/* Variantes */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Variantes
            </h2>
            <div className="flex gap-3 flex-wrap">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </section>

          {/* Tailles */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Tailles
            </h2>
            <div className="flex gap-3 items-center flex-wrap">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </section>

          {/* États */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">États</h2>
            <div className="flex gap-3 flex-wrap">
              <Button loading>Loading...</Button>
              <Button disabled>Disabled</Button>
              <Button loading loadingText="Traitement...">
                Custom Loading Text
              </Button>
            </div>
          </section>

          {/* Avec icônes */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Avec icônes
            </h2>
            <div className="flex gap-3 flex-wrap">
              <Button leftIcon={<Plus className="w-4 h-4" />}>Ajouter</Button>
              <Button
                rightIcon={<Download className="w-4 h-4" />}
                variant="outline"
              >
                Télécharger
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Supprimer
              </Button>
            </div>
          </section>

          {/* Actions asynchrones */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Actions asynchrones
            </h2>
            <div className="flex gap-3 flex-wrap">
              <Button
                asyncAction={handleAsyncAction}
                loadingText="Sauvegarde en cours..."
                leftIcon={<Save className="w-4 h-4" />}
              >
                Sauvegarder
              </Button>

              <Button
                asyncAction={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 1500));
                  alert("Upload terminé !");
                }}
                loadingText="Upload..."
                variant="outline"
              >
                Upload File
              </Button>
            </div>
          </section>

          {/* Pleine largeur */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Pleine largeur
            </h2>
            <div className="space-y-3">
              <Button fullWidth>Bouton pleine largeur</Button>
              <Button fullWidth variant="outline">
                Bouton outline pleine largeur
              </Button>
            </div>
          </section>

          {/* Formulaires */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Exemple de formulaire
            </h2>
            <div className="flex gap-3 justify-end">
              <Button variant="outline">Annuler</Button>
              <Button
                asyncAction={async () => {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  alert("Formulaire soumis !");
                }}
                loadingText="Envoi..."
              >
                Confirmer
              </Button>
            </div>
          </section>

          {/* Boutons personnalisés */}
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Personnalisations
            </h2>
            <div className="flex gap-3 flex-wrap">
              <Button
                className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
                size="lg"
              >
                Bouton personnalisé
              </Button>

              <Button
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                Succès custom
              </Button>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p>✅ Système de boutons unifié créé avec succès !</p>
          <p className="text-sm mt-2">
            Tous les boutons utilisent maintenant le même composant avec une API
            cohérente.
          </p>
        </div>
      </div>
    </div>
  );
}
