"use client";

import React from "react";
// import Head from "next/head"; // Supprimé
import { FaUserCog, FaMicrophoneAlt, FaHeadset } from "react-icons/fa"; // Icônes d'exemple
import { FeatureCard } from "@/components/ui/cards/FeatureCard";
// Si FeatureCardProps est aussi nécessaire à l'extérieur, assurez-vous qu'il est exporté depuis FeatureCard.tsx
// et importez-le ici : import { FeatureCard, FeatureCardProps } from '@/components/ui/cards/FeatureCard';

export default function LandingPageV2() {
  return (
    <>
      {/* Les balises <Head> et son contenu ont été supprimées d'ici */}
      {/* Vous pouvez gérer <title> et <meta> via generateMetadata dans un layout ou page serveur parente, */}
      {/* ou laisser Next.js le déduire. */}

      {/* Utilise la couleur de fond définie dans globals.css (via tailwind.config.ts et body style) */}
      <div className="flex flex-col min-h-screen font-sans text-allokoli-text-primary">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-6 border-b md:px-8 lg:px-16 bg-white/80 backdrop-blur-md border-allokoli-border">
          <div className="container flex items-center justify-between mx-auto">
            <div className="text-3xl font-bold text-allokoli-primary">
              AlloKoli
            </div>
            <nav>
              <ul className="flex space-x-6 md:space-x-8">
                {/* Liens de navigation - exemple */}
                <li>
                  <a
                    href="#features"
                    className="transition-colors text-allokoli-text-secondary hover:text-allokoli-primary"
                  >
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="transition-colors text-allokoli-text-secondary hover:text-allokoli-primary"
                  >
                    Tarifs
                  </a>
                </li>
                <li>
                  <a
                    href="/login"
                    className="px-4 py-2 text-sm text-white btn-primary"
                  >
                    Connexion
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-grow pt-24 md:pt-32 bg-allokoli-background">
          {" "}
          {/* pt pour compenser le header fixed */}
          <section className="container flex flex-col items-center px-4 py-16 mx-auto text-center md:px-8 lg:px-16 md:py-24">
            <h1 className="mb-6 text-4xl font-bold leading-tight text-allokoli-text-primary md:text-5xl lg:text-6xl">
              Créez votre{" "}
              <span className="text-allokoli-primary">assistant vocal</span>{" "}
              intelligent
            </h1>
            <p className="max-w-2xl mb-10 text-lg text-allokoli-text-secondary md:text-xl lg:text-2xl">
              Personnalisez un agent virtuel pour gérer les appels de votre
              entreprise, améliorer l'expérience client et optimiser votre
              temps.
            </p>
            <button className="px-8 py-3 text-lg font-semibold text-white transition-transform duration-300 transform rounded-lg btn-primary md:text-xl md:py-4 md:px-10 hover:scale-105">
              Commencer gratuitement
            </button>
            <div className="relative w-full max-w-lg mt-12 md:mt-16 lg:max-w-xl">
              {/* Placeholder pour l'illustration de l'avatar féminin */}
              <div className="flex items-center justify-center mx-auto rounded-full aspect-square bg-allokoli-surface animate-fadeIn">
                <svg
                  className="w-1/2 opacity-50 h-1/2 text-allokoli-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                <div
                  className="absolute p-3 text-white rounded-lg shadow-lg -bottom-4 -right-4 md:-bottom-8 md:-right-8 bg-allokoli-secondary md:p-4 animate-fadeIn"
                  style={{ animationDelay: "0.3s" }}
                >
                  <p className="text-xs md:text-sm">
                    Bonjour ! Comment puis-je vous aider ?
                  </p>
                </div>
              </div>
              {/* Vous pouvez remplacer le div ci-dessus par une balise <Image> de Next.js avec votre illustration */}
              {/* Exemple: <Image src="/path/to/female-avatar-illustration.webp" alt="Assistant vocal AlloKoli" width={500} height={500} className="rounded-full"/> */}
            </div>
          </section>
          {/* Features Section */}
          <section
            id="features"
            className="py-16 md:py-24 bg-allokoli-surface/50"
          >
            {" "}
            {/* Léger changement de fond pour la section */}
            <div className="container px-4 mx-auto md:px-8 lg:px-16">
              <h2 className="mb-12 text-3xl font-bold text-center text-allokoli-text-primary md:text-4xl md:mb-16">
                Tout ce dont vous avez{" "}
                <span className="text-allokoli-secondary">besoin</span>,
                simplement.
              </h2>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
                <FeatureCard
                  icon={<FaUserCog className="w-12 h-12 md:w-16 md:h-16" />}
                  title="Personnalisation Poussée"
                  description="Définissez l'identité, la voix et les connaissances de votre assistant pour une intégration parfaite à votre marque."
                />
                <FeatureCard
                  icon={
                    <FaMicrophoneAlt className="w-12 h-12 md:w-16 md:h-16" />
                  }
                  title="Création Simplifiée"
                  description="Notre configurateur intuitif vous permet de bâtir et déployer votre agent virtuel en quelques clics, sans code."
                />
                <FeatureCard
                  icon={<FaHeadset className="w-12 h-12 md:w-16 md:h-16" />}
                  title="Gestion d'Appels Intelligente"
                  description="Réception, qualification, transfert d'appels, prise de messages : votre assistant gère tout, 24/7."
                />
              </div>
              <div className="mt-16 text-center md:mt-20">
                <button className="px-8 py-3 text-lg font-semibold text-white transition-transform duration-300 transform rounded-lg btn-primary md:text-xl md:py-4 md:px-10 hover:scale-105">
                  Essayer maintenant
                </button>
              </div>
            </div>
          </section>
          {/* TODO: Ajouter d'autres sections si nécessaire (Tarifs, FAQ, Footer, etc.) */}
        </main>
      </div>
    </>
  );
}
