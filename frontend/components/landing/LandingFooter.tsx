"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import { Typography, Row, Col, Space, Layout } from "antd";

const { Footer } = Layout;
const { Text, Paragraph } = Typography;

export const LandingFooter = () => {
  return (
    <Footer
      style={{
        padding: "48px 24px",
        borderTop: "1px solid var(--allokoli-light-border)",
        background: "var(--allokoli-light-surface)",
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
                  background: "var(--allokoli-primary-default)",
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
              <Text
                strong
                style={{
                  fontSize: "18px",
                  color: "var(--allokoli-light-textPrimary)",
                }}
              >
                AlloKoli
              </Text>
            </div>
            <Paragraph
              style={{
                color: "var(--allokoli-light-textSecondary)",
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
                color: "var(--allokoli-light-textPrimary)",
                display: "block",
                marginBottom: "16px",
              }}
            >
              Produit
            </Text>
            <Space direction="vertical" size={8}>
              <Link
                href="#features"
                style={{
                  color: "var(--allokoli-light-textSecondary)",
                  textDecoration: "none",
                }}
              >
                Fonctionnalités
              </Link>
              <Link
                href="#pricing"
                style={{
                  color: "var(--allokoli-light-textSecondary)",
                  textDecoration: "none",
                }}
              >
                Tarifs
              </Link>
              <Link
                href="#testimonials"
                style={{
                  color: "var(--allokoli-light-textSecondary)",
                  textDecoration: "none",
                }}
              >
                Témoignages
              </Link>
              <Link
                href="#"
                style={{
                  color: "var(--allokoli-light-textSecondary)",
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
                color: "var(--allokoli-light-textPrimary)",
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
                  color: "var(--allokoli-light-textSecondary)",
                  textDecoration: "none",
                }}
              >
                À propos
              </Link>
              <Link
                href="#"
                style={{
                  color: "var(--allokoli-light-textSecondary)",
                  textDecoration: "none",
                }}
              >
                Blog
              </Link>
              <Link
                href="#"
                style={{
                  color: "var(--allokoli-light-textSecondary)",
                  textDecoration: "none",
                }}
              >
                Carrières
              </Link>
              <Link
                href="#"
                style={{
                  color: "var(--allokoli-light-textSecondary)",
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
                color: "var(--allokoli-light-textPrimary)",
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
                  color: "var(--allokoli-light-textSecondary)",
                  textDecoration: "none",
                }}
              >
                Conditions d&apos;utilisation
              </Link>
              <Link
                href="#"
                style={{
                  color: "var(--allokoli-light-textSecondary)",
                  textDecoration: "none",
                }}
              >
                Politique de confidentialité
              </Link>
              <Link
                href="#"
                style={{
                  color: "var(--allokoli-light-textSecondary)",
                  textDecoration: "none",
                }}
              >
                CGU
              </Link>
              <Link
                href="#"
                style={{
                  color: "var(--allokoli-light-textSecondary)",
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
            borderTop: "1px solid var(--allokoli-light-border)",
            textAlign: "center",
          }}
        >
          <Text style={{ color: "var(--allokoli-light-textTertiary)" }}>
            © {new Date().getFullYear()} AlloKoli. Tous droits réservés.
          </Text>
        </div>
      </div>
    </Footer>
  );
};
