'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, Check, Phone, Code, Lock, Rocket, Sparkles } from 'lucide-react';
import { 
  Typography, 
  Button, 
  Row, 
  Col, 
  Card, 
  Space, 
  Layout, 
  ConfigProvider
} from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

// Définition des tokens de couleur Ant Design
// Note: Normalement, ces tokens devraient être définis dans le theme-provider.tsx
const theme = {
  token: {
    colorPrimary: '#7745FF', // Violet
    colorSecondary: '#5769FF', // Blue
    colorTertiary: '#9CB8FF', // Light blue
    colorBgContainer: '#F7F7FC', // Background
    colorBgElevated: '#F2F5FF', // Accent
    colorText: '#1B1D2A', // Text
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
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    boxShadowSecondary: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
  components: {
    Button: {
      borderRadius: 8,
      colorPrimary: '#7745FF',
    },
    Typography: {
      colorText: '#1B1D2A',
    },
    Card: {
      colorBgContainer: 'rgba(255, 255, 255, 0.7)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      borderRadius: 16,
    },
  },
};

// Fonctionnalités
const features = [
  {
    title: 'Éditeur No Code',
    description: 'Construisez vos scénarios conversationnels avec une interface simple de type "Drag & Drop".',
    icon: Sparkles,
    iconColor: '#7745FF',
  },
  {
    title: 'Multicanal',
    description: 'Connectez-vous à la téléphonie, WhatsApp, Messenger pour des interactions omnicanal.',
    icon: Phone,
    iconColor: '#5769FF',
  },
  {
    title: 'Intelligence Artificielle',
    description: 'Automatisez les flux conversationnels avec des moteurs NLP et IA avancés.',
    icon: Bot,
    iconColor: '#7745FF',
  },
  {
    title: 'Déploiement Rapide',
    description: 'Mettez en production en moins de 5 minutes avec notre plateforme optimisée.',
    icon: Rocket,
    iconColor: '#5769FF',
  },
  {
    title: 'Sécurité Maximale',
    description: 'Protection des données et conformité RGPD garanties.',
    icon: Lock,
    iconColor: '#7745FF',
  },
  {
    title: 'Intégrations',
    description: 'Connectez facilement vos CRM et systèmes externes.',
    icon: Code,
    iconColor: '#5769FF',
  },
];

// Style global pour le glassmorphism
const glassmorphismStyle = {
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

export default function LandingPage() {
  const featuresRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  
  // Détecter le scroll pour ajouter des effets
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Style du header qui change en fonction du scroll
  const headerStyle = {
    position: 'fixed' as const,
    width: '100%',
    zIndex: 50,
    padding: '16px 24px',
    background: 'transparent',
    height: 'auto',
    transition: 'all 0.3s ease',
  };
  
  // Style du conteneur du header qui change en fonction du scroll
  const headerContainerStyle = {
    ...glassmorphismStyle,
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    borderRadius: '9999px',
    transition: 'all 0.3s ease',
    boxShadow: scrolled 
      ? '0 8px 24px rgba(0, 0, 0, 0.15)' 
      : '0 4px 15px rgba(0, 0, 0, 0.05)',
    border: scrolled 
      ? '1px solid rgba(255, 255, 255, 0.3)'
      : '1px solid rgba(255, 255, 255, 0.2)',
  };

  return (
    <ConfigProvider theme={theme}>
      <Layout style={{ 
        background: 'linear-gradient(to right, rgba(119, 69, 255, 0.1), rgba(87, 105, 255, 0.1))',
        minHeight: '100vh',
        position: 'relative',
      }}>
        {/* Pattern de grille en arrière-plan */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/grid-pattern.svg)',
          opacity: 0.05,
          zIndex: 0,
        }} />

        {/* Header - Utilisation du composant Header d'Ant Design */}
        <Header style={headerStyle}>
          <div style={headerContainerStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(to right, #7745FF, #5769FF)',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Bot style={{ color: 'white', width: '24px', height: '24px' }} />
              </div>
              <Typography.Text strong style={{ fontSize: '20px', color: '#1B1D2A' }}>
                AlloKoli
              </Typography.Text>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="#features" style={{ color: '#1B1D2A', textDecoration: 'none' }}>
                Fonctionnalités
              </Link>
              <Link href="#testimonials" style={{ color: '#1B1D2A', textDecoration: 'none' }}>
                Témoignages
              </Link>
              <Link href="#pricing" style={{ color: '#1B1D2A', textDecoration: 'none' }}>
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

        <Content style={{ position: 'relative', zIndex: 1, paddingTop: '32px' }}>
          {/* Hero Section - Utilisation de Row/Col d'Ant Design pour la grille */}
          <div style={{ paddingTop: '104px', padding: '104px 24px 0' }}>
            <Row 
              gutter={[32, 32]} 
              style={{ 
                maxWidth: '1280px', 
                margin: '0 auto',
                alignItems: 'center',
              }}
            >
              {/* Colonne de gauche - Contenu principal */}
              <Col xs={24} lg={12}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                >
                  <Title level={1} style={{ fontSize: '40px', lineHeight: '1.2', color: '#1B1D2A', margin: 0 }}>
                    Créez des agents IA vocaux et textuels <span style={{ color: '#7745FF' }}>en moins de 5 minutes</span>
                  </Title>
                  <Paragraph style={{ fontSize: '18px', color: 'rgba(27, 29, 42, 0.8)', margin: 0 }}>
                    Plateforme CCaaS No Code pour déployer rapidement des assistants conversationnels sur téléphone, WhatsApp, Messenger et plus.
                  </Paragraph>
                  
                  <Space direction="vertical" size={16}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '9999px',
                        background: '#7745FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Check style={{ color: 'white', width: '16px', height: '16px' }} />
                      </div>
                      <Text style={{ color: 'rgba(27, 29, 42, 0.8)' }}>Aucun savoir-faire technique requis</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '9999px',
                        background: '#5769FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Check style={{ color: 'white', width: '16px', height: '16px' }} />
                      </div>
                      <Text style={{ color: 'rgba(27, 29, 42, 0.8)' }}>Déploiement en moins de 5 minutes</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '9999px',
                        background: '#9CB8FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Check style={{ color: 'white', width: '16px', height: '16px' }} />
                      </div>
                      <Text style={{ color: 'rgba(27, 29, 42, 0.8)' }}>Conformité RGPD garantie</Text>
                    </div>
                  </Space>

                  <div>
                    <Link href="/dashboard">
                      <Button 
                        type="primary" 
                        size="large"
                        style={{ 
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          paddingLeft: '32px',
                          paddingRight: '32px',
                        }}
                      >
                        <span>Commencer maintenant</span>
                        <ArrowRight style={{ width: '20px', height: '20px' }} />
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
                      padding: '32px',
                      background: 'rgba(255, 255, 255, 0.6)',
                    }}
                    bordered={false}
                  >
                    <div style={{ 
                      borderRadius: '8px', 
                      overflow: 'hidden', 
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
                    }}>
                      <img 
                        src="/assets/dashboard-preview.png" 
                        alt="AlloKoli Dashboard Preview" 
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/800x600?text=AlloKoli+Dashboard';
                        }}
                      />
                    </div>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </div>

          {/* Features Section - Utilisation de Row/Col avec Cards */}
          <div id="features" ref={featuresRef} style={{ padding: '96px 24px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              {/* Section title - spans full width */}
              <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                <Title level={2} style={{ color: '#1B1D2A', marginBottom: '16px' }}>
                  Fonctionnalités
                </Title>
                <Paragraph style={{ 
                  fontSize: '18px', 
                  color: 'rgba(27, 29, 42, 0.7)', 
                  maxWidth: '768px', 
                  margin: '0 auto' 
                }}>
                  Déployez des assistants intelligents sur tous vos canaux en quelques clics
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
                        y: -8,
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        transition: { duration: 0.3 }
                      }}
                    >
                      <Card
                        style={{
                          ...glassmorphismStyle,
                          height: '100%',
                          transition: 'all 0.3s ease',
                        }}
                        bordered={false}
                        hoverable
                        className="feature-card"
                        bodyStyle={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          height: '100%' 
                        }}
                      >
                        <div style={{ 
                          padding: '12px', 
                          borderRadius: '9999px', 
                          background: `rgba(${feature.iconColor === '#7745FF' ? '119, 69, 255' : '87, 105, 255'}, 0.1)`, 
                          width: '56px', 
                          height: '56px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginBottom: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}>
                          <feature.icon style={{ color: feature.iconColor, width: '28px', height: '28px' }} />
                        </div>
                        <Title level={3} style={{ 
                          fontSize: '18px', 
                          fontWeight: '600', 
                          marginBottom: '12px', 
                          color: feature.iconColor 
                        }}>
                          {feature.title}
                        </Title>
                        <Paragraph style={{ 
                          color: 'rgba(27, 29, 42, 0.7)', 
                          flexGrow: 1,
                          margin: 0,
                        }}>
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
          <div style={{ 
            padding: '80px 24px', 
            background: 'linear-gradient(to right, rgba(242, 245, 255, 0.5), rgba(247, 247, 252, 0.5))'
          }}>
            <Row 
              gutter={[48, 48]} 
              style={{ 
                maxWidth: '1280px', 
                margin: '0 auto',
                alignItems: 'center',
              }}
            >
              {/* Left column - Content */}
              <Col xs={24} lg={12}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <Title level={2} style={{ fontSize: '30px', color: '#1B1D2A' }}>
                    Simplifiez vos interactions client
                  </Title>
                  <Paragraph style={{ fontSize: '16px', color: 'rgba(27, 29, 42, 0.7)' }}>
                    Notre plateforme intuitive vous permet de gérer toutes vos interactions client depuis un seul endroit.
                    Créez, déployez et analysez vos assistants conversationnels sans code.
                  </Paragraph>
                  <Space direction="vertical" size={16}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '9999px',
                        background: '#7745FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '4px',
                      }}>
                        <Check style={{ color: 'white', width: '12px', height: '12px' }} />
                      </div>
                      <Text style={{ color: 'rgba(27, 29, 42, 0.8)' }}>Analyses détaillées et rapports en temps réel</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '9999px',
                        background: '#7745FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '4px',
                      }}>
                        <Check style={{ color: 'white', width: '12px', height: '12px' }} />
                      </div>
                      <Text style={{ color: 'rgba(27, 29, 42, 0.8)' }}>Personnalisation complète des flux conversationnels</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '9999px',
                        background: '#7745FF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '4px',
                      }}>
                        <Check style={{ color: 'white', width: '12px', height: '12px' }} />
                      </div>
                      <Text style={{ color: 'rgba(27, 29, 42, 0.8)' }}>Intégration facile avec vos outils existants</Text>
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
                      background: 'rgba(255, 255, 255, 0.5)',
                      overflow: 'hidden',
                    }}
                    bordered={false}
                    bodyStyle={{ padding: 0 }}
                  >
                    <img 
                      src="/assets/conversation-flow.png" 
                      alt="Interface de flux conversationnel" 
                      style={{ width: '100%', borderRadius: '8px' }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Flow+Builder';
                      }}
                    />
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </div>

          {/* CTA Section - Full width row */}
          <div style={{ padding: '80px 24px' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              whileHover={{
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                transition: { duration: 0.3 }
              }}
            >
              <Card
                style={{
                  ...glassmorphismStyle,
                  background: 'rgba(255, 255, 255, 0.4)',
                  maxWidth: '1024px',
                  margin: '0 auto',
                  textAlign: 'center',
                  padding: '64px',
                  borderRadius: '24px',
                }}
                bordered={false}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Title level={2} style={{ color: '#1B1D2A', marginBottom: '24px' }}>
                    Prêt à transformer vos conversations clients?
                  </Title>
                  <Paragraph style={{ 
                    fontSize: '18px', 
                    color: 'rgba(27, 29, 42, 0.7)', 
                    marginBottom: '40px', 
                    maxWidth: '768px', 
                    margin: '0 auto 40px' 
                  }}>
                    Démarrez dès aujourd&apos;hui et découvrez comment AlloKoli peut améliorer votre expérience client tout en réduisant vos coûts opérationnels.
                  </Paragraph>
                  <Link href="/dashboard">
                    <Button 
                      type="primary" 
                      size="large"
                      style={{ 
                        height: '48px',
                        paddingLeft: '32px',
                        paddingRight: '32px',
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
        <Footer style={{ 
          padding: '48px 24px', 
          borderTop: '1px solid rgba(156, 184, 255, 0.2)', 
          background: 'rgba(247, 247, 252, 0.5)' 
        }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12} lg={6}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#7745FF',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Bot style={{ color: 'white', width: '20px', height: '20px' }} />
                  </div>
                  <Text strong style={{ fontSize: '18px', color: '#1B1D2A' }}>
                    AlloKoli
                  </Text>
                </div>
                <Paragraph style={{ color: 'rgba(27, 29, 42, 0.6)', marginBottom: '16px' }}>
                  Solutions conversationnelles IA pour toutes vos interactions client.
                </Paragraph>
              </Col>
              
              <Col xs={24} md={12} lg={6}>
                <Text strong style={{ color: '#1B1D2A', display: 'block', marginBottom: '16px' }}>Produit</Text>
                <Space direction="vertical" size={8}>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>Fonctionnalités</Link>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>Tarifs</Link>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>Témoignages</Link>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>Guide d&apos;utilisation</Link>
                </Space>
              </Col>
              
              <Col xs={24} md={12} lg={6}>
                <Text strong style={{ color: '#1B1D2A', display: 'block', marginBottom: '16px' }}>Société</Text>
                <Space direction="vertical" size={8}>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>À propos</Link>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>Blog</Link>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>Carrières</Link>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>Contact</Link>
                </Space>
              </Col>
              
              <Col xs={24} md={12} lg={6}>
                <Text strong style={{ color: '#1B1D2A', display: 'block', marginBottom: '16px' }}>Légal</Text>
                <Space direction="vertical" size={8}>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>Conditions d&apos;utilisation</Link>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>Politique de confidentialité</Link>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>CGU</Link>
                  <Link href="#" style={{ color: 'rgba(27, 29, 42, 0.6)', textDecoration: 'none' }}>RGPD</Link>
                </Space>
              </Col>
            </Row>
            
            <div style={{ 
              marginTop: '48px', 
              paddingTop: '32px', 
              borderTop: '1px solid rgba(156, 184, 255, 0.1)', 
              textAlign: 'center' 
            }}>
              <Text style={{ color: 'rgba(27, 29, 42, 0.5)' }}>
                © {new Date().getFullYear()} AlloKoli. Tous droits réservés.
              </Text>
            </div>
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
} 