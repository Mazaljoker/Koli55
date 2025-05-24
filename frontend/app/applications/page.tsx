export default function ApplicationsPage() {
  // Données fictives pour les applications
  const applications = [
    {
      id: 1,
      name: 'Application CRM',
      description: 'Système de gestion de la relation client',
      status: 'active',
    },
    {
      id: 2,
      name: 'Portail utilisateurs',
      description: 'Portail d\'accès pour les utilisateurs externes',
      status: 'active',
    },
    {
      id: 3,
      name: 'Tableau de bord Analytics',
      description: 'Visualisation des données et statistiques',
      status: 'development',
    },
    {
      id: 4,
      name: 'API Gateway',
      description: 'Interface pour les services externes',
      status: 'maintenance',
    },
  ];

  // Fonction pour obtenir la couleur de fond selon le statut
  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'development':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Applications</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Nouvelle application
        </button>
      </div>
      
      <p className="mb-6">
        Gérez vos applications et configurez vos intégrations avec le backend Supabase.
      </p>

      <div className="border rounded-lg shadow-sm overflow-hidden">
        <ul className="divide-y">
          {applications.map((item) => (
            <li key={item.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusBgColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-700">Modifier</button>
                  <button className="text-blue-500 hover:text-blue-700">Voir</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8">
        <a 
          href="/" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
} 