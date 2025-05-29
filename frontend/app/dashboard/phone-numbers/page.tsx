"use client";

import { useEffect, useState } from "react";
import { PlusCircle, Edit, Trash2, Phone } from "lucide-react";
import { Button, message } from "antd";

// Migration vers le SDK AlloKoli (conservé pour utilisation future)// import { useAlloKoliSDKWithAuth } from '../../../lib/hooks/useAlloKoliSDK';import { PhoneNumber } from '../../../lib/api/allokoli-sdk';

// Interface étendue pour les données mock avec propriétés additionnelles
interface PhoneNumberExtended extends PhoneNumber {
  alias?: string;
  status: string;
  assignedTo?: string;
}

export default function PhoneNumbersPage() {
  // SDK conservé pour utilisation future  // const sdk = useAlloKoliSDKWithAuth();
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les numéros via le SDK
  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const fetchPhoneNumbers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Note: La méthode listPhoneNumbers n'existe pas encore dans le SDK
      // Pour l'instant nous utilisons des données mock
      setError("API non implémentée - utilisation des données mock");

      // Fallback avec des données mock en développement
      if (process.env.NODE_ENV === "development") {
        setPhoneNumbers([
          {
            id: "phone-1",
            number: "+33 1 23 45 67 89",
            alias: "Support Client",
            status: "active",
            assignedTo: "Assistant Support",
            created_at: "2023-04-01T10:00:00Z",
            updated_at: "2023-05-12T10:00:00Z",
          },
          {
            id: "phone-2",
            number: "+33 6 12 34 56 78",
            alias: "Commercial",
            status: "active",
            assignedTo: "Assistant Commercial",
            created_at: "2023-04-05T10:00:00Z",
            updated_at: "2023-05-10T10:00:00Z",
          },
          {
            id: "phone-3",
            number: "+33 9 87 65 43 21",
            alias: "SAV",
            status: "inactive",
            assignedTo: "Non assigné",
            created_at: "2023-03-20T10:00:00Z",
            updated_at: "2023-04-15T10:00:00Z",
          },
        ]);
      }
    } catch (err: unknown) {
      console.error("Erreur lors du chargement des numéros:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  // Fonction conservée pour utilisation future
  // const handleDeletePhoneNumber = async (phoneId: string, phoneAlias: string) => {
  //   if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le numéro "${phoneAlias}" ? Cette action est irréversible.`)) {
  //     return;
  //   }
  //
  //   try {
  //     // Note: La méthode deletePhoneNumber n'existe pas encore dans le SDK
  //     // await sdk.deletePhoneNumber(phoneId);
  //     message.success(`Numéro "${phoneAlias}" supprimé avec succès`);
  //
  //     // Actualiser la liste
  //     setPhoneNumbers(prev => prev.filter(phone => phone.id !== phoneId));
  //
  //   } catch (err) {
  //     console.error('Erreur lors de la suppression:', err);
  //     message.error('Erreur lors de la suppression du numéro');
  //   }
  // };

  // Obtenir le statut formaté
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "active":
        return { text: "Actif", className: "bg-green-100 text-green-800" };
      case "inactive":
        return { text: "Inactif", className: "bg-gray-100 text-gray-800" };
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
          <h1 className="text-3xl font-bold text-purple-800">
            Numéros de téléphone
          </h1>
          <p className="mt-2 text-blue-700">
            Gérez vos numéros de téléphone pour vos assistants
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusCircle size={16} />}
          className="border-none shadow-md bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-lg"
          onClick={() => message.info("Ajout de numéro à venir")}
        >
          Ajouter un numéro
        </Button>
      </div>

      {error && phoneNumbers.length === 0 ? (
        <div className="p-4 rounded-lg bg-red-50">
          <p className="text-red-600">Erreur lors du chargement : {error}</p>
          <Button onClick={fetchPhoneNumbers} className="mt-2">
            Réessayer
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden bg-white rounded-lg shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Numéro
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Alias
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                    Assigné à
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {phoneNumbers.map((phoneNumber) => {
                  const statusDisplay = getStatusDisplay(phoneNumber.status);

                  return (
                    <tr key={phoneNumber.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3 bg-purple-100 rounded-full">
                            <Phone size={16} className="text-purple-600" />
                          </div>
                          <span>{phoneNumber.number}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {phoneNumber.alias}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDisplay.className}`}
                        >
                          {statusDisplay.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {phoneNumber.assignedTo}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Modifier"
                            aria-label="Modifier le numéro"
                            onClick={() => message.info("Modification à venir")}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                            aria-label="Supprimer le numéro"
                            onClick={() => message.info("Suppression à venir")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="p-6 mt-6 border rounded-lg bg-allokoli-purple-50 border-allokoli-purple-200">
        <h3 className="mb-3 text-lg font-semibold text-allokoli-purple-800">
          Comprendre la gestion des numéros
        </h3>
        <p className="mb-4 text-gray-700">
          Les numéros de téléphone sont utilisés pour connecter vos assistants
          au réseau téléphonique. Chaque numéro peut être assigné à un assistant
          différent pour gérer des cas d&apos;usage spécifiques.
        </p>
        <div className="flex items-center">
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-3 rounded-full bg-allokoli-purple-100">
            <Phone size={20} className="text-allokoli-purple-600" />
          </div>
          <p className="text-sm text-gray-600">
            Vous pouvez acquérir de nouveaux numéros directement via notre
            plateforme ou importer des numéros existants.
          </p>
        </div>
      </div>
    </div>
  );
}
