import Link from "next/link";
import LandingPage from "./landing-page";

export default function HomePage() {
  return (
    <div>
      {/* Navigation rapide pour les tests (seulement en développement) */}
      {process.env.NODE_ENV === "development" && (
        <div className="fixed z-50 max-w-xs p-4 bg-allokoli-background border border-allokoli-border rounded-lg shadow-lg top-4 right-4">
          <h3 className="mb-2 text-sm font-bold text-allokoli-text-primary">
            🔧 Navigation Dev
          </h3>
          <div className="space-y-1 text-xs">
            <Link
              href="/dashboard"
              className="block p-1 rounded hover:bg-allokoli-surface text-allokoli-text-primary"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/configurateur"
              className="block p-1 rounded hover:bg-allokoli-surface text-allokoli-text-primary"
            >
              ⚙️ Configurateur
            </Link>
            <Link
              href="/vapi-configurator"
              className="block p-1 rounded hover:bg-allokoli-surface text-allokoli-text-primary"
            >
              🎤 Vapi Configurator
            </Link>
            <Link
              href="/assistants/new"
              className="block p-1 rounded hover:bg-allokoli-surface text-allokoli-text-primary"
            >
              ➕ Nouvel Assistant
            </Link>
            <Link
              href="/dashboard/assistants"
              className="block p-1 rounded hover:bg-allokoli-surface text-allokoli-text-primary"
            >
              🤖 Gestion Assistants
            </Link>
            <Link
              href="/dashboard/phone-numbers"
              className="block p-1 rounded hover:bg-allokoli-surface text-allokoli-text-primary"
            >
              📞 Numéros
            </Link>
            <Link
              href="/dashboard/settings"
              className="block p-1 rounded hover:bg-allokoli-surface text-allokoli-text-primary"
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
