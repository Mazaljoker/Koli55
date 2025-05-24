# Cahier des Charges Détaillé – AlloKoli "5-Minute Voice Wizard"

## I. Introduction et Contexte du Projet Détaillé

### I.A. Présentation du projet AlloKoli et de sa vision stratégique

AlloKoli se positionne avec une mission claire : démocratiser l'accès à l'intelligence artificielle (IA) vocale pour les Petites et Moyennes Entreprises (PME) et les artisans. Ces segments de marché, souvent confrontés à des ressources techniques et budgétaires limitées, peinent à accéder à des solutions d'IA personnalisées. La vision stratégique d'AlloKoli est de combler cette lacune en fournissant un outil "self-service" intuitif et puissant. Cet outil permettra à des utilisateurs non techniques de créer et de déployer des assistants vocaux personnalisés en un temps record, transformant ainsi une technologie perçue comme complexe et onéreuse en un levier de croissance accessible.

Le produit phare incarnant cette vision est le "5-Minute Voice Wizard". Ce dernier est conçu pour mettre l'accent sur la rapidité de mise en œuvre, la simplicité d'utilisation et l'autonomie complète de l'utilisateur final. L'objectif est de permettre la génération d'un assistant vocal opérationnel en moins de cinq minutes, sans nécessiter la moindre intervention de développeurs ou d'experts en IA.

### I.B. Problématiques adressées et proposition de valeur pour les PME/artisans

Les PME et artisans font face à plusieurs défis majeurs qui freinent l'adoption des technologies d'IA vocale :

#### Problématiques identifiées :

- **Déficit de compétences techniques** : La majorité de ces entreprises ne disposent pas des compétences internes nécessaires pour développer, intégrer ou maintenir des solutions d'IA vocale.
- **Coûts prohibitifs** : Les solutions d'IA vocale sur mesure ou les plateformes avancées représentent souvent un investissement initial et des coûts récurrents trop élevés.
- **Complexité des outils existants** : De nombreuses plateformes d'IA vocale présentent une courbe d'apprentissage abrupte, décourageant les utilisateurs non spécialisés.
- **Difficulté d'expérimentation** : Le prototypage, le test et l'itération rapide sur des assistants vocaux sont souvent des processus longs et coûteux.
- **Besoins non couverts** : Un besoin croissant d'améliorer l'engagement client, d'optimiser la collecte d'informations, d'automatiser la réponse aux questions fréquentes ou la prise de rendez-vous par la voix.

#### Proposition de valeur d'AlloKoli :

- **Simplicité Radicale** : Le "5-Minute Voice Wizard" promet la création d'un assistant vocal fonctionnel en moins de cinq minutes, grâce à une interface purement conversationnelle (vocale ou textuelle). L'utilisateur dialogue avec un assistant configurateur intelligent qui le guide à travers les étapes nécessaires.
- **Autonomie Complète** : Aucune compétence technique préalable n'est requise. L'utilisateur est entièrement autonome dans la création, le test, le déploiement et la modification de son assistant.
- **Coût Abordable** : L'architecture 100% serverless et optimisée vise à minimiser les coûts opérationnels, permettant de proposer une tarification attractive et accessible aux PME et artisans.
- **Déploiement Instantané** : Une fois configuré, l'assistant vocal se voit attribuer immédiatement un numéro de téléphone réel, permettant un test en conditions réelles et une mise en service immédiate.
- **Itération Facile** : Un tableau de bord (dashboard) simplifié offre la possibilité de consulter l'historique des interactions, de modifier le comportement de l'assistant (notamment son prompt) et de le tester à nouveau, favorisant une amélioration continue.

### I.C. Objectifs métier et techniques du "5-Minute Voice Wizard"

La réussite du projet sera mesurée à l'aune d'objectifs métier et techniques précis.

#### Objectifs métier :

- Atteindre un taux d'onboarding réussi (assistant créé et testable) d'au moins 85%.
- Permettre à 90% des utilisateurs de compléter le parcours de création de leur assistant en moins de 5 minutes.
- Valider la viabilité économique du modèle en atteignant un revenu moyen par utilisateur actif (ARPU) cible.
- Obtenir un score de satisfaction client (CSAT ou NPS) élevé, reflétant la facilité d'utilisation et la valeur perçue.
- Pénétrer significativement le marché des PME et artisans en France (et potentiellement à l'international) avec une solution innovante et disruptive.
- Réduire la charge de travail des PME en automatisant une partie de leurs interactions clients.

#### Objectifs techniques :

- Assurer une génération de la configuration JSON de l'assistant (AssistantConfig) valide dans au moins 98% des cas.
- Garantir une disponibilité de service (uptime) pour la plateforme AlloKoli (Dashboard, MCP Server) de 99,5% sur une base mensuelle.
- Maintenir un temps de création effectif de l'assistant (opérations backend après soumission de la configuration) inférieur à 2 secondes.
- Développer une architecture capable de supporter nativement au moins 1000 assistants actifs simultanément et de gérer des pics de charge allant jusqu'à 50 requêtes par seconde sur le serveur MCP.
- Assurer une conformité stricte avec le Règlement Général sur la Protection des Données (RGPD) pour toutes les données utilisateurs et les données traitées par les assistants vocaux.
- Maintenir une latence de réponse de l'assistant configurateur et des assistants générés qui permette une conversation fluide et naturelle.

### I.D. Description détaillée des cibles utilisateurs (personas) et de leurs besoins spécifiques

Pour affiner la conception et s'assurer que le produit réponde aux attentes, trois personas principaux ont été identifiés :

#### Persona 1 : Le Gérant de Petite Entreprise (Ex: Restaurateur, Propriétaire de salon de beauté, Garagiste)

**Description** : Dirige une petite structure, souvent avec peu d'employés. Est très impliqué dans l'opérationnel et la relation client.

**Besoins spécifiques** :
- Automatiser la réponse aux questions fréquentes (horaires d'ouverture, adresse, services proposés, prix de base).
- Prendre des réservations ou des demandes de devis simples.
- Recueillir des messages et les coordonnées des clients en dehors des heures d'ouverture.
- Qualifier basiquement des prospects avant de les rappeler.

**Compétences techniques** : Généralement faibles à moyennes. Utilise des outils bureautiques standards, des applications mobiles, et les réseaux sociaux pour son entreprise. Peut être intimidé par des solutions trop techniques.

**Attentes vis-à-vis d'AlloKoli** : Une solution "clé en main", extrêmement intuitive ("ça marche tout seul"), avec des résultats visibles rapidement et un coût transparent et maîtrisé. L'aspect "5 minutes" est très attractif.

#### Persona 2 : L'Artisan Indépendant (Ex: Plombier, Électricien, Jardinier)

**Description** : Travaille souvent seul ou avec une très petite équipe, fréquemment en déplacement sur des chantiers. Son téléphone est son principal outil de travail.

**Besoins spécifiques** :
- Filtrer les appels entrants pour distinguer les urgences des demandes non prioritaires.
- Planifier des rendez-vous ou des interventions.
- Fournir des informations de base sur ses tarifs horaires ou zones d'intervention.
- Éviter de perdre des opportunités d'affaires lorsqu'il est occupé et ne peut pas répondre.

**Compétences techniques** : Généralement faibles. Utilise son smartphone pour la majorité de ses tâches numériques.

**Attentes vis-à-vis d'AlloKoli** : Simplicité d'utilisation maximale, accessible et gérable depuis un mobile. L'efficacité et le gain de temps sont primordiaux. L'assistant doit être fiable pour ne pas manquer d'appels importants.

#### Persona 3 : Le Consultant / Freelance / Profession Libérale (Ex: Coach, Formateur, Thérapeute)

**Description** : Gère sa propre activité, souvent axée sur la prestation de services intellectuels ou de conseil. La gestion du temps et la qualification des contacts sont importantes.

**Besoins spécifiques** :
- Automatiser la prise de rendez-vous et la gestion des créneaux disponibles.
- Répondre aux questions sur ses offres de service, ses tarifs, ses disponibilités.
- Collecter des informations préliminaires auprès des prospects avant un premier entretien (qualification).
- Diffuser des informations pratiques (accès, préparation à une séance).

**Compétences techniques** : Moyennes à bonnes. Est généralement à l'aise avec les outils SaaS, les calendriers en ligne, et potentiellement des CRM légers.

**Attentes vis-à-vis d'AlloKoli** : Flexibilité dans la personnalisation du discours de l'assistant, possibilité de définir des scénarios de questions/réponses un peu plus élaborés. Une intégration future (même simple) avec des outils de calendrier serait un plus.

### I.E. Lexique des termes techniques et métier

Une compréhension commune des termes est essentielle pour la réussite du projet.

- **IA Vocale (Intelligence Artificielle Vocale)** : Domaine de l'intelligence artificielle axé sur la capacité des machines à comprendre la parole humaine (ASR) et/ou à générer de la parole synthétique (TTS).
- **Assistant Vocal** : Agent logiciel programmé pour interagir avec des utilisateurs humains par le biais de la voix, capable d'exécuter des tâches ou de fournir des informations.
- **Vapi** : Plateforme et ensemble de SDK (Software Development Kits) spécialisés dans la création et le déploiement d'assistants vocaux basés sur l'IA. Vapi gère les aspects complexes de la conversation en temps réel, l'intégration avec les modèles de langage (LLM), l'ASR et le TTS.
- **MCP (Model Context Protocol)** : Standard ouvert, initialement proposé par Anthropic, visant à normaliser la manière dont les modèles de langage (LLM) accèdent et interagissent avec des outils externes, des bases de données, et d'autres sources de contexte. Il facilite la création d'agents IA plus capables et modulaires.
- **Supabase** : Plateforme open-source de type Backend-as-a-Service (BaaS). Elle fournit une base de données PostgreSQL hébergée, des services d'authentification, de stockage de fichiers, et des fonctions serverless (Edge Functions).
- **Edge Functions (Supabase)** : Fonctions serverless, écrites en TypeScript/JavaScript et exécutées sur l'infrastructure globale de Deno Deploy. Elles sont conçues pour être géographiquement proches des utilisateurs afin de minimiser la latence.
- **Serverless** : Modèle d'architecture cloud où le fournisseur de services cloud gère dynamiquement l'allocation et la mise à l'échelle des ressources serveur. Les développeurs se concentrent sur le code sans gérer l'infrastructure sous-jacente.
- **ASR (Automatic Speech Recognition)** : Technologie de Reconnaissance Automatique de la Parole, qui convertit un signal audio vocal en texte.
- **TTS (Text-To-Speech)** : Technologie de Synthèse Vocale, qui convertit un texte écrit en parole audible.
- **Twilio** : Plateforme de communication en tant que service (CPaaS) offrant des API pour intégrer des fonctionnalités de téléphonie (appels vocaux, SMS, etc.) dans les applications.
- **WebRTC (Web Real-Time Communication)** : Ensemble d'API et de protocoles open-source permettant la communication audio et vidéo en temps réel directement entre navigateurs web et applications mobiles, sans nécessiter de plugins.
- **AssistantConfig** : Objet JSON structuré, défini par AlloKoli, qui contient l'ensemble des paramètres de configuration d'un assistant vocal généré par la plateforme. Ce fichier dicte le comportement, la voix, le prompt initial, et d'autres aspects de l'assistant de l'utilisateur final.
- **RGPD (Règlement Général sur la Protection des Données)** : Législation européenne encadrant la collecte et le traitement des données personnelles des individus au sein de l'Union Européenne.
- **PME** : Petites et Moyennes Entreprises.
- **Onboarding** : Processus initial par lequel un nouvel utilisateur est guidé pour configurer et commencer à utiliser un service ou une application.
- **Prompt** : Instruction textuelle fournie à un modèle de langage (LLM) pour orienter sa génération de réponse ou son comportement.
- **DTO (Data Transfer Object)** : Objet simple dont le but principal est de transférer des données entre les différentes couches ou composants d'une application, souvent utilisé dans les échanges API.
- **JWT (JSON Web Token)** : Standard ouvert (RFC 7519) pour la création de jetons d'accès compacts et autonomes, utilisés pour transmettre de manière sécurisée des informations entre parties sous forme d'objet JSON.
- **RLS (Row Level Security)** : Fonctionnalité de sécurité de PostgreSQL (et donc de Supabase) qui permet de définir des politiques d'accès contrôlant quelles lignes d'une table un utilisateur est autorisé à voir ou à modifier, en fonction de sa session ou d'autres attributs.
- **SLA (Service Level Agreement)** : Engagement contractuel définissant le niveau de service attendu d'un fournisseur, incluant souvent des métriques de disponibilité et de performance.
- **KPI (Key Performance Indicator)** : Indicateur Clé de Performance, une mesure quantifiable utilisée pour évaluer la réussite d'une organisation ou d'une activité spécifique.
- **MVP (Minimum Viable Product)** : Version d'un nouveau produit qui permet à une équipe de collecter le maximum d'enseignements validés sur les clients avec le minimum d'effort.
- **Tool Call (Appel d'Outil)** : Dans le contexte de Vapi ou MCP, capacité d'un agent IA à invoquer une fonction ou un service externe pour obtenir des informations ou effectuer une action.
- **Session Context (Contexte de Session Vapi)** : Informations maintenues par Vapi durant une interaction conversationnelle, incluant l'historique des échanges, les données extraites, etc.
- **Deno Runtime** : Environnement d'exécution pour JavaScript et TypeScript, utilisé par les Supabase Edge Functions, axé sur la sécurité et la compatibilité avec les API web modernes.

La richesse du lexique initial fourni dans le brouillon constitue une excellente base. Néanmoins, il est impératif de maintenir ce lexique à jour tout au long du cycle de vie du projet. À mesure que les spécifications techniques s'affinent, en particulier concernant les interactions précises entre Vapi, le serveur MCP, et Supabase, de nouveaux termes ou des définitions plus granulaires émergeront. L'ajout proactif de termes tels que "Tool Call", "Session Context Vapi", ou "Deno Runtime" (déjà inclus ci-dessus à titre d'exemple) est crucial pour assurer une clarté maximale et une compréhension homogène au sein de l'équipe de développement. Ceci est d'autant plus important que tous les membres de l'équipe ne possèdent pas nécessairement une expertise approfondie de chaque composant technologique de la pile (Vapi, MCP, Deno, Supabase, Twilio). Un lexique vivant et précis préviendra les ambiguïtés et facilitera la communication technique.

## II. Architecture Système et Périmètre Applicatif Détaillés

### II.A. Validation et approfondissement de l'architecture technique 

L'architecture technique initialement proposée, articulée autour de Supabase Edge Functions, d'un serveur MCP, de l'assistant configurateur Vapi, d'un Dashboard React et de Twilio pour les aspects téléphoniques, est confirmée comme étant robuste, évolutive et en adéquation avec les meilleures pratiques actuelles pour le développement d'une application de type "AlloKoli 5-Minute Voice Wizard".

#### Supabase comme socle Backend

Supabase servira de fondation pour l'ensemble des services backend. Il fournira la base de données relationnelle PostgreSQL, le système d'authentification des utilisateurs (Supabase Auth, qui s'appuie sur GoTrue), la solution de stockage de fichiers (Supabase Storage, potentiellement pour les bases de connaissances ou les enregistrements audio si cette fonctionnalité est implémentée), et surtout les Supabase Edge Functions pour héberger la logique métier serverless.

L'utilisation de Supabase pour l'intégralité du backend (base de données, authentification, stockage, fonctions) représente une simplification significative de l'infrastructure et des opérations de DevOps. Cette approche centralisée est un atout considérable pour une structure comme AlloKoli qui vise à optimiser les coûts opérationnels et à accélérer le développement. De plus, la nature open-source de Supabase offre une flexibilité appréciable et prémunit contre un enfermement propriétaire ("vendor lock-in"), ce qui constitue un avantage stratégique à long terme.

#### Vapi pour l'IA Conversationnelle

La plateforme Vapi sera au cœur des interactions vocales et textuelles. Elle gérera l'assistant "configurateur" qui guide l'utilisateur durant l'onboarding (Fonctionnalité F1), ainsi que les services d'ASR (Automatic Speech Recognition) et de TTS (Text-To-Speech). Vapi offre également des fonctionnalités d'intégration de bases de connaissances, ce qui ouvre des perspectives d'évolution pour les assistants générés par les utilisateurs.

#### MCP Server sur Supabase Edge Functions

Le serveur MCP (Model Context Protocol), qui agit comme un orchestrateur d'outils pour l'IA, sera implémenté en utilisant les Supabase Edge Functions. Ce serveur exposera un ensemble de "tools" (fonctions métier spécifiques) que l'assistant Vapi configurateur pourra invoquer (Fonctionnalité F3). Ces tools interagiront avec la base de données Supabase (par exemple, pour créer ou mettre à jour les configurations des assistants) et avec des API externes telles que Twilio (pour le provisionnement des numéros de téléphone).

L'implémentation du serveur MCP via Supabase Edge Functions constitue une approche "serverless-native" qui s'intègre harmonieusement avec le reste de l'architecture. Cette méthode permet de définir des "tools" métiers (comme assistants.create ou phoneNumbers.provision) en tant que points d'entrée API sécurisés, scalables et gérés par Supabase. La capacité native de Vapi à interagir avec des serveurs MCP est un élément fondamental de cette architecture, permettant une communication fluide entre l'agent conversationnel et la logique métier.

#### React Dashboard

Une interface web développée en React fournira aux utilisateurs un espace pour gérer leurs assistants vocaux. Cela inclut la consultation de l'historique des appels, la modification des prompts des assistants, et la réalisation de tests en direct (Fonctionnalité F5). L'intégration de WebRTC pour les tests vocaux en temps réel depuis le navigateur est une composante technique importante de ce dashboard.

#### Twilio pour la Téléphonie

Les services de Twilio seront utilisés pour l'attribution dynamique de numéros de téléphone réels aux assistants créés (Fonctionnalité F4) et pour la gestion globale des appels entrants et sortants.

### II.B. Description détaillée de chaque composant

#### II.B.1. Assistant Vapi "configurateur"

Ce composant est l'interface principale avec laquelle l'utilisateur interagit pour créer son assistant vocal.

**Logique conversationnelle** : L'agent Vapi "configurateur" est responsable de l'intégralité du processus d'onboarding, que l'interaction se fasse par la voix ou par un fallback textuel (F1). Son comportement sera dicté par un prompt système exhaustif, formalisé dans le document Prompt_VapiConfigurator.md. Ce prompt définira la persona de l'agent (accueillant, didactique), son style de communication, la séquence des questions à poser pour la collecte d'informations, ainsi que les règles de gestion pour gérer les différentes réponses et scénarios d'interaction.

La qualité de ce prompt système est absolument critique pour le succès de l'onboarding. Il doit être méticuleusement conçu pour extraire de manière fiable et non ambiguë toutes les informations nécessaires à la constitution du fichier AssistantConfig JSON, tout en s'adaptant aux réponses de l'utilisateur et en maintenant une expérience conversationnelle fluide et agréable pour un public non technique. L'utilisation de techniques de "few-shot prompting" (exemplification par quelques exemples dans le prompt) et de stratégies de clarification sera essentielle pour guider l'agent Vapi.

**Extraction d'informations structurées** : L'agent posera une série de 3 à 8 questions, dont le contenu et l'enchaînement pourront s'adapter dynamiquement en fonction des réponses antérieures de l'utilisateur, notamment concernant son secteur d'activité. L'objectif est de recueillir toutes les données nécessaires à la configuration de l'assistant vocal cible (par exemple, le type de métier, le ton désiré pour l'assistant, les fonctionnalités spécifiques à implémenter, les informations clés à communiquer, etc.).

Vapi mettra à profit ses capacités de NLU (Natural Language Understanding) et potentiellement ses fonctionnalités de "function calling" (outils Vapi) pour interpréter les réponses de l'utilisateur et en extraire les entités pertinentes. Ces "function calls" pourraient, par exemple, solliciter le serveur MCP pour valider une information en temps réel ou pour suggérer des options basées sur le métier de l'utilisateur.

**Génération de la configuration AssistantConfig (F2)** : Sur la base des informations structurées extraites, l'agent Vapi (ou plus probablement un "tool" dédié sur le serveur MCP, appelé par Vapi) sera responsable de la construction d'un objet JSON : AssistantConfig. Cet objet encapsulera l'ensemble de la configuration de l'assistant vocal de l'utilisateur.

**Validation des données en cours de conversation** : L'agent Vapi devra être capable d'effectuer des validations de base sur les informations fournies par l'utilisateur (par exemple, vérifier si un champ obligatoire a été renseigné, si une valeur correspond à un ensemble prédéfini d'options – type enum). Des validations plus complexes pourront être déléguées au serveur MCP via un appel d'outil.

**Interaction avec le Serveur MCP** : L'agent Vapi configurateur communiquera activement avec le serveur MCP en invoquant ses "tools" (par exemple, assistants.create pour enregistrer la configuration, phoneNumbers.provision pour obtenir un numéro de téléphone). Ces invocations se feront via le mécanisme de "function calling" de Vapi, qui permet à l'agent d'exécuter des fonctions externes définies sur le serveur MCP.

#### II.B.2. Serveur MCP (implémenté avec Supabase Edge Functions)

Le serveur MCP est le pivot central de la logique métier d'AlloKoli. Il orchestre la création, la configuration et la gestion des assistants vocaux.

**Conception des API (endpoints)** : Le serveur MCP exposera une série d'endpoints, implémentés en tant que Supabase Edge Functions. Ces endpoints correspondront aux "tools" que l'agent Vapi ou le Dashboard React pourront appeler. Une approche RESTful est privilégiée pour sa simplicité d'intégration avec les Edge Functions. Chaque endpoint sera clairement défini, avec une documentation précise de son rôle, des paramètres attendus et des réponses fournies.

Exemples d'endpoints :

- `POST /mcp/assistants`: Crée un nouvel assistant. Prend en entrée le AssistantConfig JSON. (Fonctionnalités F2, F3).
- `PUT /mcp/assistants/{assistant_id}`: Met à jour la configuration d'un assistant existant (par exemple, modification du prompt depuis le dashboard).
- `POST /mcp/phoneNumbers/provision`: Provisionne un numéro de téléphone pour un assistant donné. (Fonctionnalités F3, F4).
- `GET /mcp/assistants/{assistant_id}/calls`: Récupère l'historique des appels pour un assistant spécifique. (Fonctionnalité F5).
- `GET /mcp/assistants`: Liste les assistants appartenant à l'utilisateur authentifié.

**Méthodes HTTP et Payloads** : Chaque endpoint utilisera la méthode HTTP la plus appropriée (GET, POST, PUT, DELETE). Les données échangées (requêtes et réponses) seront au format JSON. Une attention particulière sera portée à la validation rigoureuse de ces payloads.

L'utilisation de la bibliothèque Zod pour la définition de schémas et la validation des DTO (Data Transfer Objects) côté serveur (dans les Edge Functions) est une pratique fortement recommandée pour assurer la robustesse et la sécurité des API du serveur MCP. Des schémas Zod devront être définis pour chaque DTO, notamment pour le AssistantConfig. Cette validation garantit que seules des données conformes et attendues sont traitées, prévenant ainsi des erreurs en cascade ou des vulnérabilités.

**Logique d'orchestration des outils** : Chaque fonction Edge (correspondant à un "tool" MCP) encapsulera la logique métier spécifique. Par exemple, l'endpoint POST /mcp/assistants (tool assistants.create) recevra un AssistantConfig, validera ce JSON, créera une nouvelle entrée dans la table assistants de la base de données Supabase, et potentiellement interagira avec l'API de Vapi pour enregistrer ou configurer l'assistant sur leur plateforme.

**Authentification des appels** : Tous les appels vers le serveur MCP, qu'ils proviennent de l'agent Vapi configurateur ou du Dashboard React, devront être rigoureusement authentifiés. Le mécanisme privilégié est la validation de JSON Web Tokens (JWT) émis par Supabase Auth. Le serveur MCP (les Edge Functions) validera ces JWT.

Pour les opérations nécessitant des droits élevés (par exemple, interactions directes avec la base de données ou appels à des API tierces avec des clés de service), les Edge Functions pourront utiliser la clé SUPABASE_SERVICE_ROLE_KEY, stockée de manière sécurisée dans les secrets de la fonction.

Pour les actions initiées par un utilisateur depuis le dashboard, le JWT de l'utilisateur sera validé. La sécurisation des appels provenant de l'agent Vapi configurateur lui-même (qui n'est pas un utilisateur humain authentifié) nécessite une attention particulière. Si Vapi peut émettre des JWT signés avec une clé partagée, ceux-ci peuvent être validés. Alternativement, l'endpoint MCP appelé par Vapi pourrait être protégé par un secret partagé (clé API) connu uniquement de Vapi et du serveur MCP, stocké de manière sécurisée.

**Gestion des erreurs et Logging** : Une stratégie de gestion des erreurs cohérente et robuste sera implémentée pour toutes les API du serveur MCP. Cela inclut le retour de codes de statut HTTP appropriés (par exemple, 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error) et de messages d'erreur clairs et exploitables au format JSON. Un logging détaillé des requêtes, des erreurs et des opérations métier sera mis en place au sein des Edge Functions pour faciliter le débogage et le monitoring.

Le serveur MCP étant le cœur de la logique métier, sa conception doit adopter une approche "API-first". La documentation exhaustive de ses endpoints via le standard OpenAPI (fichier openapi.yaml) est une exigence non négociable. Les Supabase Edge Functions, grâce à leur capacité à gérer le routage et leur intégration native avec Supabase Auth, sont une technologie de choix pour cette implémentation.

#### II.B.3. Backend Supabase

Le backend Supabase constitue la persistance et la source de vérité pour les données d'AlloKoli.

**Schéma de base de données détaillé** : Le schéma relationnel sera construit autour des entités principales du système. Une description plus détaillée se trouve dans la Section V. Les tables fondamentales incluent users (gérée nativement par Supabase Auth), assistants (pour stocker les configurations des assistants vocaux), calls (pour l'historique des appels), et potentiellement knowledge_bases, webhooks_events, et audit_logs pour des fonctionnalités futures ou des besoins de traçabilité.

**Politiques RLS (Row Level Security)** : La sécurité des données et l'isolation entre les différents utilisateurs (multi-location) sont primordiales. Les politiques RLS de PostgreSQL, mises en œuvre via Supabase, seront intensivement utilisées. L'objectif principal est de garantir qu'un utilisateur ne puisse accéder et modifier que les données qui lui appartiennent (ses assistants, ses logs d'appels, etc.).

La colonne config_json de la table assistants, qui contient la logique et les informations sensibles de l'assistant, sera particulièrement protégée par des politiques RLS strictes, basées sur l'identifiant de l'utilisateur (auth.uid()).

**Intégration de Supabase Auth** : Supabase Auth sera utilisé pour gérer l'authentification des utilisateurs accédant au Dashboard React. Il sera également responsable de la génération des JWT qui seront utilisés pour sécuriser les appels aux Supabase Edge Functions (serveur MCP).

**Stockage (Supabase Storage)** : Supabase Storage pourra être employé pour stocker des fichiers liés aux bases de connaissances des assistants, si cette fonctionnalité est développée. Il pourrait également servir à stocker les enregistrements audio des appels, si cette option est activée et que le consentement utilisateur est obtenu. Les politiques de sécurité de Supabase Storage, similaires aux RLS pour la base de données, devront être configurées pour contrôler l'accès à ces fichiers.

#### II.B.4. Dashboard React

Le Dashboard React est l'interface utilisateur web qui permet aux PME/artisans de gérer leurs assistants vocaux.

**Architecture des composants** : Le dashboard sera développé en React, en suivant une architecture modulaire et basée sur des composants réutilisables. Les principaux composants à prévoir incluent :

- Un composant pour afficher l'historique des appels (calls.list), présentant les transcriptions, les résumés, et potentiellement un lecteur audio pour les enregistrements. Des bibliothèques comme assistant-ui pourraient fournir des éléments de base pour l'affichage des conversations.
- Un composant d'édition de prompt, permettant aux utilisateurs de visualiser et de modifier le prompt système de leur assistant Vapi cible (le prompt contenu dans AssistantConfig). Une simple zone de texte (textarea) pourrait suffire pour le MVP, avec des améliorations futures comme la coloration syntaxique pour les variables ou un historique des versions du prompt.
- Un module de test en direct, intégrant la communication WebRTC via le Vapi Web SDK pour les tests vocaux depuis le navigateur, ou une fonctionnalité de "click-to-call" qui initie un appel téléphonique vers l'utilisateur via Twilio (orchestré par le serveur MCP).

**Gestion de l'état** : Le choix d'une solution de gestion de l'état (comme Redux, Zustand, Recoil, ou l'API Context de React) dépendra de la complexité croissante du dashboard. Pour un MVP, l'API Context pourrait être suffisante, mais des solutions plus robustes comme Zustand ou Redux sont à considérer pour une meilleure scalabilité et maintenabilité.

**Interactions API** : Le Dashboard communiquera exclusivement avec le serveur MCP (Supabase Edge Functions) pour toutes les opérations de récupération de données (historique des appels, configuration de l'assistant) et pour toutes les actions (mise à jour du prompt, lancement d'un test click-to-call). Ces communications se feront via des appels fetch standards ou en utilisant une bibliothèque comme Axios.

**Intégration WebRTC pour les tests en direct** : Pour permettre aux utilisateurs de tester leur assistant vocal directement depuis leur navigateur, le Vapi Web SDK sera intégré. Cette intégration implique une gestion soigneuse des permissions d'accès au microphone du navigateur. L'application devra clairement informer l'utilisateur de la raison pour laquelle l'accès au microphone est requis et gérer de manière élégante les cas où la permission est refusée ou non encore accordée. Des messages d'information clairs et des instructions pour accorder la permission dans les paramètres du navigateur seront nécessaires pour une bonne expérience utilisateur.

**UI/UX** : L'interface utilisateur doit être conçue pour être extrêmement simple et intuitive, ciblant des utilisateurs sans compétences techniques. L'utilisation de bibliothèques de composants React éprouvées, telles que Material UI ou Ant Design, peut considérablement accélérer le développement tout en garantissant une haute qualité visuelle et une bonne expérience utilisateur.

#### II.B.5. Modules de Téléphonie/Voix (Vapi SDK, Twilio)

Ces modules gèrent l'interaction effective avec le réseau téléphonique et les services vocaux.

**Provisionnement des numéros (Twilio)** : Le serveur MCP, via un "tool" spécifique (par exemple, phoneNumbers.provision), appellera l'API de Twilio pour rechercher et acquérir des numéros de téléphone disponibles qui seront ensuite attribués aux assistants vocaux des utilisateurs. Ce processus doit être sécurisé, notamment par la protection rigoureuse des identifiants API de Twilio (Account SID et Auth Token), qui seront stockés en tant que secrets dans les Supabase Edge Functions.

**Gestion ASR/TTS (Vapi)** : Vapi prend en charge nativement les fonctionnalités d'ASR et de TTS. La configuration de la voix de l'assistant (choix du fournisseur de TTS, de la voix spécifique) sera définie dans le AssistantConfig et transmise à Vapi lors de la création ou de la mise à jour de l'assistant. Le fichier voices.csv mentionné dans le brouillon servira de catalogue des voix Vapi disponibles. La configuration de la vitesse de la parole et d'autres paramètres de prosodie sera gérée via les options de configuration de Vapi.

**Gestion des appels entrants/sortants** :

- **Appels entrants** : Lorsqu'un appel est passé vers un numéro de téléphone provisionné par Twilio et attribué à un assistant AlloKoli, Twilio devra router cet appel vers la plateforme Vapi. Cette configuration de routage (souvent via des webhooks ou des configurations TwiML sur Twilio) pointera vers l'instance spécifique de l'assistant Vapi de l'utilisateur (identifié par son vapi_assistant_id).
- **Appels sortants** (pour le test "click-to-call") : Le Dashboard React pourra initier un appel sortant. Cette action transitera par le serveur MCP, qui à son tour utilisera l'API de Vapi ou directement l'API de Twilio pour établir l'appel entre le numéro de téléphone de l'utilisateur et son propre assistant vocal.

**Webhooks Twilio** : Pour un suivi en temps réel de l'état des appels (par exemple, décroché, terminé, échec, occupé), des webhooks configurés sur Twilio seront utilisés. Ces webhooks enverront des notifications HTTP au serveur MCP (probablement à des Supabase Edge Functions dédiées). La sécurisation de ces endpoints de webhook est critique : elle impliquera systématiquement la validation de la signature de la requête (en utilisant l'en-tête X-Twilio-Signature et l'Auth Token Twilio) pour s'assurer que les requêtes proviennent authentiquement de Twilio et n'ont pas été falsifiées.

### II.C. Diagrammes d'architecture affinés (flux de données, séquence des interactions clés)

Le diagramme Mermaid initial fourni dans le brouillon (section 7) sera enrichi pour offrir une représentation plus détaillée des flux de données et des séquences d'interactions entre les différents composants du système.

**Diagramme de Flux de Données Principal** : Ce diagramme illustrera le parcours complet des données, depuis l'interaction initiale de l'utilisateur avec l'agent Vapi configurateur, la collecte des informations, la génération et le stockage du AssistantConfig dans la base de données Supabase, son utilisation par l'assistant Vapi déployé lors d'un appel réel, jusqu'à la remontée des logs d'appel et des transcriptions vers le Dashboard React pour consultation par l'utilisateur.

**Diagramme de Séquence - Création d'Assistant** : Ce diagramme détaillera les étapes séquentielles et les messages échangés lors de la création d'un nouvel assistant :

1. Utilisateur interagit avec l'Agent Vapi Configurateur (via voix/texte).
2. L'Agent Vapi Configurateur collecte les informations.
3. L'Agent Vapi Configurateur appelle le tool assistants.create sur le Serveur MCP (Supabase Edge Function) avec le AssistantConfig en payload.
4. Le Serveur MCP valide le AssistantConfig (avec Zod).
5. Le Serveur MCP enregistre le nouvel assistant dans la base de données Supabase.
6. Le Serveur MCP (potentiellement) enregistre/configure l'assistant sur la plateforme Vapi via l'API Vapi et récupère un vapi_assistant_id.
7. Le Serveur MCP appelle le tool phoneNumbers.provision.
8. Le tool phoneNumbers.provision appelle l'API Twilio pour rechercher et acheter un numéro.
9. Twilio retourne le numéro provisionné (ou une erreur).
10. Le Serveur MCP stocke le numéro dans la base de données Supabase.
11. Le Serveur MCP configure le routage du numéro Twilio vers l'assistant Vapi.
12. Le Serveur MCP retourne l'ID de l'assistant créé et le numéro de téléphone à l'Agent Vapi Configurateur.
13. L'Agent Vapi Configurateur annonce le succès et le numéro à l'Utilisateur.

**Diagramme de Séquence - Test Live via Dashboard (WebRTC)** :

1. Utilisateur clique sur "Tester par navigateur" dans le Dashboard React.
2. Le Dashboard (via le Vapi Web SDK) demande l'accès au microphone.
3. Une fois la permission accordée, le Vapi Web SDK initie une connexion WebRTC avec la plateforme Vapi.
4. La plateforme Vapi route l'appel vers l'Assistant Vapi Cible de l'utilisateur.
5. L'interaction vocale a lieu entre l'Utilisateur (via navigateur) et son Assistant Vapi Cible.

**Diagramme de Séquence - Appel Entrant sur Assistant Déployé** :

1. Un Appelant Externe compose le numéro Twilio attribué à l'assistant.
2. Twilio reçoit l'appel et, selon la configuration de routage, le transmet à la plateforme Vapi.
3. La plateforme Vapi identifie l'Assistant Vapi Cible associé au numéro et initie la session.
4. L'Assistant Vapi Cible interagit avec l'Appelant Externe.
5. Si l'assistant utilise des "tools" pendant l'appel, il communique avec le Serveur MCP.
6. À la fin de l'appel, Vapi (ou Twilio via webhook) notifie le Serveur MCP.
7. Le Serveur MCP enregistre les détails de l'appel (log, transcription) dans la base de données Supabase.

### II.D. Périmètre fonctionnel : Inclusions et exclusions détaillées

Une délimitation précise du périmètre est cruciale pour la gestion du projet, en particulier pour la phase MVP.

#### Inclusions (confirmées et à détailler pour le MVP) :

- **F1 & F2** : Création complète d'un assistant vocal via une interface conversationnelle (vocale et textuelle) gérée par l'agent Vapi configurateur, aboutissant à la génération d'un AssistantConfig JSON valide.
- **F3 & F4** : Déploiement automatisé de l'assistant configuré sur un numéro de téléphone Twilio réel, incluant l'appel aux API nécessaires (MCP Server, Twilio, Vapi).
- **Test en direct** : Possibilité pour l'utilisateur de tester son assistant immédiatement après sa création, soit en l'appelant sur son numéro Twilio, soit via une interface WebRTC intégrée au dashboard (utilisant le Vapi Web SDK).
- **F5 : Dashboard MVP** :
  - Authentification des utilisateurs.
  - Liste des assistants créés par l'utilisateur.
  - Consultation de l'historique des appels pour chaque assistant (avec date, durée, numéro appelant masqué/partiel, transcription et résumé si disponible).
  - Édition du prompt principal de l'assistant Vapi cible (le prompt dans AssistantConfig).
  - Lancement du test en direct (WebRTC et/ou click-to-call).
- **F6 : Sécurité de base et conformité RGPD** :
  - Authentification sécurisée des utilisateurs (Supabase Auth).
  - Protection des données par RLS dans Supabase.
  - Chiffrement en transit (HTTPS) et au repos (géré par Supabase).
  - Gestion du consentement pour la collecte de données (a minima via les conditions d'utilisation et la politique de confidentialité).
  - Stockage des données prioritairement en Union Européenne.

#### Exclusions (pour le MVP, à considérer pour des itérations futures) :

- **Intégration avancée de bases de connaissances externes** : Bien que la table knowledge_bases soit prévue dans le modèle de données et que Vapi supporte cette fonctionnalité, l'intégration et la gestion de bases de connaissances par les utilisateurs pour leurs assistants ne feront pas partie du MVP.
- **Fonctionnalités avancées de gestion des appels** : Transferts d'appels complexes (ex: vers plusieurs agents, avec logique conditionnelle avancée), systèmes de réponse vocale interactive (IVR) sophistiqués au-delà des capacités natives de l'assistant Vapi configuré par un simple prompt.
- **Analytics et rapports avancés** : Pas de tableaux de bord analytiques détaillés sur l'utilisation des assistants, les taux de réussite, etc., au-delà de l'historique des appels brut.
- **Facturation et gestion des abonnements** : Ces aspects ne sont pas couverts par ce cahier des charges et sont supposés être gérés par une solution tierce ou développés séparément.
- **Personnalisation poussée de la voix TTS** : Au-delà des options de voix standards proposées par Vapi et configurables via voices.csv. Pas de clonage de voix ou de réglages fins de prosodie par l'utilisateur.
- **Support multi-langues avancé** : Le MVP se concentrera sur une langue principale (Français). Le support d'autres langues pour l'agent configurateur et les assistants générés sera une évolution.
- **Gestion collaborative ou d'équipe** : Le MVP se concentre sur un utilisateur unique gérant ses propres assistants. Pas de fonctionnalités de partage d'assistants ou de rôles multiples au sein d'une organisation.

Définir clairement les exclusions est aussi crucial que de détailler les inclusions. Cela permet de gérer les attentes des parties prenantes et de concentrer les efforts de développement sur les fonctionnalités essentielles du MVP. La présence de la table knowledge_bases dans le modèle de données initial indique une ambition future claire ; il est donc pertinent de la marquer explicitement comme hors périmètre pour les premières phases si elle n'est pas une priorité immédiate.

### II.E. Matrice de Responsabilité des Composants

Le tableau suivant offre une vue synthétique des responsabilités des principaux composants architecturaux :

| Composant                     | Fonctionnalité Clé                                                                                               | Technologies Utilisées                               | Interactions Principales                                                               |
|-------------------------------|------------------------------------------------------------------------------------------------------------------|------------------------------------------------------|----------------------------------------------------------------------------------------|
| Assistant Vapi "configurateur" | Onboarding utilisateur (vocal/textuel), collecte des besoins, initiation de la création de l'assistant.          | Vapi SDK, LLM (via Vapi)                             | Utilisateur (voix/textuel), Serveur MCP (via Tools/Function Calls Vapi)              |
| Serveur MCP                   | Orchestration métier : création/màj assistants, provisionnement numéros, récupération logs, validation AssistantConfig. | Supabase Edge Functions (Deno, TypeScript), Zod      | Assistant Vapi configurateur, Dashboard React, Supabase DB, API Vapi, API Twilio       |
| Backend Supabase              | Persistance des données (utilisateurs, assistants, appels), authentification, stockage fichiers (potentiel).       | PostgreSQL, Supabase Auth, Supabase Storage          | Serveur MCP (lecture/écriture DB), Dashboard React (authentification, lecture/écriture via MCP) |
| Dashboard React               | Interface de gestion : historique appels, édition prompt, tests live, gestion de compte.                         | React, Vapi Web SDK (pour WebRTC), HTML/CSS/JS       | Utilisateur (IHM), Serveur MCP (API calls)                                             |
| Modules Téléphonie/Voix       | Gestion ASR/TTS, attribution numéros, routage appels, gestion événements d'appel.                               | Vapi SDK, API Twilio, Webhooks Twilio                | Utilisateur final (via appels), Assistant Vapi, Serveur MCP                          |
| Sécurité et RGPD              | Authentification, autorisation (RLS), chiffrement, gestion du consentement, conformité.                         | Supabase Auth, PostgreSQL RLS, HTTPS, mécanismes Vapi | Tous les composants manipulant des données utilisateur ou de configuration.              |

Ce tableau de responsabilités vise à clarifier le rôle de chaque macro-composant, aidant ainsi les développeurs à mieux appréhender l'architecture globale et les interdépendances.

## III. Fonctionnalités Utilisateur Détaillées

### III.A. F1 : Interface conversationnelle onboarding (vocal/textuel)

#### Description
L'interface conversationnelle est le point d'entrée de l'utilisateur dans le système AlloKoli. Elle a pour objectif de guider l'utilisateur, de manière naturelle et intuitive, à travers le processus de création d'un assistant vocal personnalisé.

#### Modalités d'interaction
- **Mode vocal** : L'utilisateur peut dialoguer oralement avec l'agent Vapi configurateur, via un appel téléphonique ou via l'interface WebRTC intégrée au site web AlloKoli. Cette modalité incarne parfaitement l'esprit du produit, permettant à l'utilisateur d'expérimenter directement l'interaction vocale qu'il souhaite offrir à ses propres clients.
- **Mode textuel (fallback)** : Un chatbot textuel est également disponible pour les utilisateurs préférant interagir par écrit ou se trouvant dans des environnements où la communication vocale n'est pas adaptée (lieu public, open space, etc.).

#### Déroulement type de la conversation d'onboarding
1. **Accueil et présentation** : L'agent configurateur se présente, explique l'objectif (créer un assistant vocal personnalisé en quelques minutes) et demande à l'utilisateur s'il est prêt à commencer.
2. **Identification du secteur d'activité** : "Tout d'abord, pouvez-vous me parler de votre activité professionnelle ? Êtes-vous artisan, commerçant, profession libérale, ou autre ?"
3. **Précision du métier spécifique** : "Plus précisément, quel est votre métier ? Par exemple, êtes-vous plombier, restaurateur, coach sportif, etc. ?"
4. **Collecte des informations clés** : "Quelles sont les principales informations que votre assistant devrait pouvoir communiquer à vos clients ? Par exemple, vos horaires d'ouverture, votre adresse, vos services, vos tarifs..."
5. **Définition des tâches de l'assistant** : "À part donner des informations, quelles actions souhaitez-vous que votre assistant puisse réaliser ? Par exemple, prendre des rendez-vous, noter des messages, qualifier des demandes..."
6. **Personnalisation du ton** : "Quel ton souhaitez-vous que votre assistant adopte avec vos clients ? Plutôt formel et professionnel, ou plutôt décontracté et amical ?"
7. **Choix de la voix** : "Préférez-vous une voix masculine ou féminine pour votre assistant ?"
8. **Récapitulatif et confirmation** : L'agent résume les informations collectées et demande confirmation à l'utilisateur.
9. **Création de l'assistant** : "Parfait ! Je vais maintenant créer votre assistant vocal personnalisé. Cela prendra juste quelques secondes..."
10. **Communication du numéro de téléphone** : "Excellent ! Votre assistant est prêt. Il est accessible dès maintenant au numéro suivant : [numéro]. Vous pouvez l'essayer immédiatement en l'appelant. Vous retrouverez également ce numéro et pourrez gérer votre assistant dans votre espace personnel."

#### Gestion des cas particuliers
- **Informations manquantes ou ambiguës** : L'agent doit être capable de détecter les réponses incomplètes ou confuses et de demander des précisions de manière ciblée.
- **Demandes hors périmètre** : Si l'utilisateur exprime des besoins que le système ne peut pas satisfaire dans sa version actuelle (par exemple, des intégrations complexes ou des fonctionnalités avancées), l'agent doit l'informer clairement des limites tout en suggérant des alternatives ou des solutions de contournement simples.
- **Reprise de la conversation** : En cas d'interruption involontaire (problème technique, appel coupé), le système devrait permettre de reprendre la conversation là où elle s'est arrêtée, si l'utilisateur reprend contact dans un délai raisonnable.

#### Exigences UX
- Temps de réponse rapide (< 2 secondes) pour maintenir l'engagement et la fluidité de la conversation.
- Capacité de l'agent à s'adapter au niveau de technicité de l'utilisateur, en vulgarisant ou en étant plus précis selon les besoins.
- Messages d'erreur clairs et non techniques en cas de problème.
- Possibilité de revenir en arrière ou de modifier une information précédemment fournie ("En fait, je préférerais une voix féminine plutôt que masculine").

### III.B. F2 : Génération automatique d'un assistant vocal sur mesure

#### Description
Cette fonctionnalité représente le cœur technologique d'AlloKoli : la transformation des informations collectées auprès de l'utilisateur en un assistant vocal fonctionnel et personnalisé. Elle s'articule autour de la génération d'un objet JSON (AssistantConfig) qui encapsule toute la configuration nécessaire.

#### Structure du AssistantConfig
```json
{
  "name": "Assistant Restaurant Le Gourmet",
  "business_type": "restaurant",
  "prompt": "Tu es l'assistant virtuel du restaurant Le Gourmet...",
  "voice_settings": {
    "provider": "elevenlabs",
    "voice_id": "nicole",
    "language": "fr-FR",
    "speed": 1.0
  },
  "call_handling": {
    "greeting": "Bonjour, vous êtes bien au restaurant Le Gourmet, en quoi puis-je vous aider ?",
    "closing": "Merci de votre appel, au revoir et à bientôt !",
    "max_duration_seconds": 300
  },
  "business_info": {
    "name": "Restaurant Le Gourmet",
    "address": "15 rue de la Gastronomie, 75001 Paris",
    "phone": "+33123456789",
    "hours": {
      "monday": "12h-14h30, 19h-22h30",
      "tuesday": "12h-14h30, 19h-22h30",
      // autres jours...
    },
    "services": ["cuisine française", "menu du jour", "privatisation"],
    "prices": "Menu du jour à 25€, carte entre 35€ et 50€"
  },
  "capabilities": ["answer_faq", "take_reservation", "give_directions"],
  "vapi_settings": {
    "llm": "anthropic-claude-instant",
    "temperature": 0.7,
    "tools": []
  }
}
```

#### Génération du prompt système
Le prompt système de l'assistant est l'élément le plus critique pour déterminer son comportement et ses capacités. Il est généré selon un template sophistiqué qui intègre :

- La présentation de l'assistant ("Tu es l'assistant virtuel de [business_name]...")
- Les informations métier (horaires, services, tarifs...)
- Le ton à adopter (formel, amical, humoristique...)
- Les comportements attendus et les règles à suivre
- Des exemples de conversations types (few-shot prompting)
- Des instructions sur la gestion des cas particuliers

Un exemple de prompt pour un restaurant :

```
Tu es l'assistant virtuel du restaurant Le Gourmet, situé au 15 rue de la Gastronomie à Paris. 
Tu dois adopter un ton cordial et professionnel, représentant l'image d'un établissement gastronomique de qualité.

Informations essentielles à connaître :
- Horaires : ouvert du lundi au samedi, 12h-14h30 et 19h-22h30. Fermé le dimanche.
- Spécialités : cuisine française traditionnelle revisitée, produits frais et de saison.
- Prix : menu du jour à 25€, carte entre 35€ et 50€.
- Réservation recommandée, surtout le week-end.

Tes principales missions :
1. Répondre aux questions sur le restaurant (horaires, menu, localisation)
2. Prendre les réservations (demander date, heure, nombre de personnes, nom, numéro de téléphone)
3. Donner des indications pour venir au restaurant

Pour les réservations, pose systématiquement ces questions :
- Date souhaitée
- Heure souhaitée
- Nombre de personnes
- Nom de réservation
- Numéro de téléphone

Exemples de conversations :

Exemple 1 - Question simple :
Client : "Êtes-vous ouverts le dimanche soir ?"
Assistant : "Non, je suis désolé, le restaurant Le Gourmet est fermé le dimanche. Nous sommes ouverts du lundi au samedi, de 12h à 14h30 pour le déjeuner et de 19h à 22h30 pour le dîner. Puis-je vous renseigner sur un autre jour de la semaine ?"

Exemple 2 - Réservation :
Client : "Je voudrais réserver une table pour demain soir."
Assistant : "Bien sûr, je serais ravi de vous aider à réserver une table pour demain soir. Pour combien de personnes souhaitez-vous réserver ?"
Client : "Pour 2 personnes."
Assistant : "Parfait. À quelle heure souhaiteriez-vous dîner ?"
Client : "Vers 20h30."
Assistant : "Une table pour 2 personnes demain à 20h30, c'est noté. Puis-je avoir votre nom pour la réservation, s'il vous plaît ?"
Client : "Martin."
Assistant : "Merci M. Martin. Pourriez-vous me laisser un numéro de téléphone où vous joindre en cas de besoin ?"
Client : "06 12 34 56 78"
Assistant : "Merci. Je confirme votre réservation pour demain à 20h30, au nom de M. Martin, pour 2 personnes. Un SMS de confirmation vous sera envoyé dans quelques instants au 06 12 34 56 78. Au plaisir de vous accueillir demain soir au restaurant Le Gourmet !"

Si le client pose une question à laquelle tu ne peux pas répondre avec certitude ou qui dépasse tes attributions (comme des demandes très spécifiques sur les plats du jour ou des changements de réservation existante), propose de prendre ses coordonnées pour qu'un membre de l'équipe le rappelle.

N'invente jamais d'informations qui ne sont pas mentionnées ci-dessus, notamment concernant des plats spécifiques au menu ou des événements.
```

#### Processus de génération
1. Extraction et structuration des informations fournies par l'utilisateur durant l'onboarding (F1).
2. Validation des données (champs obligatoires, formats, cohérence).
3. Enrichissement éventuel par le LLM pour compléter ou affiner certains aspects (par exemple, suggérer des heures d'ouverture typiques si l'utilisateur n'a pas été précis).
4. Construction du prompt en insérant les informations dans le template approprié au secteur d'activité.
5. Génération de l'objet AssistantConfig complet.
6. Validation finale de la structure JSON (schéma Zod).
7. Enregistrement dans la base de données Supabase.

#### Cas de tests à valider
- Génération pour différents secteurs d'activité (restauration, artisanat, services...).
- Robustesse face à des informations partielles ou imprécises.
- Personnalisation du ton et du style selon les préférences utilisateur.
- Cohérence du prompt généré avec les capacités du modèle LLM utilisé (éviter les instructions impossibles à suivre).
- Validation de l'utilisabilité réelle de l'assistant généré via des tests d'appel.

### III.C. F3 : Configuration auto des outils sur MCP

#### Description
Cette fonctionnalité consiste à exposer les fonctionnalités métier d'AlloKoli en tant que "tools" (outils) au format MCP (Model Context Protocol). Ces outils sont consommables par l'agent Vapi configurateur durant le processus d'onboarding, ainsi que potentiellement par les assistants vocaux générés pour les utilisateurs finaux.

#### Outils exposés par le serveur MCP pour l'onboarding

##### assistants.create
- **Description** : Crée un nouvel assistant vocal à partir des informations collectées.
- **Entrée** : AssistantConfig JSON.
- **Sortie** : ID de l'assistant créé, statut, erreurs éventuelles.
- **Implémentation** : Validation du JSON, insertion en base de données, génération des configurations sur les plateformes externes (Vapi).

##### assistants.update
- **Description** : Met à jour la configuration d'un assistant existant.
- **Entrée** : ID de l'assistant, champs à mettre à jour.
- **Sortie** : Statut de la mise à jour, erreurs éventuelles.
- **Implémentation** : Validation des mises à jour, application en base de données, propagation des changements vers les plateformes externes (Vapi).

##### phoneNumbers.provision
- **Description** : Recherche et attribue un numéro de téléphone à un assistant.
- **Entrée** : ID de l'assistant, préférences de numéro (indicatif, région...).
- **Sortie** : Numéro provisionné, statut, erreurs éventuelles.
- **Implémentation** : Appel à l'API Twilio, enregistrement de l'association numéro-assistant en base de données, configuration du routage.

##### assistants.test
- **Description** : Initie un test de l'assistant en mode WebRTC ou via un appel sortant.
- **Entrée** : ID de l'assistant, mode de test (webrtc/call), numéro à appeler si mode call.
- **Sortie** : URL de session WebRTC ou statut de l'appel initié.
- **Implémentation** : Génération d'URL de session Vapi WebRTC ou appel à l'API Twilio pour initier un appel.

#### Outils potentiels pour les assistants déployés
Ces outils pourraient être ajoutés dans les itérations futures pour enrichir les capacités des assistants vocaux créés par les utilisateurs.

##### calendar.checkAvailability
- **Description** : Vérifie les disponibilités dans un calendrier intégré.
- **Entrée** : Date, plage horaire.
- **Sortie** : Créneaux disponibles.

##### calendar.createEvent
- **Description** : Crée un événement (rendez-vous, réservation).
- **Entrée** : Date, heure, durée, informations client.
- **Sortie** : Confirmation, ID de l'événement.

##### notifications.send
- **Description** : Envoie une notification à l'utilisateur propriétaire de l'assistant.
- **Entrée** : Message, urgence, coordonnées client.
- **Sortie** : Statut d'envoi.

#### Implémentation technique
Les tools MCP seront implémentés sous forme d'endpoints REST dans les Supabase Edge Functions. Le serveur MCP devra suivre les spécifications et conventions du protocole MCP :

1. **Découverte des outils** : Un endpoint `/mcp/tools` exposera la liste des outils disponibles avec leurs métadonnées (nom, description, paramètres attendus).
2. **Format des outils** : Chaque outil sera décrit selon le format standard MCP, avec name, description, parameters (schéma JSON).
3. **Authentification** : Les appels aux outils seront authentifiés via JWT ou API Key selon le contexte d'appel.
4. **Logging et observabilité** : Chaque appel d'outil sera enregistré pour des raisons de débogage et d'amélioration continue.

Le schéma d'implémentation pour un tool :

```typescript
// Dans une Supabase Edge Function
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { z } from 'https://deno.land/x/zod@v3.21.4/mod.ts'

// Schéma de validation des paramètres
const AssistantCreateSchema = z.object({
  name: z.string().min(1),
  business_type: z.string(),
  prompt: z.string().min(10),
  voice_settings: z.object({
    provider: z.string(),
    voice_id: z.string(),
    // autres champs...
  }),
  // autres champs validés...
})

serve(async (req) => {
  try {
    // Validation de l'authentification
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }
    
    // Validation JWT omise pour la brièveté
    
    // Parsing et validation du body
    const body = await req.json()
    const validatedData = AssistantCreateSchema.parse(body)
    
    // Logique métier
    const assistantId = crypto.randomUUID()
    
    // Insertion dans Supabase (via supabase-js client avec service role)
    const supabase = createClient(...)
    const { error } = await supabase
      .from('assistants')
      .insert({
        id: assistantId,
        config_json: validatedData,
        created_by: userId, // extrait du JWT
        // autres champs...
      })
    
    if (error) throw error
    
    // Retour de la réponse
    return new Response(
      JSON.stringify({ 
        assistant_id: assistantId, 
        status: 'created' 
      }), 
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    // Gestion des erreurs
    console.error('Error creating assistant:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }), 
      { 
        status: error.status || 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
})
```

### III.D. F4 : Attribution d'un numéro de téléphone réel

#### Description
Cette fonctionnalité permet d'attribuer automatiquement un numéro de téléphone réel à chaque assistant vocal créé. Ce numéro devient le point d'accès public à l'assistant, permettant à n'importe quel appelant d'interagir avec lui via une simple communication téléphonique.

#### Flux de provisionnement
1. **Déclenchement** : Le provisionnement est initié automatiquement après la création validée d'un assistant (via le tool assistants.create).
2. **Recherche de numéro** : Le système interroge l'API Twilio pour trouver un numéro disponible correspondant aux critères souhaités (pays, indicatif régional si applicable).
3. **Acquisition du numéro** : Le numéro sélectionné est acquis/loué via l'API Twilio.
4. **Configuration du routage** : Le numéro est configuré pour rediriger les appels entrants vers l'assistant Vapi approprié. Cette configuration se fait via l'API Twilio (TwiML App ou webhook) pointant vers l'URL d'endpoint Vapi.
5. **Enregistrement** : L'association entre l'assistant et le numéro est stockée dans la base de données Supabase.
6. **Communication** : Le numéro est communiqué à l'utilisateur via l'agent Vapi configurateur et sera visible dans le dashboard.

#### Considérations techniques
- **Gestion du pool de numéros** : Une stratégie de gestion des numéros devra être définie, notamment pour le recyclage des numéros d'assistants supprimés ou inactifs.
- **Contraintes géographiques** : La disponibilité des numéros varie selon les pays. Pour la phase MVP, seuls les numéros français (+33) seront supportés.
- **Coûts et limites** : Chaque numéro provisionné a un coût mensuel, ce qui implique une politique de tarification adaptée pour les utilisateurs finaux d'AlloKoli.
- **Portabilité** : Les contraintes légales liées à la portabilité des numéros (si un utilisateur souhaite conserver son numéro attribué en quittant le service) devront être étudiées.

#### Gestion des appels entrants
Lorsqu'un appel est reçu sur un numéro provisionné :
1. Twilio reçoit l'appel et consulte sa configuration de routage.
2. Twilio transmet l'appel à la plateforme Vapi, en incluant l'identifiant de l'assistant Vapi cible.
3. Vapi initialise l'assistant approprié et gère l'interaction vocale.
4. À la fin de l'appel, Vapi ou Twilio (via webhook) notifie le serveur MCP pour l'enregistrement des logs.

#### Alertes et notifications
- En cas d'échec de provisionnement (par exemple, aucun numéro disponible dans la région souhaitée), une alerte est générée pour l'équipe technique et l'utilisateur est informé de la situation.
- L'utilisateur reçoit une notification (email ou SMS) lui confirmant l'attribution du numéro et lui rappelant qu'il peut le retrouver dans son dashboard.

### III.E. F5 : Dashboard web de gestion des assistants

#### Description
Le Dashboard web constitue l'espace personnel de l'utilisateur, lui permettant de gérer ses assistants vocaux, de consulter les historiques d'appels, et d'effectuer des modifications ou des tests.

#### Fonctionnalités clés du dashboard

##### Authentification et gestion de compte
- **Login/Signup** : Authentification via email/mot de passe, Google OAuth, ou éventuellement d'autres fournisseurs d'identité.
- **Profil utilisateur** : Gestion des informations personnelles, préférences de notification, changement de mot de passe.
- **Gestion de l'abonnement** : Visualisation du forfait actuel, consommation, historique de facturation (si applicable).

##### Vue d'ensemble des assistants
- **Liste des assistants** : Tableau récapitulatif des assistants créés, avec leur nom, numéro de téléphone, date de création, et statistiques basiques (nombre d'appels, durée moyenne).
- **Statut en temps réel** : Indicateur de l'état de chaque assistant (actif, en pause, en erreur).
- **Actions rapides** : Boutons pour tester, modifier, ou désactiver temporairement un assistant.

##### Détail d'un assistant spécifique
- **Informations générales** : Nom, numéro, type d'activité, date de création/modification.
- **Numéro de téléphone** : Affichage du numéro attribué, possibilité de le copier, QR code pour faciliter le partage.
- **Édition du prompt** : Interface permettant de visualiser et de modifier le prompt système de l'assistant. Cette fonctionnalité est critique car elle permet à l'utilisateur d'affiner le comportement de son assistant sans passer par un nouvel onboarding complet.
- **Paramètres vocaux** : Choix de la voix, de la vitesse d'élocution, et d'autres paramètres liés à la synthèse vocale.

##### Historique des appels
- **Liste chronologique** : Affichage des appels reçus par l'assistant, avec date, heure, durée, et numéro appelant (partiellement masqué pour des raisons de confidentialité).
- **Transcription** : Pour chaque appel, accès à la transcription textuelle de la conversation.
- **Résumé** : Si disponible, un résumé généré automatiquement des points clés de la conversation.
- **Filtres et recherche** : Capacité à filtrer les appels par date, durée, ou à rechercher du texte dans les transcriptions.

##### Outils de test
- **Test WebRTC** : Bouton permettant de tester l'assistant directement depuis le navigateur, en utilisant le microphone de l'appareil. Cette fonctionnalité repose sur l'intégration du Vapi Web SDK.
- **Test par appel** : Fonctionnalité "Click-to-call" permettant à l'utilisateur de recevoir un appel de son assistant sur son propre téléphone pour le tester.

#### Exigences UX/UI
- **Responsive Design** : Interface adaptative fonctionnant sur desktop, tablette et mobile.
- **Temps de chargement** : Pages principales chargées en moins de 2 secondes.
- **Feedback immédiat** : Indicateurs visuels clairs pour les actions en cours (spinners, barres de progression).
- **Messages d'erreur contextuels** : Informations claires et non techniques en cas de problème.
- **Aide contextuelle** : Tooltips, messages d'aide et documentation accessibles directement dans l'interface.

#### Maquettes des écrans principaux
*Note: Des wireframes ou maquettes haute-fidélité seraient normalement inclus ici. Pour ce cahier des charges, nous nous limitons à la description textuelle.*

1. **Écran d'accueil dashboard** : Vue d'ensemble des assistants avec statistiques globales.
2. **Écran de détail assistant** : Informations complètes sur un assistant spécifique.
3. **Écran d'édition de prompt** : Interface d'édition avec prévisualisation.
4. **Écran d'historique des appels** : Liste paginée avec filtres.
5. **Écran de test WebRTC** : Interface minimaliste centrée sur l'interaction vocale.

## IV. Exigences Non-Fonctionnelles

### IV.A. Sécurité et confidentialité des données

#### Authentification et autorisation
- **Mécanisme d'authentification** : Utilisation de Supabase Auth pour l'authentification des utilisateurs, avec support de plusieurs méthodes (email/password, OAuth).
- **Gestion des sessions** : Sessions JWT sécurisées avec expiration et rotation des tokens.
- **Autorisation fine** : Utilisation des politiques RLS (Row Level Security) de Supabase pour garantir qu'un utilisateur ne peut accéder qu'à ses propres données.
- **Protection des API** : Tous les endpoints du serveur MCP protégés par validation JWT ou API Key selon le contexte.

#### Chiffrement et protection des données
- **Transport sécurisé** : Communications chiffrées via HTTPS/TLS pour toutes les interactions (APIs, WebRTC).
- **Données au repos** : Utilisation du chiffrement natif de Supabase pour les données stockées.
- **Données sensibles** : Masquage des numéros de téléphone des appelants dans les logs et les interfaces utilisateur.
- **Secrets et clés** : Stockage sécurisé des secrets (clés API Twilio, Vapi) dans les variables d'environnement Supabase.

#### Conformité RGPD et aspects légaux
- **Consentement éclairé** : Information claire aux utilisateurs sur les données collectées et leur usage.
- **Minimisation des données** : Collecte uniquement des données nécessaires au fonctionnement du service.
- **Droit à l'oubli** : Mise en place d'un processus de suppression complète des données sur demande.
- **Portabilité** : Possibilité d'exporter les données dans un format standard.
- **Registre de traitement** : Documentation exhaustive des traitements de données personnelles.
- **Mention d'enregistrement** : Information automatique en début d'appel si les conversations sont enregistrées.

#### Audit et logging
- **Journalisation des actions sensibles** : Enregistrement des créations, modifications et suppressions d'assistants.
- **Logs d'accès** : Traçabilité des accès aux données et API.
- **Détection d'anomalies** : Surveillance des patterns d'utilisation suspects.
- **Rétention des logs** : Politique de conservation des logs conforme aux exigences réglementaires.

### IV.B. Performance et scalabilité

#### Temps de réponse
- **Latence API** : Temps de réponse des API du serveur MCP < 500ms pour 95% des requêtes.
- **Temps d'initialisation de l'assistant Vapi** : < 1 seconde entre la réception d'un appel et le début de la réponse vocale.
- **Temps de chargement du Dashboard** : < 2 secondes pour les pages principales.

#### Volumétrie et scalabilité
- **Capacité du système** : Support de jusqu'à 1000 assistants actifs simultanément dans la phase initiale.
- **Appels simultanés** : Capacité à gérer jusqu'à 100 appels concurrents (limité principalement par Vapi et Twilio).
- **Croissance** : Architecture conçue pour une mise à l'échelle horizontale simple, permettant de multiplier la capacité en fonction de la croissance utilisateur.

#### Optimisation des coûts
- **Serverless** : Utilisation exclusive d'architectures serverless pour minimiser les coûts fixes.
- **Mise en cache** : Stratégie de cache pour les ressources statiques et les requêtes fréquentes.
- **Limitation API** : Rate limiting sur les API pour prévenir les abus et contrôler les coûts des services tiers.

### IV.C. Disponibilité et fiabilité

#### Objectifs de disponibilité
- **SLA cible** : Disponibilité de 99.5% pour l'ensemble du système (hors maintenance planifiée).
- **Maintenance** : Fenêtres de maintenance planifiées en dehors des heures de pointe.

#### Résilience
- **Tolérance aux pannes** : Architecture permettant la dégradation gracieuse en cas de défaillance d'un composant.
- **Retry pattern** : Mise en œuvre de mécanismes de réessai avec backoff exponentiel pour les appels API critiques.
- **Circuit breaker** : Protection contre les cascades d'erreurs lors de la défaillance de services tiers.

#### Monitoring et alerting
- **Supervision proactive** : Mise en place d'une surveillance continue des composants critiques.
- **Alertes** : Système de notification en cas d'incidents ou d'anomalies détectées.
- **Dashboard opérationnel** : Vue consolidée de l'état du système pour l'équipe technique.

### IV.D. Maintenabilité et extensibilité

#### Organisation du code
- **Architecture modulaire** : Séparation claire des responsabilités entre les différents composants.
- **Standards de code** : Application de conventions de codage strictes, validées par des outils automatisés.
- **Documentation** : Documentation exhaustive du code, des API et des processus.

#### Gestion de la configuration
- **Variables d'environnement** : Externalisation de la configuration via des variables d'environnement.
- **Feature flags** : Utilisation de drapeaux de fonctionnalités pour activer/désactiver certaines options.
- **Gestion des secrets** : Utilisation de solutions sécurisées pour le stockage et l'accès aux secrets.

#### Testabilité
- **Tests unitaires** : Couverture de tests pour les fonctions critiques du serveur MCP.
- **Tests d'intégration** : Validation des flux complets (création d'assistant, appel entrant, etc.).
- **Environnements** : Séparation claire des environnements de développement, test et production.

#### Évolutivité
- **API versionnées** : Stratégie de versionnage des API pour assurer la compatibilité.
- **Schémas extensibles** : Conception des modèles de données pour permettre l'ajout de nouveaux champs sans rupture.
- **Architecture orientée événements** : Utilisation partielle de patterns event-driven pour faciliter l'ajout de nouvelles fonctionnalités.

### IV.E. Internationalisation et accessibilité

#### Support multilingue
- **MVP** : Support initial du français uniquement.
- **Évolution** : Architecture prête pour l'ajout ultérieur d'autres langues.
- **Localisation** : Séparation du contenu et des chaînes traduisibles.

#### Accessibilité
- **Standards WCAG** : Conformité du dashboard web aux principales recommandations WCAG 2.1 niveau AA.
- **Navigation clavier** : Interface utilisable entièrement au clavier.
- **Compatibilité lecteurs d'écran** : Support des technologies d'assistance.
- **Contrastes et lisibilité** : Respect des ratios de contraste minimaux.

## V. Modèle de Données et Schéma Relationnel

### V.A. Entités principales et leurs relations

Le schéma de base de données est conçu pour supporter efficacement toutes les fonctionnalités décrites dans ce cahier des charges, tout en anticipant les évolutions futures du produit.

#### Entité 1: users
Cette table est gérée nativement par Supabase Auth et stocke les informations d'authentification et de profil des utilisateurs.

**Attributs principaux**:
- `id` (UUID, PK): Identifiant unique de l'utilisateur.
- `email` (string): Email de l'utilisateur, utilisé pour l'authentification.
- `created_at` (timestamp): Date de création du compte.
- `last_sign_in_at` (timestamp): Date de dernière connexion.
- `metadata` (JSON): Données supplémentaires sur l'utilisateur (préférences, forfait, etc.).

#### Entité 2: assistants
Table centrale stockant les assistants vocaux créés par les utilisateurs.

**Attributs principaux**:
- `id` (UUID, PK): Identifiant unique de l'assistant.
- `created_by` (UUID, FK): Référence à l'utilisateur propriétaire (users.id).
- `name` (string): Nom de l'assistant.
- `config_json` (JSON): Configuration complète de l'assistant (AssistantConfig).
- `vapi_assistant_id` (string): Identifiant de l'assistant sur la plateforme Vapi.
- `created_at` (timestamp): Date de création.
- `updated_at` (timestamp): Date de dernière modification.
- `status` (enum): État de l'assistant (active, disabled, error).

#### Entité 3: phone_numbers
Table gérant les numéros de téléphone attribués aux assistants.

**Attributs principaux**:
- `id` (UUID, PK): Identifiant unique.
- `assistant_id` (UUID, FK): Référence à l'assistant associé (assistants.id).
- `number` (string): Numéro de téléphone au format E.164 (ex: +33123456789).
- `twilio_sid` (string): Identifiant du numéro sur la plateforme Twilio.
- `status` (enum): État du numéro (active, released, error).
- `created_at` (timestamp): Date d'attribution.
- `released_at` (timestamp, nullable): Date de libération/suppression.

#### Entité 4: calls
Table enregistrant l'historique des appels reçus par les assistants.

**Attributs principaux**:
- `id` (UUID, PK): Identifiant unique de l'appel.
- `assistant_id` (UUID, FK): Référence à l'assistant concerné (assistants.id).
- `phone_number_id` (UUID, FK): Référence au numéro appelé (phone_numbers.id).
- `caller_number` (string): Numéro de l'appelant (partiellement masqué pour la RGPD).
- `start_time` (timestamp): Début de l'appel.
- `end_time` (timestamp, nullable): Fin de l'appel.
- `duration_seconds` (integer): Durée totale en secondes.
- `status` (enum): État final de l'appel (completed, missed, failed, busy).
- `transcript` (text, nullable): Transcription de la conversation.
- `summary` (text, nullable): Résumé généré de la conversation.
- `vapi_call_id` (string): Identifiant de l'appel sur la plateforme Vapi.
- `twilio_call_sid` (string): Identifiant de l'appel sur Twilio.
- `metadata` (JSON, nullable): Données supplémentaires sur l'appel.

#### Entité 5: knowledge_bases (pour évolution future)
Table pour gérer les bases de connaissances associées aux assistants.

**Attributs principaux**:
- `id` (UUID, PK): Identifiant unique.
- `assistant_id` (UUID, FK): Référence à l'assistant associé (assistants.id).
- `name` (string): Nom de la base de connaissances.
- `description` (text, nullable): Description du contenu.
- `status` (enum): État (active, processing, error).
- `created_at` (timestamp): Date de création.
- `updated_at` (timestamp): Date de dernière modification.

#### Entité 6: knowledge_base_files (pour évolution future)
Table pour les fichiers composant les bases de connaissances.

**Attributs principaux**:
- `id` (UUID, PK): Identifiant unique.
- `knowledge_base_id` (UUID, FK): Référence à la base de connaissances (knowledge_bases.id).
- `file_name` (string): Nom du fichier.
- `file_type` (string): Type MIME du fichier.
- `storage_path` (string): Chemin dans Supabase Storage.
- `status` (enum): État du traitement (uploaded, processed, error).
- `created_at` (timestamp): Date d'upload.

#### Entité 7: webhook_events
Table pour les événements reçus des webhooks (Twilio, Vapi).

**Attributs principaux**:
- `id` (UUID, PK): Identifiant unique.
- `source` (enum): Source de l'événement (twilio, vapi).
- `event_type` (string): Type d'événement.
- `payload` (JSON): Contenu brut du webhook.
- `processed` (boolean): Indique si l'événement a été traité.
- `created_at` (timestamp): Date de réception.
- `processed_at` (timestamp, nullable): Date de traitement.

### V.B. Politiques de sécurité (RLS)

Les politiques Row Level Security (RLS) de Supabase sont essentielles pour garantir l'isolation des données entre les différents utilisateurs et prévenir tout accès non autorisé.

#### Politique RLS pour assistants

```sql
-- Politique de lecture: un utilisateur ne peut lire que ses propres assistants
CREATE POLICY "Users can view their own assistants" ON assistants
    FOR SELECT
    USING (auth.uid() = created_by);

-- Politique de création: un utilisateur peut créer des assistants pour lui-même
CREATE POLICY "Users can create assistants" ON assistants
    FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- Politique de mise à jour: un utilisateur ne peut modifier que ses propres assistants
CREATE POLICY "Users can update their own assistants" ON assistants
    FOR UPDATE
    USING (auth.uid() = created_by);

-- Politique de suppression: un utilisateur ne peut supprimer que ses propres assistants
CREATE POLICY "Users can delete their own assistants" ON assistants
    FOR DELETE
    USING (auth.uid() = created_by);
```

#### Politique RLS pour calls

```sql
-- Politique de lecture: un utilisateur ne peut voir que les appels de ses propres assistants
CREATE POLICY "Users can view calls for their assistants" ON calls
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM assistants
            WHERE assistants.id = calls.assistant_id
            AND assistants.created_by = auth.uid()
        )
    );

-- Aucune politique d'insertion directe pour les utilisateurs
-- Les enregistrements d'appels sont créés uniquement par les webhooks via service role
```

Des politiques similaires seront établies pour toutes les autres tables, suivant le principe du moindre privilège.

### V.C. Migrations et évolution du schéma

La gestion de l'évolution du schéma de données se fera via les migrations Supabase, permettant un contrôle de version rigoureux et des mises à jour non destructives.

#### Stratégie de migration
1. Création de fichiers de migration incrémentaux pour chaque changement de schéma.
2. Tests préalables des migrations sur un environnement de staging.
3. Backup automatique avant chaque migration en production.
4. Migrations réversibles (up/down) lorsque possible.

#### Exemple de fichier de migration

```sql
-- migration_20230601120000_create_assistants_table.sql

-- Up Migration
CREATE TABLE assistants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    config_json JSONB NOT NULL,
    vapi_assistant_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'error'))
);

CREATE INDEX idx_assistants_created_by ON assistants(created_by);
COMMENT ON TABLE assistants IS 'Assistants vocaux créés par les utilisateurs';

-- Down Migration
DROP TABLE IF EXISTS assistants;
```

## VI. Plan de Mise en Œuvre et Livrables

### VI.A. Découpage en sprints et jalons clés

Le développement sera organisé en 5 sprints de 2 semaines chacun, pour une durée totale de 10 semaines.

#### Sprint 1: Fondations techniques
**Objectif**: Mettre en place l'architecture de base et les environnements.
**Livrables**:
- Configuration de l'environnement Supabase (base de données, authentification)
- Mise en place de la structure des Edge Functions
- Création du squelette du serveur MCP (premiers endpoints)
- Structure de base du Dashboard React
- Intégration initiale avec Vapi (configuration, tests d'appel)

**Jalon**: Architecture technique validée, premiers appels API fonctionnels.

#### Sprint 2: MVP Agent configurateur
**Objectif**: Implémenter l'agent configurateur d'onboarding.
**Livrables**:
- Prompt système de l'agent Vapi configurateur
- Intégration WebRTC pour l'interface vocale
- Logique d'extraction des informations utilisateur
- Génération de AssistantConfig à partir des informations collectées
- Endpoint MCP assistants.create fonctionnel

**Jalon**: Premier onboarding complet possible, avec génération de configuration.

#### Sprint 3: Déploiement des assistants
**Objectif**: Permettre la création et le déploiement complet des assistants.
**Livrables**:
- Intégration avec l'API Twilio pour le provisionnement de numéros
- Configuration du routage des appels Twilio vers Vapi
- Déploiement des assistants générés sur la plateforme Vapi
- Stockage et gestion des assistants dans Supabase
- Webhooks pour la gestion des événements d'appel

**Jalon**: Assistant créé via l'onboarding, accessible par téléphone.

#### Sprint 4: Dashboard utilisateur
**Objectif**: Développer l'interface de gestion des assistants.
**Livrables**:
- Authentification complète (login, signup)
- Vue liste des assistants
- Écran de détail assistant avec numéro
- Historique des appels et transcriptions
- Interface d'édition du prompt

**Jalon**: Dashboard fonctionnel permettant de gérer les assistants.

#### Sprint 5: Tests, optimisations et finalisation
**Objectif**: Améliorer la qualité, les performances et finaliser le MVP.
**Livrables**:
- Tests de charge et optimisations de performance
- Résolution des bugs identifiés
- Améliorations UX basées sur les tests utilisateurs
- Documentation complète (API, techniques, utilisateur)
- Mise en place du monitoring et des alertes

**Jalon**: MVP complet, testé et documenté, prêt pour lancement.

### VI.B. Stratégie de tests

#### Tests unitaires
- Tests des validateurs de schémas (Zod)
- Tests des fonctions utilitaires du serveur MCP
- Tests des composants React isolés

#### Tests d'intégration
- Tests des flux complets d'API (création assistant, récupération historique)
- Tests d'intégration Supabase (insertion, récupération avec RLS)
- Tests d'intégration des webhooks Twilio et Vapi

#### Tests end-to-end
- Simulation complète du parcours utilisateur
- Tests réels d'appels téléphoniques
- Validation des performances et de la fiabilité en conditions réelles

#### Tests utilisateurs
- Sessions de tests avec des utilisateurs représentatifs des personas cibles
- Recueil et analyse des feedbacks
- Itérations basées sur les retours utilisateurs

### VI.C. Documentation à produire

#### Documentation technique
- Architecture détaillée (diagrammes, descriptions)
- API Reference du serveur MCP (format OpenAPI)
- Guide d'implémentation des Edge Functions
- Documentation du schéma de base de données
- Procédures de déploiement et de mise à jour

#### Documentation utilisateur
- Guide d'utilisation du Dashboard
- Tutoriels d'onboarding et de création d'assistant
- FAQ et troubleshooting
- Bonnes pratiques pour la configuration des assistants

#### Documentation opérationnelle
- Procédures de monitoring
- Plans de réponse aux incidents
- Politiques de sauvegarde et restauration
- Guide de scaling

### VI.D. Risques identifiés et plan de mitigation

#### Risque 1: Latence des appels vocaux
**Impact**: Dégradation de l'expérience utilisateur, abandon.
**Probabilité**: Moyenne
**Mitigation**:
- Tests de performance réguliers
- Optimisation de la chaîne d'intégration Twilio-Vapi
- Mise en cache des informations fréquemment accédées
- Surveillance proactive de la latence

#### Risque 2: Qualité insuffisante des prompts générés
**Impact**: Assistants peu performants, insatisfaction utilisateur.
**Probabilité**: Élevée
**Mitigation**:
- Investissement significatif dans la qualité du prompt de l'agent configurateur
- Tests approfondis avec différents secteurs d'activité
- Possibilité d'édition manuelle du prompt par l'utilisateur
- Amélioration continue basée sur les résultats réels

#### Risque 3: Disponibilité limitée des numéros de téléphone
**Impact**: Impossibilité d'attribuer des numéros, blocage du service.
**Probabilité**: Moyenne
**Mitigation**:
- Partenariat avec plusieurs fournisseurs de téléphonie
- Réservation préventive d'un pool de numéros
- Mise en place d'une file d'attente si nécessaire
- Alternative WebRTC pour les tests

#### Risque 4: Coûts des services tiers (Vapi, Twilio, LLM)
**Impact**: Non-viabilité économique du modèle.
**Probabilité**: Moyenne
**Mitigation**:
- Monitoring précis de la consommation
- Optimisation des prompts pour réduire les tokens LLM
- Limitation de la durée des appels
- Tarification adaptée et transparente pour l'utilisateur final

#### Risque 5: Conformité RGPD
**Impact**: Risques légaux, perte de confiance.
**Probabilité**: Moyenne
**Mitigation**:
- Audit de conformité RGPD préalable au lancement
- Anonymisation des données sensibles
- Procédures claires de gestion des droits des utilisateurs
- Politique de conservation des données stricte


