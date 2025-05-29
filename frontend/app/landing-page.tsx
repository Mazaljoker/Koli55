"use client";

import { useEffect, useState } from "react";
import { Typography, Layout, ConfigProvider } from "antd";
import Head from "next/head";
import {
  LandingHeader,
  HeroSection,
  FeaturesSection,
  LandingFooter,
} from "@/components/landing";
import {
  HowItWorksSection,
  FAQSection,
  TestimonialsSection,
  PricingSection,
  CTASection,
} from "@/components/landing/sections";
import "./styles/card-animations.css";

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

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState(false);

  // Gestion du scroll pour les effets visuels
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // Logique pour activeFeatures pourrait être ajoutée ici
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
          href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700&family=Manrope:wght@400;500;600;700&family:Sora:wght@400;500;600;700&display=swap"
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
          background: "var(--allokoli-light-background)",
          minHeight: "100vh",
          position: "relative",
          opacity: 1,
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
          style={{
            position: "relative",
            zIndex: 1,
            paddingTop: "32px",
            // Suppression de l'espacement global pour éviter les chevauchements
            // Les sections gèrent maintenant leur propre espacement
          }}
        >
          {/* Section d'accueil avec fond violet subtil */}
          <div
            style={{
              background:
                "linear-gradient(135deg, var(--allokoli-primary-soft) 0%, var(--allokoli-secondary-light) 100%)",
              paddingBottom: "var(--allokoli-spacing-20)", // 80px
              borderRadius: "0 0 32px 32px",
              marginBottom: "var(--allokoli-spacing-16)", // 64px
            }}
          >
            <HeroSection glassmorphismStyle={glassmorphismStyle} />
          </div>

          <div style={{ marginBottom: "var(--allokoli-spacing-16)" }}>
            <FeaturesSection
              activeFeatures={activeFeatures}
              glassmorphismStyle={glassmorphismStyle}
            />
          </div>

          {/* Nouvelles sections refactorisées avec espacement approprié */}
          <div style={{ marginBottom: "var(--allokoli-spacing-16)" }}>
            <HowItWorksSection />
          </div>

          <div style={{ marginBottom: "var(--allokoli-spacing-16)" }}>
            <FAQSection />
          </div>

          <div style={{ marginBottom: "var(--allokoli-spacing-16)" }}>
            <TestimonialsSection />
          </div>

          <div style={{ marginBottom: "var(--allokoli-spacing-16)" }}>
            <PricingSection />
          </div>

          <CTASection />
        </Content>

        <LandingFooter />
      </Layout>
    </ConfigProvider>
  );
}
