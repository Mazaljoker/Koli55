import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-10">
      <h1 className="text-4xl font-bold mb-6">Bienvenue sur Koli55</h1>
      <p className="text-xl mb-8 text-center max-w-2xl">
        Une plateforme moderne pour vos besoins d'assistance IA
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link href="/dashboard" 
              className="p-6 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="text-2xl font-semibold mb-2">Dashboard</h2>
          <p>Accédez à votre tableau de bord et gérez vos ressources</p>
        </Link>
        
        <Link href="/auth/login"
              className="p-6 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <h2 className="text-2xl font-semibold mb-2">Connexion</h2>
          <p>Connectez-vous à votre compte pour accéder à toutes les fonctionnalités</p>
        </Link>
      </div>
    </div>
  )
} 