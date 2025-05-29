import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConfigProvider } from "antd";
import { allokoliTheme } from "@/lib/config/theme";
import { ThemeProvider } from "./theme-provider";
import "./globals.css";
import "./styles/antd.css"; // Pour s'assurer que les styles spécifiques à Ant Design sont inclus

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Koli55 - Application",
  description: "Application Koli55 avec Next.js, Ant Design et Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-allokoli-background text-allokoli-text-primary`}
      >
        <ThemeProvider>
          <ConfigProvider theme={allokoliTheme}>{children}</ConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
