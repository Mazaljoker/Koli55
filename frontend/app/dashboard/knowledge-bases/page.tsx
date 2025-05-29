"use client";

import { useEffect, useState } from "react";
import {
  PlusCircle,
  Database,
  FileText,
  Clock,
  MoreHorizontal,
} from "lucide-react";
import { Button, message } from "antd";

// Migration vers le SDK AlloKoli
import { useAlloKoliSDKWithAuth } from "../../../lib/hooks/useAlloKoliSDK";
import { KnowledgeBase } from "../../../lib/api/allokoli-sdk";

// Interface étendue pour les données mock avec propriétés additionnelles
interface KnowledgeBaseExtended extends KnowledgeBase {
  fileCount?: number;
  lastUpdated?: string;
  status: string;
}

export default function KnowledgeBasesPage() {
  const sdk = useAlloKoliSDKWithAuth();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseExtended[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les bases de connaissances via le SDK
  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  const fetchKnowledgeBases = async () => {
    try {
      setLoading(true);
      setError(null);

      // Utiliser le SDK pour récupérer les bases de connaissances
      const response = await sdk.listKnowledgeBases();
      setKnowledgeBases(response.data as KnowledgeBaseExtended[]);
    } catch (err: unknown) {
      console.error(
        "Erreur lors du chargement des bases de connaissances:",
        err
      );
      setError(err instanceof Error ? err.message : "Erreur inconnue");

      // Fallback avec des données mock en développement
      if (process.env.NODE_ENV === "development") {
        setKnowledgeBases([
          {
            id: "kb-1",
            name: "Documentation produit",
            description: "Documentation technique et guides utilisateurs",
            fileCount: 24,
            lastUpdated: "2023-05-12T10:00:00Z",
            status: "active",
            created_at: "2023-04-01T10:00:00Z",
            updated_at: "2023-05-12T10:00:00Z",
          },
          {
            id: "kb-2",
            name: "FAQ support client",
            description: "Questions fréquentes et réponses pour le support",
            fileCount: 87,
            lastUpdated: "2023-05-02T10:00:00Z",
            status: "active",
            created_at: "2023-03-15T10:00:00Z",
            updated_at: "2023-05-02T10:00:00Z",
          },
          {
            id: "kb-3",
            name: "Catalogues produits",
            description: "Liste des produits et services avec descriptions",
            fileCount: 18,
            lastUpdated: "2023-04-28T10:00:00Z",
            status: "processing",
            created_at: "2023-04-20T10:00:00Z",
            updated_at: "2023-04-28T10:00:00Z",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonction conservée pour utilisation future  // const handleDeleteKnowledgeBase = async (kbId: string, kbName: string) => {  //   try {  //     await sdk.deleteKnowledgeBase(kbId);  //     message.success(`Base de connaissances "${kbName}" supprimée avec succès`);  //       //     // Actualiser la liste  //     setKnowledgeBases(prev => prev.filter(kb => kb.id !== kbId));  //       //   } catch (err) {  //     console.error('Erreur lors de la suppression:', err);  //     message.error('Erreur lors de la suppression de la base de connaissances');  //   }  // };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  // Calculer la taille estimée
  const getEstimatedSize = (fileCount: number): string => {
    const avgSizePerFile = 0.5; // MB moyen par fichier
    const totalSize = fileCount * avgSizePerFile;
    return `${totalSize.toFixed(1)} MB`;
  };

  // Obtenir le statut formaté
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "active":
        return { text: "Actif", className: "bg-green-100 text-green-800" };
      case "processing":
        return {
          text: "En indexation",
          className: "bg-blue-100 text-blue-800",
        };
      case "error":
        return { text: "Erreur", className: "bg-red-100 text-red-800" };
      default:
        return { text: "Inconnu", className: "bg-gray-100 text-gray-800" };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-b-2 border-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-allokoli-purple-800">
            Bases de connaissances
          </h1>
          <p className="mt-2 text-allokoli-blue-700">
            Gérez les données utilisées par vos assistants IA
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusCircle size={16} />}
          className="border-none shadow-md bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-lg"
          onClick={() => message.info("Ajout de base de connaissances à venir")}
        >
          Ajouter une base
        </Button>
      </div>

      {error && knowledgeBases.length === 0 ? (
        <div className="p-4 rounded-lg bg-red-50">
          <p className="text-red-600">Erreur lors du chargement : {error}</p>
          <Button onClick={fetchKnowledgeBases} className="mt-2">
            Réessayer
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 mt-8 lg:grid-cols-3">
          {knowledgeBases.map((kb) => {
            const statusDisplay = getStatusDisplay(kb.status);

            return (
              <div
                key={kb.id}
                className="overflow-hidden transition-all bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-lg bg-allokoli-purple-100">
                        <Database size={20} className="text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-allokoli-purple-800">
                        {kb.name}
                      </h3>
                    </div>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="Plus d'options"
                      aria-label="Plus d'options pour cette base de connaissances"
                      onClick={() => message.info("Options à venir")}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </div>

                  <p className="mt-3 mb-4 text-gray-600">{kb.description}</p>

                  <div className="flex items-center mt-4 text-sm text-gray-500">
                    <div className="flex items-center mr-4">
                      <FileText size={14} className="mr-1" />
                      <span>{kb.fileCount || 0} documents</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>Mis à jour le {formatDate(kb.updated_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDisplay.className}`}
                  >
                    {statusDisplay.text}
                  </span>
                  <span className="text-sm text-gray-500">
                    {getEstimatedSize(kb.fileCount || 0)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Carte pour ajouter une nouvelle base */}
          <div
            className="bg-white rounded-xl border border-dashed border-gray-300 shadow-sm p-6 flex flex-col items-center justify-center min-h-[220px] cursor-pointer hover:border-allokoli-purple-400 transition-colors"
            onClick={() =>
              message.info("Création de base de connaissances à venir")
            }
          >
            <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-allokoli-purple-100">
              <PlusCircle size={24} className="text-purple-600" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-allokoli-purple-800">
              Ajouter une base
            </h3>
            <p className="text-sm text-center text-gray-500">
              Créez une nouvelle base de connaissances pour enrichir vos
              assistants
            </p>
          </div>
        </div>
      )}

      <div className="p-6 mt-6 border rounded-lg bg-allokoli-blue-50 border-allokoli-blue-200">
        <h3 className="mb-3 text-lg font-semibold text-allokoli-blue-800">
          À propos des bases de connaissances
        </h3>
        <p className="mb-4 text-gray-700">
          Les bases de connaissances permettent à vos assistants d&apos;accéder
          à des informations spécifiques à votre entreprise. Vous pouvez
          importer des documents, des FAQ, des catalogues ou tout autre texte
          pertinent.
        </p>
        <div className="flex items-center mt-4 space-x-4">
          <Button
            className="text-allokoli-blue-700 border-allokoli-blue-300"
            onClick={() => message.info("Guide à venir")}
          >
            Guide d&apos;utilisation
          </Button>
          <Button
            className="text-allokoli-blue-700 border-allokoli-blue-300"
            onClick={() => message.info("Documentation formats à venir")}
          >
            Formats supportés
          </Button>
        </div>
      </div>
    </div>
  );
}
