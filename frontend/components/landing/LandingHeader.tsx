"use client";

import Link from "next/link";
import { Bot } from "lucide-react";
import { Typography, Layout } from "antd";
import { Button } from "@/components/ui/Button";

const { Header } = Layout;

interface LandingHeaderProps {
  scrolled: boolean;
  glassmorphismStyle: React.CSSProperties;
}

export const LandingHeader = ({
  scrolled,
  glassmorphismStyle,
}: LandingHeaderProps) => {
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
      ? "var(--allokoli-shadow-lg)"
      : "var(--allokoli-shadow-md)",
    border: scrolled
      ? "1px solid var(--allokoli-primary-default)"
      : "1px solid var(--glass-border-color)",
  };

  return (
    <Header style={headerStyle}>
      <div style={headerContainerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              background:
                "linear-gradient(to right, var(--allokoli-primary-default), var(--allokoli-secondary-default))",
              borderRadius: "9999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bot style={{ color: "white", width: "24px", height: "24px" }} />
          </div>
          <Typography.Text
            strong
            style={{
              fontSize: "20px",
              color: "var(--allokoli-light-textPrimary)",
              fontFamily: "'Exo 2', sans-serif",
            }}
          >
            AlloKoli
          </Typography.Text>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="#features"
            style={{
              color: "var(--allokoli-light-textPrimary)",
              textDecoration: "none",
            }}
          >
            Fonctionnalités
          </Link>
          <Link
            href="#how-it-works"
            style={{
              color: "var(--allokoli-light-textPrimary)",
              textDecoration: "none",
            }}
          >
            Comment ça marche
          </Link>
          <Link
            href="#testimonials"
            style={{
              color: "var(--allokoli-light-textPrimary)",
              textDecoration: "none",
            }}
          >
            Témoignages
          </Link>
          <Link
            href="#pricing"
            style={{
              color: "var(--allokoli-light-textPrimary)",
              textDecoration: "none",
            }}
          >
            Tarifs
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" shape="round">
              Connexion
            </Button>
          </Link>
        </div>
      </div>
    </Header>
  );
};
