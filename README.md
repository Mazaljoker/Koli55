# Koli55 V2 - AlloKoli Chat Interface

Application Next.js moderne avec intégration Supabase et Vapi pour les appels vocaux intelligents.

## 🚀 Fonctionnalités

- **Interface Chat Intelligente** : Chat en temps réel avec IA
- **Appels Vocaux** : Intégration Vapi pour les communications vocales
- **Backend Supabase** : Base de données et fonctions Edge
- **UI Moderne** : Interface utilisateur avec Tailwind CSS et shadcn/ui
- **TypeScript** : Développement type-safe

## 📁 Structure du Projet

```
Koli55/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   └── ...
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   └── AlloKoliChatInterface.tsx
├── lib/                  # Utilitaires
├── supabase/            # Configuration et fonctions Supabase
│   ├── functions/       # Edge Functions
│   └── migrations/      # Migrations de base de données
└── types/              # Types TypeScript
```

## 🛠️ Installation

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## 🔧 Configuration

1. Copier `.env.example` vers `.env.local`
2. Configurer les variables d'environnement Supabase
3. Configurer les clés API Vapi

## 📝 Variables d'Environnement

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VAPI_API_KEY=your_vapi_api_key
```

## 🚀 Déploiement

L'application peut être déployée sur Vercel, Netlify ou toute autre plateforme supportant Next.js.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou proposer une pull request.

## 📄 Licence

Ce projet est sous licence MIT.
