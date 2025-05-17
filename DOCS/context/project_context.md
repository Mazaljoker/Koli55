# Contexte du Projet Allokoli

## Objectif
Allokoli est une plateforme no-code qui permet de créer des assistants vocaux IA en quelques minutes, sans compétences techniques. Elle vise à démocratiser l'accès à la technologie vocale IA pour les professionnels de tous secteurs.

## Principes fondamentaux
1. **Simplicité** : Interface intuitive permettant de créer un assistant en moins de 5 minutes
2. **Flexibilité** : Adaptable à de nombreux cas d'usage (service client, prise de RDV, qualification commerciale)
3. **Sécurité** : Protection des données et respect des normes RGPD/GDPR
4. **Performance** : Assistants vocaux de qualité grâce à l'intégration de Vapi.ai

## Technologies clés
- **Vapi.ai** : API vocale offrant une qualité supérieure pour les conversations téléphoniques IA
- **Supabase** : Backend serverless avec authentication et base de données PostgreSQL
- **Edge Functions** : Fonctions serverless pour la communication sécurisée avec Vapi.ai
- **Next.js** : Framework React pour l'interface utilisateur

## Cible utilisateurs
- PME souhaitant automatiser leur service client
- Professionnels libéraux (médecins, avocats) pour la prise de rendez-vous
- Téléprospecteurs cherchant à qualifier des leads à grande échelle
- Entreprises avec des besoins de support téléphonique 24/7

## Architecture technique
L'application suit une architecture API-first où:
- Le frontend n'interagit jamais directement avec les clés API de Vapi
- Toutes les communications avec Vapi passent par des Edge Functions Supabase
- Les données des utilisateurs et assistants sont stockées dans Supabase PostgreSQL
- L'authentification est gérée par Supabase Auth

## Phase actuelle
Le développement est structuré en phases, avec la Phase 5 actuellement en cours:
- Phase 5 : Développement des Edge Functions qui encapsulent l'API Vapi

## Roadmap
Une fois les Edge Functions développées, nous passerons à:
- L'intégration frontend (Phase 6)
- Le test des flux d'appels (Phase 7)
- Le monitoring et débogage (Phase 8)
- Le déploiement de production (Phase 9)
- L'ajout de fonctionnalités no-code avancées (Phase 10)
