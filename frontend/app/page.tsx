import Link from "next/link";
import LandingPage from "./landing-page";

export default function HomePage() {
  return (
    <div>
      {/* Navigation rapide pour les tests (seulement en développement) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed z-50 max-w-xs p-4 bg-white border rounded-lg shadow-lg top-4 right-4">
          <h3 className="mb-2 text-sm font-bold">🔧 Navigation Dev</h3>
          <div className="space-y-1 text-xs">
            <Link
              href="/dashboard"
              className="block p-1 rounded hover:bg-blue-50"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/configurateur"
              className="block p-1 rounded hover:bg-blue-50"
            >
              ⚙️ Configurateur
            </Link>
            <Link
              href="/vapi-configurator"
              className="block p-1 rounded hover:bg-blue-50"
            >
              🎤 Vapi Configurator
            </Link>
            <Link
              href="/assistants/new"
              className="block p-1 rounded hover:bg-blue-50"
            >
              ➕ Nouvel Assistant
            </Link>
            <Link
              href="/dashboard/assistants"
              className="block p-1 rounded hover:bg-blue-50"
            >
              🤖 Gestion Assistants
            </Link>
            <Link
              href="/dashboard/phone-numbers"
              className="block p-1 rounded hover:bg-blue-50"
            >
              📞 Numéros
            </Link>
            <Link
              href="/dashboard/settings"
              className="block p-1 rounded hover:bg-blue-50"
            >
              ⚙️ Paramètres
            </Link>
          </div>
        </div>
      )}

      <LandingPage />
    </div>
  );
}
