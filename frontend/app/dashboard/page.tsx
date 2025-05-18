export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Tableau de bord</h1>
      <p className="mb-6">Bienvenue sur votre tableau de bord Koli55.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Applications</h3>
          <p className="text-3xl font-bold">5</p>
        </div>
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Utilisateurs</h3>
          <p className="text-3xl font-bold">125</p>
        </div>
        <div className="border p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Documents</h3>
          <p className="text-3xl font-bold">35</p>
        </div>
      </div>

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mb-4">Activité récente</h2>
      <div className="border p-6 rounded-lg shadow-sm">
        <p>Aucune activité récente à afficher.</p>
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