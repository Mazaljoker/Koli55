'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Bot, ArrowRight, Check, Shield, Zap, Globe, Headphones, MessageSquare, ChevronDown, ChevronUp, Phone, Code, Lock, Rocket, Sparkles } from 'lucide-react';

// Données des témoignages
const testimonials = [
  {
    name: 'Marie Dubois',
    role: 'Directrice Service Client',
    company: 'TechVision',
    content: 'AlloKoli a transformé notre service client. La qualité des interactions est remarquable.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  },
  {
    name: 'Thomas Bernard',
    role: 'CEO',
    company: 'InnovTech',
    content: 'Une solution innovante qui nous a permis de réduire nos coûts de 40% tout en améliorant la satisfaction client.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  },
  {
    name: 'Sophie Martin',
    role: 'Responsable Innovation',
    company: 'DataFrance',
    content: 'L\'intégration a été simple et les résultats sont au-delà de nos attentes.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
  },
];

// Fonctionnalités
const features = [
  {
    title: 'Éditeur No Code',
    description: 'Construisez vos scénarios conversationnels avec une interface simple de type "Drag & Drop". Aucun code nécessaire.',
    icon: Sparkles,
  },
  {
    title: 'Multicanal',
    description: 'Connectez-vous à la téléphonie, WhatsApp, Messenger, et plus pour des interactions omnicanal fluides.',
    icon: Phone,
  },
  {
    title: 'Intelligence Artificielle',
    description: 'Automatisez les flux conversationnels avec des moteurs NLP et IA avancés.',
    icon: Bot,
  },
  {
    title: 'Déploiement Rapide',
    description: 'Mettez en production en moins de 5 minutes avec notre plateforme optimisée.',
    icon: Rocket,
  },
  {
    title: 'Sécurité Maximale',
    description: 'Protection des données et conformité RGPD garanties.',
    icon: Lock,
  },
  {
    title: 'Intégrations',
    description: 'Connectez facilement vos CRM et systèmes externes.',
    icon: Code,
  },
];

// Statistiques
const stats = [
  { value: '5min', label: 'Temps de déploiement' },
  { value: '99.9%', label: 'Disponibilité' },
  { value: '+40%', label: 'Satisfaction client' },
  { value: '-60%', label: 'Coûts opérationnels' },
];

// Composant animation
function FadeInWhenVisible({ children }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

// Composant FAQ
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Comment fonctionne AlloKoli ?',
      answer: 'AlloKoli utilise une IA avancée pour comprendre et répondre aux questions de vos clients en langage naturel, par téléphone ou chat.',
    },
    {
      question: 'Combien de temps pour la mise en place ?',
      answer: 'La configuration initiale prend moins de 30 minutes. Notre équipe vous accompagne pour une intégration optimale.',
    },
    {
      question: 'Quelles langues sont supportées ?',
      answer: 'AlloKoli supporte plus de 20 langues, dont le français, l\'anglais, l\'espagnol, l\'allemand, et bien d\'autres.',
    },
    {
      question: 'Est-ce personnalisable ?',
      answer: 'Oui, vous pouvez personnaliser la voix, le ton, les réponses et l\'intégrer à vos outils existants.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      {faqs.map((faq, index) => (
        <FadeInWhenVisible key={index}>
          <div className="border-b border-gray-200">
            <button
              className="w-full py-6 flex justify-between items-center text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="text-lg font-medium text-gray-900">{faq.question}</span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            <motion.div
              initial={false}
              animate={{ height: openIndex === index ? 'auto' : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="pb-6 text-gray-600">{faq.answer}</p>
            </motion.div>
          </div>
        </FadeInWhenVisible>
      ))}
    </div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9fb] to-white overflow-hidden">
      {/* Header */}
      <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50 px-6 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Bot className="text-[#435175] h-8 w-8" />
            <span className="text-2xl font-bold text-[#141616]">AlloKoli</span>
          </div>
          <Link href="/dashboard" className="bg-[#435175] text-white px-6 py-2 rounded-lg hover:bg-[#5b6a91] transition-colors">
            Essayer Gratuitement
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="pt-32 px-6 min-h-screen flex items-center relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-[#141616] mb-6">
              Créez des agents IA vocaux et textuels en moins de 5 minutes
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Plateforme CCaaS No Code pour déployer rapidement des assistants conversationnels sur téléphone, WhatsApp, Messenger et plus.
            </p>
            <div className="space-y-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">Aucun savoir-faire technique requis</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">Déploiement en moins de 5 minutes</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center space-x-3"
              >
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">Conformité RGPD garantie</span>
              </motion.div>
            </div>
            <Link href="/dashboard">
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-[#435175] text-white px-8 py-4 rounded-lg hover:bg-[#5b6a91] transition-colors flex items-center space-x-2"
              >
                <span>Commencer maintenant</span>
                <ArrowRight className="h-5 w-5" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 rounded-2xl shadow-xl border border-[#e9ecef]"
          >
            <h2 className="text-2xl font-semibold text-[#141616] mb-6">Créer un compte</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#435175] focus:border-[#435175]"
                  placeholder="exemple@domaine.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#435175] focus:border-[#435175]"
                  placeholder="Votre mot de passe"
                />
              </div>
              <button className="w-full bg-[#435175] text-white py-3 rounded-lg hover:bg-[#5b6a91] transition-colors">
                S'inscrire
              </button>
              <p className="text-sm text-center text-gray-600 mt-4">
                Déjà un compte? <Link href="/login" className="text-[#435175] font-medium">Se connecter</Link>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-1/4 -right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-3xl opacity-20"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200 to-green-200 rounded-full blur-3xl opacity-20"
          />
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FadeInWhenVisible key={index}>
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#435175] mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-[#f7f9fb]">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center text-[#141616] mb-4">
              Fonctionnalités clés
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Tout ce dont vous avez besoin pour des interactions client exceptionnelles
            </p>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FadeInWhenVisible key={index}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-[#e9ecef] hover:shadow-md transition-all"
                >
                  <feature.icon className="h-12 w-12 text-[#435175] mb-4" />
                  <h3 className="text-xl font-semibold text-[#141616] mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 bg-[#f7f9fb]">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center text-[#141616] mb-12">
              Ils nous font confiance
            </h2>
          </FadeInWhenVisible>

          <div className="relative h-[400px]">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: currentTestimonial === index ? 1 : 0,
                  x: currentTestimonial === index ? 0 : 100,
                }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 ${
                  currentTestimonial === index ? 'pointer-events-auto' : 'pointer-events-none'
                }`}
              >
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-[#141616]">{testimonial.name}</h3>
                      <p className="text-gray-600">{testimonial.role}</p>
                      <p className="text-[#435175]">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg italic">"{testimonial.content}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center text-[#141616] mb-12">
              Questions Fréquentes
            </h2>
          </FadeInWhenVisible>
          <FAQ />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#435175]">
        <div className="max-w-7xl mx-auto text-center">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à transformer vos interactions client ?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Rejoignez les entreprises qui font confiance à AlloKoli
            </p>
            <Link href="/dashboard">
              <button className="bg-white text-[#435175] px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors">
                Commencer maintenant
              </button>
            </Link>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#e9ecef] px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bot className="text-[#435175] h-6 w-6" />
                <span className="text-xl font-bold text-[#141616]">AlloKoli</span>
              </div>
              <p className="text-gray-600">
                Transformez vos interactions client avec l'intelligence artificielle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#141616] mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Fonctionnalités</li>
                <li>Intégrations</li>
                <li>Tarifs</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#141616] mb-4">Entreprise</h3>
              <ul className="space-y-2 text-gray-600">
                <li>À propos</li>
                <li>Blog</li>
                <li>Carrières</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#141616] mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Confidentialité</li>
                <li>Conditions d'utilisation</li>
                <li>RGPD</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>© {new Date().getFullYear()} AlloKoli. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
