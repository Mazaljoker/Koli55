"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Code, Lock, Rocket, Sparkles, Bot } from "lucide-react";
import { Typography, Row, Col, Card } from "antd";

const { Title, Paragraph } = Typography;

// Fonctionnalités avec couleurs du design system
const features = [
  {
    title: "Éditeur No Code",
    description:
      "Construisez vos scénarios conversationnels avec une interface intuitive de type Drag & Drop. Aucune compétence technique requise pour créer des flux conversationnels complets.",
    icon: Sparkles,
    iconColor: "var(--allokoli-primary-default)",
  },
  {
    title: "Multicanal",
    description:
      "Gérez tous vos canaux de communication depuis une interface unique : téléphonie, WhatsApp, Messenger et plus encore. Offrez une expérience client cohérente sur tous les points de contact.",
    icon: Phone,
    iconColor: "var(--allokoli-secondary-default)",
  },
  {
    title: "Intelligence Artificielle",
    description:
      "Notre plateforme intègre des moteurs NLP avancés pour comprendre, analyser et répondre naturellement à vos clients. Détection automatique des intentions et gestion des demandes complexes.",
    icon: Bot,
    iconColor: "var(--allokoli-primary-default)",
  },
  {
    title: "Déploiement Rapide",
    description:
      "En moins de 5 minutes, votre assistant est opérationnel. Aucun serveur à configurer, aucune installation technique : tout est géré depuis votre navigateur.",
    icon: Rocket,
    iconColor: "var(--allokoli-secondary-default)",
  },
  {
    title: "Sécurité Maximale",
    description:
      "Données hébergées en Europe sur des serveurs sécurisés, conformes aux dernières réglementations RGPD. Protection et confidentialité garanties pour toutes vos interactions.",
    icon: Lock,
    iconColor: "var(--allokoli-primary-default)",
  },
  {
    title: "Intégrations",
    description:
      "Connectez facilement vos assistants à vos outils existants : CRM, ERP, Helpdesk, Google Calendar et plus. API disponible pour des intégrations personnalisées.",
    icon: Code,
    iconColor: "var(--allokoli-secondary-default)",
  },
];

interface FeaturesSectionProps {
  activeFeatures: boolean;
  glassmorphismStyle: React.CSSProperties;
}

export const FeaturesSection = ({
  activeFeatures,
  glassmorphismStyle,
}: FeaturesSectionProps) => {
  const featuresRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div id="features" ref={featuresRef} style={{ padding: "96px 24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Section title - spans full width */}
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <Title
            level={2}
            style={{
              color: "var(--allokoli-light-textPrimary)",
              marginBottom: "16px",
            }}
          >
            Fonctionnalités
          </Title>
          <Paragraph
            style={{
              fontSize: "18px",
              color: "var(--allokoli-light-textSecondary)",
              maxWidth: "768px",
              margin: "0 auto",
            }}
          >
            Déployez des assistants intelligents sur tous vos canaux en quelques
            clics
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
                      ? "var(--allokoli-shadow-lg)"
                      : "var(--allokoli-shadow-md)",
                    border: activeFeatures
                      ? hoveredCard === index
                        ? "2px solid var(--allokoli-primary-default)"
                        : "2px solid var(--allokoli-primary-lighter)"
                      : "1px solid var(--glass-border-color)",
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
                      background:
                        feature.iconColor === "var(--allokoli-primary-default)"
                          ? "var(--allokoli-primary-soft)"
                          : "var(--allokoli-secondary-light)",
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
                      color: "var(--allokoli-light-textSecondary)",
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
  );
};
