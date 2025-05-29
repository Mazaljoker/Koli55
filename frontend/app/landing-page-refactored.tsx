"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Plus, Minus } from "lucide-react";
import {
  Typography,
  Row,
  Col,
  Card,
  Layout,
  ConfigProvider,
  Collapse,
} from "antd";
import Link from "next/link";
import Head from "next/head";
import { Button } from "@/components/ui/Button";
import {
  LandingHeader,
  HeroSection,
  FeaturesSection,
  LandingFooter,
} from "@/components/landing";
import "./styles/card-animations.css";

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;

// Configuration du thème Ant Design avec variables CSS
const theme = {
  token: {
    colorPrimary: "var(--allokoli-primary-default)",
    colorSecondary: "var(--allokoli-secondary-default)",
    colorTertiary: "var(--allokoli-primary-lighter)",
    colorBgContainer: "var(--allokoli-light-surface)",
    colorBgElevated: "var(--allokoli-light-surface)",
    colorText: "var(--allokoli-light-textPrimary)",
    borderRadius: 8,
    boxShadow: "var(--allokoli-shadow-md)",
    boxShadowSecondary: "var(--allokoli-shadow-lg)",
    fontFamily:
      "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
  components: {
    Button: {
      borderRadius: 8,
      colorPrimary: "var(--allokoli-primary-default)",
    },
    Typography: {
      colorText: "var(--allokoli-light-textPrimary)",
      fontFamilyHeading:
        "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      fontWeightStrong: 600,
    },
    Card: {
      colorBgContainer: "var(--allokoli-light-surface)",
      boxShadow: "var(--allokoli-shadow-md)",
      borderRadius: 16,
    },
  },
};

// Style glassmorphism utilisant le design system
const glassmorphismStyle = {
  background: "var(--glass-bg)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  boxShadow: "var(--allokoli-shadow-md)",
  border: "1px solid var(--glass-border-color)",
};

export default function LandingPageRefactored() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState(false);

  // Gestion du scroll pour les effets visuels
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setActiveFeatures(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ConfigProvider theme={theme}>
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

      {/* Styles globaux */}
      <style jsx global>{`
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
            "linear-gradient(135deg, var(--allokoli-primary-default) 0%, var(--allokoli-secondary-default) 100%)",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          position: "relative",
          opacity: 0.05,
        }}
      >
        {/* Pattern de grille en arrière-plan */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/assets/grid-pattern.svg)",
            opacity: 0.03,
            zIndex: 0,
          }}
        />

        <LandingHeader
          scrolled={scrolled}
          glassmorphismStyle={glassmorphismStyle}
        />

        <Content
          style={{ position: "relative", zIndex: 1, paddingTop: "32px" }}
        >
          <HeroSection glassmorphismStyle={glassmorphismStyle} />

          <FeaturesSection
            activeFeatures={activeFeatures}
            glassmorphismStyle={glassmorphismStyle}
          />

          {/* Section Comment ça marche - simplifiée */}
          <HowItWorksSection />

          {/* Section FAQ - simplifiée */}
          <FAQSection glassmorphismStyle={glassmorphismStyle} />

          {/* Section Témoignages - simplifiée */}
          <TestimonialsSection glassmorphismStyle={glassmorphismStyle} />

          {/* Section Tarifs - simplifiée */}
          <PricingSection glassmorphismStyle={glassmorphismStyle} />

          {/* CTA Final */}
          <CTASection glassmorphismStyle={glassmorphismStyle} />
        </Content>

        <LandingFooter />
      </Layout>
    </ConfigProvider>
  );
}

// Composants simplifiés pour les autres sections
const HowItWorksSection = () => (
  <div
    id="how-it-works"
    style={{
      padding: "96px 24px",
      background: "var(--allokoli-light-surface)",
    }}
  >
    <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
      <Title
        level={2}
        style={{
          marginBottom: "64px",
          color: "var(--allokoli-light-textPrimary)",
        }}
      >
        Comment ça marche ?
      </Title>
      <Row gutter={[32, 48]}>
        {[
          "Créez votre agent",
          "Configurez vos scénarios",
          "Déployez",
          "Analysez et ajustez",
        ].map((step, index) => (
          <Col xs={24} md={12} lg={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--allokoli-primary-soft)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  border: "2px solid var(--allokoli-primary-lighter)",
                }}
              >
                <Text
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "var(--allokoli-primary-default)",
                  }}
                >
                  {index + 1}
                </Text>
              </div>
              <Title
                level={4}
                style={{
                  marginBottom: "12px",
                  color: "var(--allokoli-light-textPrimary)",
                }}
              >
                {step}
              </Title>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  </div>
);

const FAQSection = ({
  glassmorphismStyle,
}: {
  glassmorphismStyle: React.CSSProperties;
}) => (
  <div id="faq" style={{ padding: "96px 24px" }}>
    <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
      <Title
        level={2}
        style={{
          textAlign: "center",
          marginBottom: "64px",
          color: "var(--allokoli-light-textPrimary)",
        }}
      >
        Questions fréquentes
      </Title>
      <Collapse
        bordered={false}
        expandIcon={({ isActive }) =>
          isActive ? (
            <Minus
              style={{
                color: "var(--allokoli-primary-default)",
                width: "20px",
                height: "20px",
              }}
            />
          ) : (
            <Plus
              style={{
                color: "var(--allokoli-primary-default)",
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
              <Text
                strong
                style={{
                  fontSize: "18px",
                  color: "var(--allokoli-light-textPrimary)",
                }}
              >
                Combien de temps pour déployer un assistant ?
              </Text>
            ),
            children: (
              <Paragraph
                style={{ color: "var(--allokoli-light-textSecondary)" }}
              >
                Moins de 5 minutes : tout se fait en ligne, sans installation ni
                compétences techniques.
              </Paragraph>
            ),
          },
          {
            key: "2",
            label: (
              <Text
                strong
                style={{
                  fontSize: "18px",
                  color: "var(--allokoli-light-textPrimary)",
                }}
              >
                Dois-je savoir coder ?
              </Text>
            ),
            children: (
              <Paragraph
                style={{ color: "var(--allokoli-light-textSecondary)" }}
              >
                Absolument pas. Notre interface No Code a été conçue pour les
                non-techniciens.
              </Paragraph>
            ),
          },
        ]}
      />
    </div>
  </div>
);

const TestimonialsSection = ({
  glassmorphismStyle,
}: {
  glassmorphismStyle: React.CSSProperties;
}) => (
  <div
    id="testimonials"
    style={{
      padding: "96px 24px",
      background: "var(--allokoli-light-surface)",
    }}
  >
    <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
      <Title
        level={2}
        style={{
          marginBottom: "32px",
          color: "var(--allokoli-light-textPrimary)",
        }}
      >
        Ils nous font confiance
      </Title>
      <Paragraph
        style={{
          fontSize: "18px",
          color: "var(--allokoli-light-textSecondary)",
        }}
      >
        Plus de 200 entreprises utilisent déjà AlloKoli pour moderniser leur
        relation client
      </Paragraph>
    </div>
  </div>
);

const PricingSection = ({
  glassmorphismStyle,
}: {
  glassmorphismStyle: React.CSSProperties;
}) => (
  <div id="pricing" style={{ padding: "96px 24px" }}>
    <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
      <Title
        level={2}
        style={{
          textAlign: "center",
          marginBottom: "64px",
          color: "var(--allokoli-light-textPrimary)",
        }}
      >
        Offres adaptées à vos besoins
      </Title>
      <Row gutter={[32, 32]} align="stretch">
        {[
          { name: "STARTER", price: "29€", popular: false },
          { name: "BUSINESS", price: "99€", popular: true },
          { name: "ENTERPRISE", price: "Sur mesure", popular: false },
        ].map((plan, index) => (
          <Col xs={24} md={8} key={index}>
            <Card
              style={{
                ...glassmorphismStyle,
                height: "100%",
                border: plan.popular
                  ? "2px solid var(--allokoli-primary-default)"
                  : "1px solid var(--glass-border-color)",
                position: "relative",
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--allokoli-primary-default)",
                    color: "white",
                    borderRadius: "12px",
                    padding: "4px 12px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  LE PLUS POPULAIRE
                </div>
              )}
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <Text
                  style={{
                    color: "var(--allokoli-primary-default)",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  {plan.name}
                </Text>
                <Title
                  level={2}
                  style={{
                    marginTop: "8px",
                    marginBottom: "8px",
                    color: "var(--allokoli-light-textPrimary)",
                  }}
                >
                  {plan.price}
                </Title>
              </div>
              <Link href="/dashboard">
                <Button
                  variant={plan.popular ? "primary" : "secondary"}
                  block
                  style={{ height: "44px" }}
                >
                  Commencer
                </Button>
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  </div>
);

const CTASection = ({
  glassmorphismStyle,
}: {
  glassmorphismStyle: React.CSSProperties;
}) => (
  <div style={{ padding: "80px 24px" }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <Card
        style={{
          ...glassmorphismStyle,
          background: "var(--glass-bg)",
          maxWidth: "1024px",
          margin: "0 auto",
          textAlign: "center",
          padding: "64px",
          borderRadius: "24px",
        }}
      >
        <Title
          level={2}
          style={{
            marginBottom: "24px",
            color: "var(--allokoli-light-textPrimary)",
          }}
        >
          Prêt à transformer vos conversations clients?
        </Title>
        <Paragraph
          style={{
            fontSize: "18px",
            marginBottom: "40px",
            color: "var(--allokoli-light-textSecondary)",
            maxWidth: "768px",
            margin: "0 auto 40px",
          }}
        >
          Testez AlloKoli dès aujourd&apos;hui et découvrez comment notre
          solution peut booster vos performances tout en simplifiant votre
          gestion.
        </Paragraph>
        <Link href="/dashboard">
          <Button
            variant="primary"
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
      </Card>
    </motion.div>
  </div>
);
