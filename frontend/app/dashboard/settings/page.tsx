'use client';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-allokoli-purple-800">Paramètres</h1>
        <p className="text-allokoli-blue-700 mt-2">Gérez les paramètres de votre compte</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-allokoli-purple-700">Informations du compte</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Email</span>
              <span className="font-medium">utilisateur@allokoli.com</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plan</span>
              <span className="font-medium">Premium</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Date d&apos;inscription</span>
              <span className="font-medium">12 mai 2023</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-allokoli-blue-700">Préférences</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Notifications</span>
              <div className="relative inline-block w-12 h-6 rounded-full bg-allokoli-blue-200">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transform translate-x-6 transition-transform"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mode sombre</span>
              <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Rapports hebdomadaires</span>
              <div className="relative inline-block w-12 h-6 rounded-full bg-allokoli-blue-200">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transform translate-x-6 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 border-t pt-8 border-gray-100">
        <h2 className="text-xl font-semibold text-allokoli-purple-700 mb-4">Paramètres API</h2>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium">Clé API</span>
            <span className="text-gray-500">••••••••••••••••••••••</span>
          </div>
        </div>
      </div>
    </div>
  );
} 