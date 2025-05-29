"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Typography, Row, Col, Card, Space } from "antd";
import { Button } from "@/components/ui/Button";

const { Title, Paragraph, Text } = Typography;

interface HeroSectionProps {
  glassmorphismStyle: React.CSSProperties;
}

export const HeroSection = ({ glassmorphismStyle }: HeroSectionProps) => {
  return (
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
                color: "var(--allokoli-light-textPrimary)",
                margin: 0,
              }}
            >
              Créez des agents IA vocaux et textuels{" "}
              <span style={{ color: "var(--allokoli-primary-default)" }}>
                en moins de 5 minutes
              </span>
            </Title>
            <Paragraph
              style={{
                fontSize: "18px",
                color: "var(--allokoli-light-textSecondary)",
                margin: 0,
              }}
            >
              Avec AlloKoli, révolutionnez la façon dont votre entreprise gère
              ses interactions clients. Notre plateforme CCaaS vous permet de
              créer, configurer et déployer des assistants conversationnels
              intelligents sur téléphone, WhatsApp, Messenger et d&apos;autres
              canaux populaires, sans aucune compétence technique requise.
            </Paragraph>

            <Space direction="vertical" size={16}>
              {[
                "Aucun savoir-faire technique requis",
                "Déploiement en moins de 5 minutes",
                "Conformité RGPD garantie",
                "Données hébergées en Europe",
                "Déjà +200 entreprises séduites",
              ].map((text, index) => (
                <div
                  key={index}
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
                      background:
                        index % 2 === 0
                          ? "var(--allokoli-primary-default)"
                          : index === 2
                          ? "var(--allokoli-primary-lighter)"
                          : "var(--allokoli-secondary-default)",
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
                  <Text
                    style={{ color: "var(--allokoli-light-textSecondary)" }}
                  >
                    {text}
                  </Text>
                </div>
              ))}
            </Space>

            <div>
              <Link href="/dashboard">
                <Button
                  variant="primary"
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
                background: "var(--glass-bg)",
              }}
              variant="borderless"
            >
              <div
                style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "var(--allokoli-shadow-lg)",
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
  );
};
