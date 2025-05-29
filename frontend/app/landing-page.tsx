"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bot,
  ArrowRight,
  Check,
  Phone,
  Code,
  Lock,
  Rocket,
  Sparkles,
  Plus,
  Minus,
} from "lucide-react";
import {
  Typography,
  Row,
  Col,
  Card,
  Space,
  Layout,
  ConfigProvider,
  Collapse,
} from "antd";
import "./styles/card-animations.css";

// Import pour les polices (assurez-vous qu'elles sont disponibles dans votre projet)
// Vous pouvez ajouter ces polices dans votre _app.tsx ou _document.tsx également
import Head from "next/head";
import { Button } from "@/components/ui/Button";

const { Title, Text, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

// Définition des tokens de couleur Ant Design
// Note: Normalement, ces tokens devraient être définis dans le theme-provider.tsx
const theme = {
  token: {
    colorPrimary: "#7745FF", // Violet
    colorSecondary: "#5769FF", // Blue
    colorTertiary: "#9CB8FF", // Light blue
    colorBgContainer: "#F7F7FC", // Background
    colorBgElevated: "#F2F5FF", // Accent
    colorText: "#1B1D2A", // Text
    borderRadius: 8,
    // Respecter l'échelle de spacing Ant Design (multiples de 8px)
    marginXS: 8,
    marginSM: 16,
    margin: 24,
    marginMD: 32,
    marginLG: 40,
    marginXL: 48,
    padding: 24,
    paddingSM: 16,
    paddingXS: 8,
    paddingLG: 32,
    paddingXL: 40,
    // Ombres cohérentes
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    boxShadowSecondary: "0 8px 24px rgba(0, 0, 0, 0.12)",
    // Configuration des polices
    fontFamily:
      "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
      colorPrimary: "#7745FF",
    },
    Typography: {
      colorText: "#1B1D2A",
      fontFamilyHeading:
        "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeightStrong: 600,
    },
    Card: {
      colorBgContainer: "rgba(255, 255, 255, 0.7)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      borderRadius: 16,
    },
  },
};

// Fonctionnalités
const features = [
  {
    title: "Éditeur No Code",
    description:
      "Construisez vos scénarios conversationnels avec une interface intuitive de type Drag & Drop. Aucune compétence technique requise pour créer des flux conversationnels complets.",
    icon: Sparkles,
    iconColor: "#7745FF",
  },
  {
    title: "Multicanal",
    description:
      "Gérez tous vos canaux de communication depuis une interface unique : téléphonie, WhatsApp, Messenger et plus encore. Offrez une expérience client cohérente sur tous les points de contact.",
    icon: Phone,
    iconColor: "#5769FF",
  },
  {
    title: "Intelligence Artificielle",
    description:
      "Notre plateforme intègre des moteurs NLP avancés pour comprendre, analyser et répondre naturellement à vos clients. Détection automatique des intentions et gestion des demandes complexes.",
    icon: Bot,
    iconColor: "#7745FF",
  },
  {
    title: "Déploiement Rapide",
    description:
      "En moins de 5 minutes, votre assistant est opérationnel. Aucun serveur à configurer, aucune installation technique : tout est géré depuis votre navigateur.",
    icon: Rocket,
    iconColor: "#5769FF",
  },
  {
    title: "Sécurité Maximale",
    description:
      "Données hébergées en Europe sur des serveurs sécurisés, conformes aux dernières réglementations RGPD. Protection et confidentialité garanties pour toutes vos interactions.",
    icon: Lock,
    iconColor: "#7745FF",
  },
  {
    title: "Intégrations",
    description:
      "Connectez facilement vos assistants à vos outils existants : CRM, ERP, Helpdesk, Google Calendar et plus. API disponible pour des intégrations personnalisées.",
    icon: Code,
    iconColor: "#5769FF",
  },
];

// Style global pour le glassmorphism
const glassmorphismStyle = {
  background: "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
};

// Styles d'animation utilisés directement dans les composants

export default function LandingPage() {
  const featuresRef = useRef(null);
  // useInView sera utilisé directement dans les animations si nécessaire
  const [scrolled, setScrolled] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Détecter le scroll pour ajouter des effets
  useEffect(() => {
    const handleScroll = () => {
      // Effet header
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Effet features cards
      if (featuresRef.current) {
        const rect = (
          featuresRef.current as HTMLElement
        ).getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setActiveFeatures(true);
        } else {
          setActiveFeatures(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Déclencher une fois au chargement
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Style du header qui change en fonction du scroll
  const headerStyle = {
    position: "fixed" as const,
    width: "100%",
    zIndex: 50,
    padding: "16px 24px",
    background: "transparent",
    height: "auto",
    transition: "all 0.3s ease",
  };

  // Style du conteneur du header qui change en fonction du scroll
  const headerContainerStyle = {
    ...glassmorphismStyle,
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    borderRadius: "9999px",
    transition: "all 0.3s ease",
    boxShadow: scrolled
      ? "0 8px 24px rgba(119, 69, 255, 0.15)"
      : "0 4px 15px rgba(0, 0, 0, 0.05)",
    border: scrolled
      ? "1px solid rgba(119, 69, 255, 0.3)"
      : "1px solid rgba(255, 255, 255, 0.2)",
  };

  return (
    <ConfigProvider theme={theme}>
      {/* Ajout des polices via Google Fonts */}
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Style pour l'animation de pulse */}
      <style jsx global>{`
        @keyframes glowingPulse {
          0% {
            box-shadow: 0 0 5px rgba(119, 69, 255, 0.4),
              0 0 10px rgba(119, 69, 255, 0.2);
            border-color: rgba(119, 69, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 10px rgba(119, 69, 255, 0.6),
              0 0 20px rgba(119, 69, 255, 0.4);
            border-color: rgba(119, 69, 255, 0.9);
          }
          100% {
            box-shadow: 0 0 5px rgba(119, 69, 255, 0.4),
              0 0 10px rgba(119, 69, 255, 0.2);
            border-color: rgba(119, 69, 255, 0.7);
          }
        }

        .elevated-card {
          transition: all 0.4s ease;
        }

        .elevated-card.in-view {
          transform: translateY(-10px);
          box-shadow: 0 12px 30px rgba(119, 69, 255, 0.2);
          border: 2px solid rgba(119, 69, 255, 0.4);
        }

        .elevated-card:hover {
          transform: translateY(-16px);
          animation: glowingPulse 2s infinite alternate;
        }

        /* Ajout des styles globaux pour les polices */
        body {
          font-family: "Manrope", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: "Sora", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
        }

        .exo-font {
          font-family: "Exo 2", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
        }
      `}</style>

      <Layout
        style={{
          background:
            "linear-gradient(to right, rgba(119, 69, 255, 0.1), rgba(87, 105, 255, 0.1))",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        {/* Pattern de grille en arrière-plan */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/assets/grid-pattern.svg)",
            opacity: 0.05,
            zIndex: 0,
          }}
        />

        {/* Header - Utilisation du composant Header d'Ant Design */}
        <Header style={headerStyle}>
          <div style={headerContainerStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  background: "linear-gradient(to right, #7745FF, #5769FF)",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Bot
                  style={{ color: "white", width: "24px", height: "24px" }}
                />
              </div>
              <Typography.Text
                strong
                style={{
                  fontSize: "20px",
                  color: "#1B1D2A",
                  fontFamily: "'Exo 2', sans-serif",
                }}
              >
                AlloKoli
              </Typography.Text>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Link
                href="#features"
                style={{ color: "#1B1D2A", textDecoration: "none" }}
              >
                Fonctionnalités
              </Link>
              <Link
                href="#how-it-works"
                style={{ color: "#1B1D2A", textDecoration: "none" }}
              >
                Comment ça marche
              </Link>
              <Link
                href="#testimonials"
                style={{ color: "#1B1D2A", textDecoration: "none" }}
              >
                Témoignages
              </Link>
              <Link
                href="#pricing"
                style={{ color: "#1B1D2A", textDecoration: "none" }}
              >
                Tarifs
              </Link>
              <Link href="/dashboard">
                <Button type="primary" shape="round">
                  Connexion
                </Button>
              </Link>
            </div>
          </div>
        </Header>

        <Content
          style={{ position: "relative", zIndex: 1, paddingTop: "32px" }}
        >
          {/* Hero Section - Utilisation de Row/Col d'Ant Design pour la grille */}
          <div style={{ paddingTop: "104px", padding: "104px 24px 0" }}>
            <Row
              gutter={[32, 32]}
              style={{
                maxWidth: "1280px",
                margin: "0 auto",
                alignItems: "center",
              }}
            >
              {/* Colonne de gauche - Contenu principal */}
              <Col xs={24} lg={12}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "32px",
                  }}
                >
                  <Title
                    level={1}
                    style={{
                      fontSize: "40px",
                      lineHeight: "1.2",
                      color: "#1B1D2A",
                      margin: 0,
                    }}
                  >
                    Créez des agents IA vocaux et textuels{" "}
                    <span style={{ color: "#7745FF" }}>
                      en moins de 5 minutes
                    </span>
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: "18px",
                      color: "rgba(27, 29, 42, 0.8)",
                      margin: 0,
                    }}
                  >
                    Avec AlloKoli, révolutionnez la façon dont votre entreprise
                    gère ses interactions clients. Notre plateforme CCaaS vous
                    permet de créer, configurer et déployer des assistants
                    conversationnels intelligents sur téléphone, WhatsApp,
                    Messenger et d&apos;autres canaux populaires, sans aucune
                    compétence technique requise.
                  </Paragraph>

                  <Space direction="vertical" size={16}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "9999px",
                          background: "#7745FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Check
                          style={{
                            color: "white",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                      </div>
                      <Text style={{ color: "rgba(27, 29, 42, 0.8)" }}>
                        Aucun savoir-faire technique requis
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "9999px",
                          background: "#5769FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Check
                          style={{
                            color: "white",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                      </div>
                      <Text style={{ color: "rgba(27, 29, 42, 0.8)" }}>
                        Déploiement en moins de 5 minutes
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "9999px",
                          background: "#9CB8FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Check
                          style={{
                            color: "white",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                      </div>
                      <Text style={{ color: "rgba(27, 29, 42, 0.8)" }}>
                        Conformité RGPD garantie
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "9999px",
                          background: "#7745FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Check
                          style={{
                            color: "white",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                      </div>
                      <Text style={{ color: "rgba(27, 29, 42, 0.8)" }}>
                        Données hébergées en Europe
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "9999px",
                          background: "#5769FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Check
                          style={{
                            color: "white",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                      </div>
                      <Text style={{ color: "rgba(27, 29, 42, 0.8)" }}>
                        Déjà +200 entreprises séduites
                      </Text>
                    </div>
                  </Space>

                  <div>
                    <Link href="/dashboard">
                      <Button
                        type="primary"
                        size="large"
                        style={{
                          height: "48px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          paddingLeft: "32px",
                          paddingRight: "32px",
                        }}
                      >
                        <span>Commencer maintenant</span>
                        <ArrowRight style={{ width: "20px", height: "20px" }} />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </Col>

              {/* Colonne de droite - Image */}
              <Col xs={24} lg={12}>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Card
                    style={{
                      ...glassmorphismStyle,
                      padding: "32px",
                      background: "rgba(255, 255, 255, 0.6)",
                    }}
                    variant="borderless"
                  >
                    <div
                      style={{
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
                      }}
                    >
                      <img
                        src="/assets/dashboard-preview.png"
                        alt="AlloKoli Dashboard Preview"
                        style={{
                          width: "100%",
                          height: "auto",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/800x600?text=AlloKoli+Dashboard";
                        }}
                      />
                    </div>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </div>

          {/* Features Section - Utilisation de Row/Col avec Cards */}
          <div id="features" ref={featuresRef} style={{ padding: "96px 24px" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              {/* Section title - spans full width */}
              <div style={{ textAlign: "center", marginBottom: "64px" }}>
                <Title
                  level={2}
                  style={{ color: "#1B1D2A", marginBottom: "16px" }}
                >
                  Fonctionnalités
                </Title>
                <Paragraph
                  style={{
                    fontSize: "18px",
                    color: "rgba(27, 29, 42, 0.7)",
                    maxWidth: "768px",
                    margin: "0 auto",
                  }}
                >
                  Déployez des assistants intelligents sur tous vos canaux en
                  quelques clics
                </Paragraph>
              </div>

              {/* Feature grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
              <Row gutter={[40, 40]}>
                {features.map((feature, index) => (
                  <Col xs={24} md={12} lg={8} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{
                        y: -16,
                        transition: { duration: 0.3 },
                      }}
                      style={{
                        transform: activeFeatures
                          ? "translateY(-10px)"
                          : "translateY(0)",
                        transition: "transform 0.4s ease",
                      }}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <Card
                        style={{
                          ...glassmorphismStyle,
                          height: "100%",
                          transition: "all 0.3s ease",
                          boxShadow: activeFeatures
                            ? "0 12px 30px rgba(119, 69, 255, 0.2)"
                            : "0 4px 15px rgba(0, 0, 0, 0.05)",
                          border: activeFeatures
                            ? hoveredCard === index
                              ? "2px solid #7745FF"
                              : "2px solid rgba(119, 69, 255, 0.4)"
                            : "1px solid rgba(255, 255, 255, 0.2)",
                          animation:
                            hoveredCard === index
                              ? "glowingPulse 2s infinite alternate"
                              : "none",
                        }}
                        variant="outlined"
                        hoverable
                        styles={{
                          body: {
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                          },
                        }}
                      >
                        <div
                          style={{
                            padding: "12px",
                            borderRadius: "9999px",
                            background: `rgba(${
                                                          feature.iconColor === "var(--allokoli-primary-hover)"
                                                            ? "119, 69, 255"
                                                            : "87, 105, 255"
                                                        }, 0.1)`,
                            width: "56px",
                            height: "56px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "16px",
                          }}
                        >
                          <feature.icon
                            style={{
                              color: feature.iconColor,
                              width: "28px",
                              height: "28px",
                            }}
                          />
                        </div>
                        <Title
                          level={3}
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            marginBottom: "12px",
                            color: feature.iconColor,
                          }}
                        >
                          {feature.title}
                        </Title>
                        <Paragraph
                          style={{
                            color: "rgba(27, 29, 42, 0.7)",
                            flexGrow: 1,
                            margin: 0,
                          }}
                        >
                          {feature.description}
                        </Paragraph>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </div>
          </div>

          {/* Two column section - alternating content and visual */}
          <div
            style={{
              padding: "80px 24px",
              background:
                "linear-gradient(to right, rgba(242, 245, 255, 0.5), rgba(247, 247, 252, 0.5))",
            }}
          >
            <Row
              gutter={[48, 48]}
              style={{
                maxWidth: "1280px",
                margin: "0 auto",
                alignItems: "center",
              }}
            >
              {/* Left column - Content */}
              <Col xs={24} lg={12}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                  }}
                >
                  <Title
                    level={2}
                    style={{ fontSize: "30px", color: "#1B1D2A" }}
                  >
                    Simplifiez vos interactions client
                  </Title>
                  <Paragraph
                    style={{ fontSize: "16px", color: "rgba(27, 29, 42, 0.7)" }}
                  >
                    Notre plateforme intuitive vous permet de gérer toutes vos
                    interactions client depuis un seul endroit. Créez, déployez
                    et analysez vos assistants conversationnels sans code.
                  </Paragraph>
                  <Space direction="vertical" size={16}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "9999px",
                          background: "#7745FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "4px",
                        }}
                      >
                        <Check
                          style={{
                            color: "white",
                            width: "12px",
                            height: "12px",
                          }}
                        />
                      </div>
                      <Text style={{ color: "rgba(27, 29, 42, 0.8)" }}>
                        Analyses détaillées et rapports en temps réel
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "9999px",
                          background: "#7745FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "4px",
                        }}
                      >
                        <Check
                          style={{
                            color: "white",
                            width: "12px",
                            height: "12px",
                          }}
                        />
                      </div>
                      <Text style={{ color: "rgba(27, 29, 42, 0.8)" }}>
                        Personnalisation complète des flux conversationnels
                      </Text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "9999px",
                          background: "#7745FF",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginTop: "4px",
                        }}
                      >
                        <Check
                          style={{
                            color: "white",
                            width: "12px",
                            height: "12px",
                          }}
                        />
                      </div>
                      <Text style={{ color: "rgba(27, 29, 42, 0.8)" }}>
                        Intégration facile avec vos outils existants
                      </Text>
                    </div>
                  </Space>
                </div>
              </Col>

              {/* Right column - Visual */}
              <Col xs={24} lg={12}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card
                    style={{
                      ...glassmorphismStyle,
                      background: "rgba(255, 255, 255, 0.5)",
                      overflow: "hidden",
                    }}
                    variant="outlined"
                    styles={{ body: { padding: 0 } }}
                  >
                    <img
                      src="/assets/conversation-flow.png"
                      alt="Interface de flux conversationnel"
                      style={{ width: "100%", borderRadius: "8px" }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/600x400?text=Flow+Builder";
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </div>

          {/* Comment ça marche - Nouvelle section */}
          <div id="how-it-works" style={{ padding: "96px 24px" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              {/* Section title */}
              <div style={{ textAlign: "center", marginBottom: "64px" }}>
                <Title
                  level={2}
                  style={{ color: "#1B1D2A", marginBottom: "16px" }}
                >
                  Comment ça marche ?
                </Title>
                <Paragraph
                  style={{
                    fontSize: "18px",
                    color: "rgba(27, 29, 42, 0.7)",
                    maxWidth: "768px",
                    margin: "0 auto",
                  }}
                >
                  Créez et déployez votre assistant IA en 4 étapes simples
                </Paragraph>
              </div>

              {/* Steps */}
              <Row gutter={[32, 48]}>
                <Col xs={24} md={12} lg={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          background: "rgba(119, 69, 255, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 20px",
                          border: "2px solid rgba(119, 69, 255, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#7745FF",
                          }}
                        >
                          1
                        </Text>
                      </div>
                      <Title
                        level={4}
                        style={{ color: "#1B1D2A", marginBottom: "12px" }}
                      >
                        Créez votre agent
                      </Title>
                      <Paragraph style={{ color: "rgba(27, 29, 42, 0.7)" }}>
                        Utilisez notre assistant guidé pour nommer votre agent
                        et choisir ses canaux de communication.
                      </Paragraph>
                    </div>
                  </motion.div>
                </Col>

                <Col xs={24} md={12} lg={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          background: "rgba(87, 105, 255, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 20px",
                          border: "2px solid rgba(87, 105, 255, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#5769FF",
                          }}
                        >
                          2
                        </Text>
                      </div>
                      <Title
                        level={4}
                        style={{ color: "#1B1D2A", marginBottom: "12px" }}
                      >
                        Configurez vos scénarios
                      </Title>
                      <Paragraph style={{ color: "rgba(27, 29, 42, 0.7)" }}>
                        Sélectionnez des modèles prêts à l&apos;emploi ou
                        utilisez l&apos;éditeur Drag & Drop pour créer des flux
                        sur mesure.
                      </Paragraph>
                    </div>
                  </motion.div>
                </Col>

                <Col xs={24} md={12} lg={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          background: "rgba(119, 69, 255, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 20px",
                          border: "2px solid rgba(119, 69, 255, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#7745FF",
                          }}
                        >
                          3
                        </Text>
                      </div>
                      <Title
                        level={4}
                        style={{ color: "#1B1D2A", marginBottom: "12px" }}
                      >
                        Déployez
                      </Title>
                      <Paragraph style={{ color: "rgba(27, 29, 42, 0.7)" }}>
                        Activez votre assistant sur les canaux souhaités
                        (téléphonie, WhatsApp, Messenger...) d&apos;un simple
                        clic.
                      </Paragraph>
                    </div>
                  </motion.div>
                </Col>

                <Col xs={24} md={12} lg={6}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          background: "rgba(87, 105, 255, 0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 20px",
                          border: "2px solid rgba(87, 105, 255, 0.2)",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "24px",
                            fontWeight: "bold",
                            color: "#5769FF",
                          }}
                        >
                          4
                        </Text>
                      </div>
                      <Title
                        level={4}
                        style={{ color: "#1B1D2A", marginBottom: "12px" }}
                      >
                        Analysez et ajustez
                      </Title>
                      <Paragraph style={{ color: "rgba(27, 29, 42, 0.7)" }}>
                        Consultez les statistiques en temps réel et modifiez vos
                        scénarios à la volée pour améliorer les performances.
                      </Paragraph>
                    </div>
                  </motion.div>
                </Col>
              </Row>

              <div style={{ textAlign: "center", marginTop: "64px" }}>
                <Paragraph
                  style={{
                    color: "rgba(27, 29, 42, 0.7)",
                    maxWidth: "768px",
                    margin: "0 auto 24px",
                  }}
                >
                  En 10 minutes seulement, un salon de coiffure peut créer un
                  assistant pour gérer les rendez-vous, répondre aux questions
                  sur les horaires et transmettre les demandes urgentes à
                  l&apos;équipe.
                </Paragraph>
                <Link href="/dashboard">
                  <Button type="default" size="large">
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div
            id="faq"
            style={{
              padding: "96px 24px",
              background:
                "linear-gradient(to right, rgba(242, 245, 255, 0.5), rgba(247, 247, 252, 0.5))",
            }}
          >
            <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "64px" }}>
                <Title
                  level={2}
                  style={{ color: "#1B1D2A", marginBottom: "16px" }}
                >
                  Questions fréquentes
                </Title>
                <Paragraph
                  style={{
                    fontSize: "18px",
                    color: "rgba(27, 29, 42, 0.7)",
                    maxWidth: "768px",
                    margin: "0 auto",
                  }}
                >
                  Tout ce que vous devez savoir sur AlloKoli
                </Paragraph>
              </div>

              <Collapse
                bordered={false}
                expandIcon={({ isActive }) =>
                  isActive ? (
                    <Minus
                      style={{
                        color: "#7745FF",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  ) : (
                    <Plus
                      style={{
                        color: "#7745FF",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  )
                }
                style={{ background: "transparent" }}
                items={[
                  {
                    key: "1",
                    label: (
                      <Text strong style={{ fontSize: "18px" }}>
                        Combien de temps pour déployer un assistant ?
                      </Text>
                    ),
                    children: (
                      <Paragraph style={{ color: "rgba(27, 29, 42, 0.7)" }}>
                        Moins de 5 minutes : tout se fait en ligne, sans
                        installation ni compétences techniques. Nommez votre
                        agent, choisissez ses canaux et configurez ses réponses,
                        c&apos;est prêt !
                      </Paragraph>
                    ),
                  },
                  {
                    key: "2",
                    label: (
                      <Text strong style={{ fontSize: "18px" }}>
                        Dois-je savoir coder ?
                      </Text>
                    ),
                    children: (
                      <Paragraph style={{ color: "rgba(27, 29, 42, 0.7)" }}>
                        Absolument pas. Notre interface No Code a été conçue
                        pour les non-techniciens. Tout se fait par
                        glisser-déposer et paramétrage visuel.
                      </Paragraph>
                    ),
                  },
                  {
                    key: "3",
                    label: (
                      <Text strong style={{ fontSize: "18px" }}>
                        Où sont stockées les données ?
                      </Text>
                    ),
                    children: (
                      <Paragraph style={{ color: "rgba(27, 29, 42, 0.7)" }}>
                        Les données sont hébergées exclusivement en Europe, sur
                        des serveurs conformes RGPD. Nous garantissons la
                        sécurité et la confidentialité de toutes vos
                        informations.
                      </Paragraph>
                    ),
                  },
                  {
                    key: "4",
                    label: (
                      <Text strong style={{ fontSize: "18px" }}>
                        Quels canaux sont compatibles ?
                      </Text>
                    ),
                    children: (
                      <Paragraph style={{ color: "rgba(27, 29, 42, 0.7)" }}>
                        AlloKoli prend en charge la téléphonie, WhatsApp,
                        Messenger, Webchat, Email et plus encore. Vous pouvez
                        activer ces canaux selon vos besoins et votre forfait.
                      </Paragraph>
                    ),
                  },
                  {
                    key: "5",
                    label: (
                      <Text strong style={{ fontSize: "18px" }}>
                        Puis-je intégrer mon CRM ou un logiciel métier ?
                      </Text>
                    ),
                    children: (
                      <Paragraph style={{ color: "rgba(27, 29, 42, 0.7)" }}>
                        Oui, de nombreuses intégrations sont disponibles en
                        natif (Salesforce, HubSpot, Microsoft Dynamics...) ou
                        via notre API pour des connexions personnalisées avec
                        vos outils existants.
                      </Paragraph>
                    ),
                  },
                  {
                    key: "6",
                    label: (
                      <Text strong style={{ fontSize: "18px" }}>
                        L&apos;assistance est-elle comprise ?
                      </Text>
                    ),
                    children: (
                      <Paragraph style={{ color: "rgba(27, 29, 42, 0.7)" }}>
                        Oui, notre équipe vous accompagne à chaque étape, de la
                        création à l&apos;optimisation de vos assistants. Un
                        support technique est disponible par chat et email pour
                        tous nos clients.
                      </Paragraph>
                    ),
                  },
                  {
                    key: "7",
                    label: (
                      <Text strong style={{ fontSize: "18px" }}>
                        Puis-je tester gratuitement ?
                      </Text>
                    ),
                    children: (
                      <Paragraph style={{ color: "rgba(27, 29, 42, 0.7)" }}>
                        Bien sûr : inscrivez-vous et profitez d&apos;une période
                        d&apos;essai sans engagement. Accédez à toutes les
                        fonctionnalités et créez votre premier assistant pour
                        l&apos;évaluer en conditions réelles.
                      </Paragraph>
                    ),
                  },
                ]}
              />
            </div>
          </div>

          {/* Témoignages Section */}
          <div id="testimonials" style={{ padding: "96px 24px" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "64px" }}>
                <Title
                  level={2}
                  style={{ color: "#1B1D2A", marginBottom: "16px" }}
                >
                  Ils nous font confiance
                </Title>
                <Paragraph
                  style={{
                    fontSize: "18px",
                    color: "rgba(27, 29, 42, 0.7)",
                    maxWidth: "768px",
                    margin: "0 auto",
                  }}
                >
                  Plus de 200 entreprises ont choisi AlloKoli pour moderniser
                  leur relation client
                </Paragraph>
              </div>

              <Row gutter={[32, 32]}>
                <Col xs={24} md={12} lg={8}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      style={{
                        ...glassmorphismStyle,
                        height: "100%",
                      }}
                      variant="outlined"
                    >
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", marginBottom: "16px" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="#FFD700"
                            >
                              <path d="M10 1L13 7L19 8L14.5 13L16 19L10 16L4 19L5.5 13L1 8L7 7L10 1Z" />
                            </svg>
                          ))}
                        </div>
                        <Paragraph
                          style={{
                            color: "rgba(27, 29, 42, 0.7)",
                            fontSize: "16px",
                          }}
                        >
                          &quot;En moins de 10 minutes, j&apos;ai mis en place
                          un standard téléphonique intelligent pour mon cabinet.
                          Les patients laissent leurs messages et reçoivent une
                          confirmation par SMS.&quot;
                        </Paragraph>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: "#F0F2FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "16px",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              color: "#7745FF",
                            }}
                          >
                            S
                          </Text>
                        </div>
                        <div>
                          <Text
                            strong
                            style={{ display: "block", fontSize: "16px" }}
                          >
                            Sophie
                          </Text>
                          <Text style={{ color: "rgba(27, 29, 42, 0.6)" }}>
                            Dentiste à Lyon
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>

                <Col xs={24} md={12} lg={8}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      style={{
                        ...glassmorphismStyle,
                        height: "100%",
                      }}
                      variant="outlined"
                    >
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", marginBottom: "16px" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="#FFD700"
                            >
                              <path d="M10 1L13 7L19 8L14.5 13L16 19L10 16L4 19L5.5 13L1 8L7 7L10 1Z" />
                            </svg>
                          ))}
                        </div>
                        <Paragraph
                          style={{
                            color: "rgba(27, 29, 42, 0.7)",
                            fontSize: "16px",
                          }}
                        >
                          &quot;Grâce à AlloKoli, nous avons automatisé la prise
                          de rendez-vous et le suivi des commandes sur WhatsApp
                          et Messenger. Notre équipe a divisé par deux le temps
                          passé au téléphone !&quot;
                        </Paragraph>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: "#F0F2FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "16px",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              color: "#5769FF",
                            }}
                          >
                            H
                          </Text>
                        </div>
                        <div>
                          <Text
                            strong
                            style={{ display: "block", fontSize: "16px" }}
                          >
                            Hugo
                          </Text>
                          <Text style={{ color: "rgba(27, 29, 42, 0.6)" }}>
                            Responsable service client
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>

                <Col xs={24} md={12} lg={8}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Card
                      style={{
                        ...glassmorphismStyle,
                        height: "100%",
                      }}
                      variant="outlined"
                    >
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", marginBottom: "16px" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="#FFD700"
                            >
                              <path d="M10 1L13 7L19 8L14.5 13L16 19L10 16L4 19L5.5 13L1 8L7 7L10 1Z" />
                            </svg>
                          ))}
                        </div>
                        <Paragraph
                          style={{
                            color: "rgba(27, 29, 42, 0.7)",
                            fontSize: "16px",
                          }}
                        >
                          &quot;Notre agence immobilière utilise AlloKoli pour
                          répondre aux demandes 24/7, qualifier les clients
                          potentiels et organiser des visites. Nos agents sont
                          plus productifs et nos clients apprécient la
                          réactivité.&quot;
                        </Paragraph>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            background: "#F0F2FF",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "16px",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: "18px",
                              fontWeight: "bold",
                              color: "#7745FF",
                            }}
                          >
                            M
                          </Text>
                        </div>
                        <div>
                          <Text
                            strong
                            style={{ display: "block", fontSize: "16px" }}
                          >
                            Mathilde
                          </Text>
                          <Text style={{ color: "rgba(27, 29, 42, 0.6)" }}>
                            Directrice agence immobilière
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Comparatif et Tarifs Section */}
          <div
            id="pricing"
            style={{
              padding: "96px 24px",
              background:
                "linear-gradient(to right, rgba(242, 245, 255, 0.5), rgba(247, 247, 252, 0.5))",
            }}
          >
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <div style={{ textAlign: "center", marginBottom: "64px" }}>
                <Title
                  level={2}
                  style={{ color: "#1B1D2A", marginBottom: "16px" }}
                >
                  Offres adaptées à vos besoins
                </Title>
                <Paragraph
                  style={{
                    fontSize: "18px",
                    color: "rgba(27, 29, 42, 0.7)",
                    maxWidth: "768px",
                    margin: "0 auto",
                  }}
                >
                  Des forfaits flexibles pour tous types d&apos;entreprises
                </Paragraph>
              </div>

              <Row gutter={[32, 32]} align="stretch">
                <Col xs={24} md={8}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    style={{ height: "100%" }}
                  >
                    <Card
                      style={{
                        ...glassmorphismStyle,
                        height: "100%",
                      }}
                      variant="outlined"
                    >
                      <div
                        style={{ textAlign: "center", marginBottom: "24px" }}
                      >
                        <Text
                          style={{
                            color: "#7745FF",
                            fontWeight: "bold",
                            fontSize: "16px",
                            fontFamily: "'Exo 2', sans-serif",
                          }}
                        >
                          STARTER
                        </Text>
                        <Title
                          level={2}
                          style={{ marginTop: "8px", marginBottom: "8px" }}
                        >
                          29€{" "}
                          <Text
                            style={{
                              fontSize: "16px",
                              fontWeight: "normal",
                              color: "rgba(27, 29, 42, 0.6)",
                            }}
                          >
                            /mois
                          </Text>
                        </Title>
                        <Paragraph style={{ color: "rgba(27, 29, 42, 0.6)" }}>
                          Idéal pour les petites entreprises
                        </Paragraph>
                      </div>

                      <div style={{ marginBottom: "32px" }}>
                        <Space direction="vertical" size={12}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>1 assistant conversationnel</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>2 canaux au choix</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>500 interactions/mois</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>Support par email</Text>
                          </div>
                        </Space>
                      </div>

                      <Link href="/dashboard">
                        <Button type="default" block style={{ height: "44px" }}>
                          Commencer
                        </Button>
                      </Link>
                    </Card>
                  </motion.div>
                </Col>

                <Col xs={24} md={8}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    style={{ height: "100%" }}
                  >
                    <Card
                      style={{
                        ...glassmorphismStyle,
                        height: "100%",
                        border: "2px solid #7745FF",
                        boxShadow: "0 8px 32px rgba(119, 69, 255, 0.15)",
                      }}
                      variant="outlined"
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "-12px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "#7745FF",
                          color: "white",
                          borderRadius: "12px",
                          padding: "4px 12px",
                          fontSize: "12px",
                          fontWeight: "bold",
                          fontFamily: "'Exo 2', sans-serif",
                        }}
                      >
                        LE PLUS POPULAIRE
                      </div>
                      <div
                        style={{ textAlign: "center", marginBottom: "24px" }}
                      >
                        <Text
                          style={{
                            color: "#7745FF",
                            fontWeight: "bold",
                            fontSize: "16px",
                            fontFamily: "'Exo 2', sans-serif",
                          }}
                        >
                          BUSINESS
                        </Text>
                        <Title
                          level={2}
                          style={{ marginTop: "8px", marginBottom: "8px" }}
                        >
                          99€{" "}
                          <Text
                            style={{
                              fontSize: "16px",
                              fontWeight: "normal",
                              color: "rgba(27, 29, 42, 0.6)",
                            }}
                          >
                            /mois
                          </Text>
                        </Title>
                        <Paragraph style={{ color: "rgba(27, 29, 42, 0.6)" }}>
                          Pour les entreprises en croissance
                        </Paragraph>
                      </div>

                      <div style={{ marginBottom: "32px" }}>
                        <Space direction="vertical" size={12}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>5 assistants conversationnels</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>Tous les canaux inclus</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>3 000 interactions/mois</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>Support prioritaire</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>Intégrations CRM</Text>
                          </div>
                        </Space>
                      </div>

                      <Link href="/dashboard">
                        <Button type="primary" block style={{ height: "44px" }}>
                          Commencer
                        </Button>
                      </Link>
                    </Card>
                  </motion.div>
                </Col>

                <Col xs={24} md={8}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    style={{ height: "100%" }}
                  >
                    <Card
                      style={{
                        ...glassmorphismStyle,
                        height: "100%",
                      }}
                      variant="outlined"
                    >
                      <div
                        style={{ textAlign: "center", marginBottom: "24px" }}
                      >
                        <Text
                          style={{
                            color: "#7745FF",
                            fontWeight: "bold",
                            fontSize: "16px",
                            fontFamily: "'Exo 2', sans-serif",
                          }}
                        >
                          ENTERPRISE
                        </Text>
                        <Title
                          level={2}
                          style={{ marginTop: "8px", marginBottom: "8px" }}
                        >
                          Sur mesure
                        </Title>
                        <Paragraph style={{ color: "rgba(27, 29, 42, 0.6)" }}>
                          Pour les besoins avancés
                        </Paragraph>
                      </div>

                      <div style={{ marginBottom: "32px" }}>
                        <Space direction="vertical" size={12}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>Assistants illimités</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>Tous les canaux inclus</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>Volume illimité</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>Support dédié 24/7</Text>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "12px",
                            }}
                          >
                            <Check
                              style={{
                                color: "#7745FF",
                                width: "20px",
                                height: "20px",
                                flexShrink: 0,
                                marginTop: "4px",
                              }}
                            />
                            <Text>
                              API avancée et intégrations personnalisées
                            </Text>
                          </div>
                        </Space>
                      </div>

                      <Link href="/dashboard">
                        <Button type="default" block style={{ height: "44px" }}>
                          Contacter les ventes
                        </Button>
                      </Link>
                    </Card>
                  </motion.div>
                </Col>
              </Row>
            </div>
          </div>

          {/* CTA Section - Full width row */}
          <div style={{ padding: "80px 24px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              whileHover={{
                boxShadow: "0 12px 32px rgba(119, 69, 255, 0.2)",
                border: "2px solid rgba(119, 69, 255, 0.5)",
                transition: { duration: 0.3 },
              }}
            >
              <Card
                style={{
                  ...glassmorphismStyle,
                  background: "rgba(255, 255, 255, 0.4)",
                  maxWidth: "1024px",
                  margin: "0 auto",
                  textAlign: "center",
                  padding: "64px",
                  borderRadius: "24px",
                }}
                variant="outlined"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Title
                    level={2}
                    style={{ color: "#1B1D2A", marginBottom: "24px" }}
                  >
                    Prêt à transformer vos conversations clients?
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: "18px",
                      color: "rgba(27, 29, 42, 0.7)",
                      marginBottom: "20px",
                      maxWidth: "768px",
                      margin: "0 auto 20px",
                    }}
                  >
                    Testez AlloKoli dès aujourd&apos;hui : créez votre premier
                    assistant IA en quelques minutes et découvrez comment notre
                    solution peut booster vos performances tout en simplifiant
                    votre gestion.
                  </Paragraph>
                  <Paragraph
                    style={{
                      fontSize: "16px",
                      color: "rgba(27, 29, 42, 0.6)",
                      marginBottom: "40px",
                      maxWidth: "768px",
                      margin: "0 auto 40px",
                    }}
                  >
                    Garantie satisfait ou remboursé pendant la période
                    d&apos;essai. Plus de 200 entreprises ont déjà adopté
                    AlloKoli pour leur relation client.
                  </Paragraph>
                  <Link href="/dashboard">
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        height: "48px",
                        paddingLeft: "32px",
                        paddingRight: "32px",
                      }}
                    >
                      Essayer Gratuitement
                    </Button>
                  </Link>
                </motion.div>
              </Card>
            </motion.div>
          </div>
        </Content>

        {/* Footer - Four column grid on desktop, stacks on mobile */}
        <Footer
          style={{
            padding: "48px 24px",
            borderTop: "1px solid rgba(156, 184, 255, 0.2)",
            background: "rgba(247, 247, 252, 0.5)",
          }}
        >
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12} lg={6}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "#7745FF",
                      borderRadius: "9999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Bot
                      style={{ color: "white", width: "20px", height: "20px" }}
                    />
                  </div>
                  <Text strong style={{ fontSize: "18px", color: "#1B1D2A" }}>
                    AlloKoli
                  </Text>
                </div>
                <Paragraph
                  style={{
                    color: "rgba(27, 29, 42, 0.6)",
                    marginBottom: "16px",
                  }}
                >
                  Solutions conversationnelles IA pour toutes vos interactions
                  client.
                </Paragraph>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <Text
                  strong
                  style={{
                    color: "#1B1D2A",
                    display: "block",
                    marginBottom: "16px",
                  }}
                >
                  Produit
                </Text>
                <Space direction="vertical" size={8}>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    Fonctionnalités
                  </Link>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    Tarifs
                  </Link>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    Témoignages
                  </Link>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    Guide d&apos;utilisation
                  </Link>
                </Space>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <Text
                  strong
                  style={{
                    color: "#1B1D2A",
                    display: "block",
                    marginBottom: "16px",
                  }}
                >
                  Société
                </Text>
                <Space direction="vertical" size={8}>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    À propos
                  </Link>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    Blog
                  </Link>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    Carrières
                  </Link>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    Contact
                  </Link>
                </Space>
              </Col>

              <Col xs={24} md={12} lg={6}>
                <Text
                  strong
                  style={{
                    color: "#1B1D2A",
                    display: "block",
                    marginBottom: "16px",
                  }}
                >
                  Légal
                </Text>
                <Space direction="vertical" size={8}>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    Conditions d&apos;utilisation
                  </Link>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    Politique de confidentialité
                  </Link>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    CGU
                  </Link>
                  <Link
                    href="#"
                    style={{
                      color: "rgba(27, 29, 42, 0.6)",
                      textDecoration: "none",
                    }}
                  >
                    RGPD
                  </Link>
                </Space>
              </Col>
            </Row>

            <div
              style={{
                marginTop: "48px",
                paddingTop: "32px",
                borderTop: "1px solid rgba(156, 184, 255, 0.1)",
                textAlign: "center",
              }}
            >
              <Text style={{ color: "rgba(27, 29, 42, 0.5)" }}>
                © {new Date().getFullYear()} AlloKoli. Tous droits réservés.
              </Text>
            </div>
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
