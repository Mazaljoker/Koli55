'use client';

export default function UsageBillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-allokoli-purple-800">Utilisation et Facturation</h1>
        <p className="text-allokoli-blue-700 mt-2">Suivez votre consommation et gérez vos factures</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-allokoli-purple-700">Minutes utilisées</h3>
          <p className="text-3xl font-bold text-allokoli-purple-900">426 <span className="text-base font-normal text-gray-500">/ 1000</span></p>
          <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-allokoli-purple-500 to-allokoli-purple-600 rounded-full" style={{ width: '42.6%' }}></div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-allokoli-blue-700">Appels passés</h3>
          <p className="text-3xl font-bold text-allokoli-blue-900">124</p>
          <p className="text-sm text-gray-500 mt-3">Dernier mois: +12% vs période précédente</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-semibold mb-2 text-allokoli-ocean-700">Coût actuel</h3>
          <p className="text-3xl font-bold text-allokoli-ocean-900">87,40 €</p>
          <p className="text-sm text-gray-500 mt-3">Prochaine facture: 01/06/2023</p>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-allokoli-purple-800 mb-4">Historique de facturation</h2>
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minutes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appels</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Mai 2023</td>
                  <td className="px-6 py-4 whitespace-nowrap">426</td>
                  <td className="px-6 py-4 whitespace-nowrap">124</td>
                  <td className="px-6 py-4 whitespace-nowrap">87,40 €</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">En cours</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Avril 2023</td>
                  <td className="px-6 py-4 whitespace-nowrap">752</td>
                  <td className="px-6 py-4 whitespace-nowrap">198</td>
                  <td className="px-6 py-4 whitespace-nowrap">132,50 €</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Payé</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">Mars 2023</td>
                  <td className="px-6 py-4 whitespace-nowrap">528</td>
                  <td className="px-6 py-4 whitespace-nowrap">143</td>
                  <td className="px-6 py-4 whitespace-nowrap">95,20 €</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Payé</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 