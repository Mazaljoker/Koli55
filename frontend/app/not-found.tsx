"use client";

import { motion } from "framer-motion";
import { Button, Switch } from "antd";
import {
  HomeOutlined,
  ReloadOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Creative404 } from "@/components/ui/404-creative";

// Types pour les animations
type FloatingElementProps = {
  delay: number;
  duration: number;
  children: React.ReactNode;
};

// Composant d'élément flottant
const FloatingElement = ({
  delay,
  duration,
  children,
}: FloatingElementProps) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  >
    {children}
  </motion.div>
);

// Composant de particule flottante
const ParticleElement = ({ index }: { index: number }) => (
  <motion.div
    className="absolute w-2 h-2 rounded-full bg-allokoli-primary opacity-20"
    initial={{
      x:
        Math.random() *
        (typeof window !== "undefined" ? window.innerWidth : 1000),
      y:
        Math.random() *
        (typeof window !== "undefined" ? window.innerHeight : 800),
      scale: 0,
    }}
    animate={{
      x:
        Math.random() *
        (typeof window !== "undefined" ? window.innerWidth : 1000),
      y:
        Math.random() *
        (typeof window !== "undefined" ? window.innerHeight : 800),
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 8 + Math.random() * 4,
      delay: index * 0.2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

// Version classique de la page 404
const Classic404 = () => {
  const [mounted, setMounted] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setShowParticles(true), 1000);
  }, []);

  // Messages d'erreur amusants
  const funnyMessages = [
    "Oups ! Cette page est partie en mission secrète ! 🕵️",
    "404 - Page introuvable, mais votre sourire l'est ! 😊",
    "Cette page joue à cache-cache... et elle gagne ! 🙈",
    "Erreur 404 : Page en vacances aux Bahamas ! 🏝️",
    "Houston, nous avons un problème... de navigation ! 🚀",
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % funnyMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [funnyMessages.length]);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-allokoli-primary-soft via-allokoli-light-background to-allokoli-secondary-light">
      {/* Particules flottantes */}
      {showParticles && (
        <>
          {Array.from({ length: 20 }).map((_, i) => (
            <ParticleElement key={i} index={i} />
          ))}
        </>
      )}

      {/* Contenu principal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animation d'entrée pour le titre */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            {/* Grande illustration 404 */}
            <div className="relative">
              <FloatingElement delay={0} duration={4}>
                <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-allokoli-primary-default to-allokoli-secondary-default mb-4 font-heading">
                  404
                </h1>
              </FloatingElement>

              {/* Effets visuels autour du 404 */}
              <motion.div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 w-96 h-96 bg-allokoli-primary-soft opacity-20"
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />

              <motion.div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 border-4 border-dashed rounded-full top-1/2 left-1/2 w-72 h-72 border-allokoli-secondary-default opacity-30"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 180 }}
                transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Message d'erreur animé */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-8"
          >
            <motion.h2
              key={currentMessage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-2xl font-semibold md:text-3xl text-allokoli-light-textPrimary font-heading"
            >
              {funnyMessages[currentMessage]}
            </motion.h2>

            <p className="max-w-2xl mx-auto text-lg text-allokoli-light-textSecondary">
              La page que vous cherchez n'existe pas ou a été déplacée. Mais ne
              vous inquiétez pas, nous allons vous ramener en sécurité ! 🛡️
            </p>
          </motion.div>

          {/* Illustrations créatives */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center justify-center gap-8 mb-12"
          >
            {/* Robot chercheur */}
            <FloatingElement delay={1} duration={3}>
              <div className="text-6xl">🤖</div>
            </FloatingElement>

            {/* Loupe */}
            <FloatingElement delay={1.5} duration={2.5}>
              <div className="text-5xl">🔍</div>
            </FloatingElement>

            {/* Boussole */}
            <FloatingElement delay={2} duration={3.5}>
              <div className="text-5xl">🧭</div>
            </FloatingElement>
          </motion.div>

          {/* Boutons d'action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/">
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                className="h-auto px-8 py-3 text-lg font-medium transition-all duration-300 transform rounded-xl shadow-allokoli-primary hover:shadow-lg hover:scale-105"
              >
                Retour à l'accueil
              </Button>
            </Link>

            <Button
              size="large"
              icon={<ReloadOutlined />}
              onClick={() => window.location.reload()}
              className="h-auto px-8 py-3 text-lg font-medium transition-all duration-300 transform border-2 rounded-xl border-allokoli-primary-default text-allokoli-primary-default hover:bg-allokoli-primary-soft hover:scale-105"
            >
              Réessayer
            </Button>
          </motion.div>

          {/* Message d'encouragement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-12"
          >
            <div className="max-w-md p-6 mx-auto glassmorphism rounded-xl">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-2xl">💡</span>
                <h3 className="text-lg font-semibold text-allokoli-light-textPrimary">
                  Suggestion
                </h3>
              </div>
              <p className="text-sm text-allokoli-light-textSecondary">
                Essayez de vérifier l'URL ou utilisez la recherche pour trouver
                ce que vous cherchez.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Éléments décoratifs de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Formes géométriques flottantes */}
        <motion.div
          className="absolute w-20 h-20 rounded-full top-20 left-10 bg-allokoli-accent-default opacity-10"
          initial={{ x: -100, rotate: 0 }}
          animate={{ x: 100, rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute w-16 h-16 rounded-lg bottom-20 right-10 bg-allokoli-secondary-default opacity-15"
          initial={{ y: 100, rotate: 0 }}
          animate={{ y: -100, rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute left-0 w-12 h-12 top-1/2 bg-allokoli-success-default opacity-20"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          initial={{ x: -50, scale: 0.5 }}
          animate={{ x: 50, scale: 1.5 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>
    </div>
  );
};

export default function NotFound() {
  const [isCyberMode, setIsCyberMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Switch de mode en position fixe */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed z-50 p-4 top-4 right-4 glassmorphism rounded-xl"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-allokoli-light-textPrimary">
            Mode Classic
          </span>
          <Switch
            checked={isCyberMode}
            onChange={setIsCyberMode}
            checkedChildren={<ThunderboltOutlined />}
            unCheckedChildren="🎨"
            className="bg-allokoli-primary-default"
          />
          <span className="text-sm font-medium text-allokoli-light-textPrimary">
            Mode Cyber
          </span>
        </div>
      </motion.div>

      {/* Rendu conditionnel des deux versions */}
      <motion.div
        key={isCyberMode ? "cyber" : "classic"}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
      >
        {isCyberMode ? <Creative404 /> : <Classic404 />}
      </motion.div>
    </>
  );
}
