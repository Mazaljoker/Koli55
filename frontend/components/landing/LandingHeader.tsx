"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bot, Menu as MenuIcon, X } from "lucide-react";
import { Typography, Layout, Menu, Drawer } from "antd";
import { Button } from "@/components/ui/Button";
import { useBreakpoint } from "@/lib/hooks/useBreakpoint";

const { Header } = Layout;
const { Item } = Menu;

interface LandingHeaderProps {
  scrolled: boolean;
  glassmorphismStyle: React.CSSProperties;
}

export const LandingHeader = ({
  scrolled,
  glassmorphismStyle,
}: LandingHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const breakpoint = useBreakpoint();

  // Fermer le menu mobile quand on passe en desktop
  useEffect(() => {
    if (breakpoint.isDesktop && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [breakpoint.isDesktop, mobileMenuOpen]);

  // Style du header qui change en fonction du scroll
  const headerStyle = {
    position: "fixed" as const,
    width: "100%",
    zIndex: 50,
    padding: breakpoint.isMobile ? "12px 16px" : "16px 24px",
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
    padding: breakpoint.isMobile ? "8px 16px" : "12px 24px",
    borderRadius: breakpoint.isMobile ? "16px" : "9999px",
    transition: "all 0.3s ease",
    boxShadow: scrolled
      ? "var(--allokoli-shadow-lg)"
      : "var(--allokoli-shadow-md)",
    border: scrolled
      ? "1px solid var(--allokoli-primary-default)"
      : "1px solid var(--glass-border-color)",
  };

  const menuItems = [
    { key: "features", label: "Fonctionnalités", href: "#features" },
    { key: "how-it-works", label: "Comment ça marche", href: "#how-it-works" },
    { key: "testimonials", label: "Témoignages", href: "#testimonials" },
    { key: "pricing", label: "Tarifs", href: "#pricing" },
    { key: "faq", label: "FAQ", href: "#faq" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMenuItemClick = () => {
    if (breakpoint.isMobile) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <Header style={headerStyle}>
      <div style={headerContainerStyle}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: breakpoint.isMobile ? "8px" : "12px",
            }}
          >
            <div
              style={{
                width: breakpoint.isMobile ? "36px" : "40px",
                height: breakpoint.isMobile ? "36px" : "40px",
                background:
                  "linear-gradient(to right, var(--allokoli-primary-default), var(--allokoli-secondary-default))",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot
                style={{
                  color: "white",
                  width: breakpoint.isMobile ? "20px" : "24px",
                  height: breakpoint.isMobile ? "20px" : "24px",
                }}
              />
            </div>
            <Typography.Text
              strong
              style={{
                fontSize: breakpoint.isMobile ? "18px" : "20px",
                color: "var(--allokoli-light-textPrimary)",
                fontFamily: "'Exo 2', sans-serif",
              }}
            >
              AlloKoli
            </Typography.Text>
          </div>
        </Link>

        {/* Menu Desktop */}
        {breakpoint.isDesktop && (
          <Menu
            mode="horizontal"
            style={{
              display: "flex",
              alignItems: "center",
              background: "transparent",
              border: "none",
              flex: 1,
              justifyContent: "center",
              maxWidth: "600px",
            }}
            className="landing-header-menu"
          >
            {menuItems.map((item) => (
              <Item key={item.key} style={{ borderBottom: "none" }}>
                <Link
                  href={item.href}
                  style={{
                    color: "var(--allokoli-light-textPrimary)",
                    textDecoration: "none",
                    fontWeight: "500",
                    transition: "color 0.3s ease",
                    fontSize: "14px",
                  }}
                  className="landing-header-menu-item"
                  onClick={handleMenuItemClick}
                >
                  {item.label}
                </Link>
              </Item>
            ))}
          </Menu>
        )}

        {/* Actions Desktop */}
        {breakpoint.isDesktop && (
          <div
            className="landing-header-actions"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Link href="/dashboard">
              <Button
                variant="primary"
                shape="round"
                size={breakpoint.isMobile ? "small" : "middle"}
              >
                Connexion
              </Button>
            </Link>
          </div>
        )}

        {/* Menu Burger Mobile */}
        {!breakpoint.isDesktop && (
          <div
            className="landing-header-mobile-toggle"
            style={{
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              transition: "background-color 0.3s ease",
              backgroundColor: mobileMenuOpen
                ? "rgba(124, 58, 237, 0.1)"
                : "transparent",
            }}
            onClick={toggleMobileMenu}
          >
            <MenuIcon
              style={{
                width: "24px",
                height: "24px",
                color: mobileMenuOpen
                  ? "var(--allokoli-primary-default)"
                  : "var(--allokoli-light-textPrimary)",
              }}
            />
          </div>
        )}
      </div>

      {/* Menu Mobile Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background:
                  "linear-gradient(to right, var(--allokoli-primary-default), var(--allokoli-secondary-default))",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Bot style={{ color: "white", width: "20px", height: "20px" }} />
            </div>
            <Typography.Text strong>AlloKoli</Typography.Text>
          </div>
        }
        placement="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        width={breakpoint.isMobile ? "85%" : 320}
        closeIcon={<X style={{ width: "20px", height: "20px" }} />}
        styles={{
          body: {
            padding: "24px",
          },
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={handleMenuItemClick}
              style={{
                color: "var(--allokoli-light-textPrimary)",
                textDecoration: "none",
                fontSize: "16px",
                fontWeight: "500",
                padding: "16px 20px",
                borderRadius: "12px",
                transition: "all 0.3s ease",
                display: "block",
              }}
              className="landing-header-mobile-item"
            >
              {item.label}
            </Link>
          ))}

          <div
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid var(--allokoli-light-border)",
            }}
          >
            <Link href="/dashboard" onClick={handleMenuItemClick}>
              <Button variant="primary" block size="large">
                Connexion
              </Button>
            </Link>
          </div>
        </div>
      </Drawer>

      {/* Styles CSS pour la responsivité */}
      <style jsx global>{`
        .landing-header-menu .ant-menu-item {
          border-bottom: none !important;
          margin: 0 4px;
        }

        .landing-header-menu .ant-menu-item:hover {
          background-color: rgba(124, 58, 237, 0.1) !important;
          border-radius: 8px;
        }

        .landing-header-menu-item:hover {
          color: var(--allokoli-primary-default) !important;
        }

        .landing-header-mobile-item:hover {
          background-color: var(--allokoli-light-surface) !important;
          color: var(--allokoli-primary-default) !important;
        }

        /* Smooth scroll pour les ancres */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 100px;
        }

        /* Style pour le drawer mobile */
        .ant-drawer-content-wrapper {
          backdrop-filter: blur(8px) !important;
        }
      `}</style>
    </Header>
  );
};
