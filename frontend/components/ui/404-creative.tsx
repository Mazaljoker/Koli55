"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Button } from "antd";
import { HomeOutlined, SearchOutlined, HeartOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// Types
type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: { x: number; y: number };
};

export const Creative404 = () => {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values pour l'effet parallaxe
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 10 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 10 });

  useEffect(() => {
    setMounted(true);

    // Créer des particules initiales
    const initialParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * (window?.innerWidth || 1000),
      y: Math.random() * (window?.innerHeight || 800),
      size: Math.random() * 4 + 1,
      color: ["#7c3aed", "#3b82f6", "#f59e0b", "#10b981"][
        Math.floor(Math.random() * 4)
      ],
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
      },
    }));

    setParticles(initialParticles);
  }, []);

  // Gestionnaire de mouvement de souris
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden perspective-1000"
    >
      {/* Particules animées */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size,
            }}
            initial={{ x: particle.x, y: particle.y, opacity: 0.7 }}
            animate={{
              x: particle.x + particle.velocity.x * 100,
              y: particle.y + particle.velocity.y * 100,
              opacity: [0.7, 0.3, 0.7],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Contenu principal avec effet 3D */}
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 flex items-center justify-center min-h-screen px-4"
      >
        <div className="text-center max-w-4xl mx-auto">
          {/* Grand 404 avec effet néon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, z: -100 }}
            animate={{ opacity: 1, scale: 1, z: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8 relative"
            style={{ transform: "translateZ(50px)" }}
          >
            <div className="relative">
              <h1 className="text-8xl md:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 font-heading relative">
                404
                {/* Effets néon */}
                <div className="absolute inset-0 text-8xl md:text-[10rem] font-bold text-purple-400 opacity-50 blur-lg animate-pulse">
                  404
                </div>
                <div className="absolute inset-0 text-8xl md:text-[10rem] font-bold text-cyan-300 opacity-30 blur-xl animate-pulse">
                  404
                </div>
              </h1>

              {/* Hologramme effet */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                animate={{ x: [-100, 100] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ height: "100%", width: "20px", skewX: "-45deg" }}
              />
            </div>
          </motion.div>

          {/* Titre futuriste */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ transform: "translateZ(30px)" }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading">
              DIMENSION INCONNUE
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Vous avez atteint les confins de l'espace numérique. Cette
              coordonnée n'existe pas dans notre réalité. 🚀
            </p>
          </motion.div>

          {/* Console de navigation futuriste */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ transform: "translateZ(20px)" }}
            className="mb-12"
          >
            <div className="bg-black/50 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-8 max-w-md mx-auto shadow-2xl">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-mono ml-2">
                    NAVIGATION_CONSOLE.exe
                  </span>
                </div>

                <div className="font-mono text-sm text-green-400 space-y-1">
                  <div>$ scanning_universe...</div>
                  <div>$ error: dimension_not_found</div>
                  <div>
                    $ status:{" "}
                    <span className="text-red-400">LOST_IN_SPACE</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>$ rescue_protocol:</span>
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="bg-green-400 w-2 h-4 inline-block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Boutons avec effets holographiques */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            style={{ transform: "translateZ(10px)" }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05, z: 20 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <Button
                  type="primary"
                  size="large"
                  icon={<HomeOutlined />}
                  className="px-10 py-4 h-auto text-lg font-medium rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 border-none shadow-2xl relative overflow-hidden"
                >
                  <span className="relative z-10">RETOUR BASE</span>

                  {/* Effet holographique */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </Button>
              </motion.div>
            </Link>

            <motion.div
              whileHover={{ scale: 1.05, z: 20 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <Button
                size="large"
                icon={<SearchOutlined />}
                className="px-10 py-4 h-auto text-lg font-medium rounded-xl bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 relative overflow-hidden"
              >
                <span className="relative z-10">SCANNER</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Message d'espoir */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-16"
          >
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <HeartOutlined className="text-red-400 animate-pulse" />
              <span>Fait avec amour par l'équipe AlloKoli</span>
              <HeartOutlined className="text-red-400 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Grille cyberpunk en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(124, 58, 237, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(124, 58, 237, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Lignes de scan */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent"
        animate={{ y: [-100, window.innerHeight + 100] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        style={{ height: "100px" }}
      />
    </div>
  );
};
