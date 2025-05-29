'use client';

import { useEffect } from 'react';
import { Typography, Row, Col, Card, Divider, Space, Avatar } from 'antd';
import { RocketOutlined, ThunderboltOutlined, BulbOutlined, StarOutlined } from '@ant-design/icons';
import { 
  TiltCard, 
  FloatingElement, 
  ParallaxContainer, 
  RotatingBadge, 
  AnimatedBackground, 
  AppearingElement,
  addMotionStyles
} from '../../../components/ui/3d-effects';
import { Button } from "@/components/ui/Button";

const { Title, Paragraph, Text } = Typography;

export default function EffectsDemo() {
  // Ajouter les styles CSS nécessaires pour les composants
  useEffect(() => {
    addMotionStyles();
  }, []);

  return (
    <div className="demo-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={1} style={{ textAlign: 'center', marginBottom: '12px' }}>
        Effets 3D pour AlloKoli
      </Title>
      
      <Paragraph style={{ textAlign: 'center', fontSize: '18px', marginBottom: '40px' }}>
        Démonstration des composants d&apos;animation et d&apos;effets 3D avec Framer Motion
      </Paragraph>
      
      <Divider orientation="left">Cartes avec effet tilt 3D</Divider>
      
      <Row gutter={[24, 24]}>
        {[
          {
            title: 'Intelligence Artificielle',
            icon: <BulbOutlined style={{ fontSize: '24px', color: '#7745FF' }} />,
            description: 'Exploitez les derniers modèles d\'IA pour créer des assistants intelligents.'
          },
          {
            title: 'Voix naturelle',
            icon: <ThunderboltOutlined style={{ fontSize: '24px', color: '#5769FF' }} />,
            description: 'Des voix synthétiques ultra-réalistes pour vos assistants.'
          },
          {
            title: 'Intégration simple',
            icon: <RocketOutlined style={{ fontSize: '24px', color: '#9CB8FF' }} />,
            description: 'Intégrez vos assistants facilement avec notre API.'
          }
        ].map((item, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <AppearingElement delay={index * 0.2}>
              <TiltCard
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                }
                hoverable
                tiltFactor={20}
                glareEffect={true}
              >
                <Paragraph>{item.description}</Paragraph>
                <Button variant="primary" shape="round">En savoir plus</Button>
              </TiltCard>
            </AppearingElement>
          </Col>
        ))}
      </Row>
      
      <Divider orientation="left" style={{ marginTop: '60px' }}>Éléments flottants</Divider>
      
      <div style={{ 
        height: '240px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        position: 'relative'
      }}>
        <FloatingElement amplitude={15} duration={3}>
          <Card style={{ width: '300px', textAlign: 'center' }}>
            <Avatar src="/images/avatar.jpg" size={80} style={{ marginBottom: '16px' }} />
            <Title level={4}>Sarah Martin</Title>
            <Text type="secondary">Directrice Marketing</Text>
            <Paragraph style={{ marginTop: '16px' }}>
              AlloKoli a transformé notre stratégie d&apos;assistance client. Nos clients sont ravis !
            </Paragraph>
          </Card>
        </FloatingElement>
        
        <FloatingElement amplitude={10} duration={4} delay={1} style={{ position: 'absolute', left: '20%', top: '30%' }}>
          <StarOutlined style={{ fontSize: '32px', color: '#7745FF' }} />
        </FloatingElement>
        
        <FloatingElement amplitude={12} duration={3.5} delay={0.5} style={{ position: 'absolute', right: '25%', bottom: '20%' }}>
          <StarOutlined style={{ fontSize: '24px', color: '#5769FF' }} />
        </FloatingElement>
      </div>
      
      <Divider orientation="left" style={{ marginTop: '60px' }}>Effet Parallax</Divider>
      
      <ParallaxContainer style={{ height: '400px', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(119, 69, 255, 0.1), rgba(87, 105, 255, 0.2))', 
          height: '100%', 
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} />
        
        <div style={{ position: 'absolute', top: '20%', left: '15%' }}>
          <Title level={2} style={{ color: '#7745FF' }}>Parallax</Title>
        </div>
        
        <div style={{ position: 'absolute', bottom: '25%', right: '10%' }}>
          <Title level={3} style={{ color: '#5769FF' }}>Effet de profondeur</Title>
        </div>
        
        <div style={{ position: 'absolute', top: '60%', left: '30%' }}>
          <Card>
            <Paragraph>
              L&apos;effet parallax crée une sensation de profondeur et d&apos;immersion.
            </Paragraph>
          </Card>
        </div>
      </ParallaxContainer>
      
      <Divider orientation="left" style={{ marginTop: '60px' }}>Badges rotatifs</Divider>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', padding: '40px 0' }}>
        <RotatingBadge count="NEW" color="#7745FF">
          <Card style={{ width: '180px', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Title level={4}>Fonction 1</Title>
          </Card>
        </RotatingBadge>
        
        <RotatingBadge count="HOT" color="#ff4d4f" duration={10}>
          <Card style={{ width: '180px', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Title level={4}>Fonction 2</Title>
          </Card>
        </RotatingBadge>
        
        <RotatingBadge count="50%" color="#52c41a" duration={15}>
          <Card style={{ width: '180px', height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Title level={4}>Fonction 3</Title>
          </Card>
        </RotatingBadge>
      </div>
      
      <Divider orientation="left" style={{ marginTop: '60px' }}>Arrière-plan animé</Divider>
      
      <AnimatedBackground 
        speed={10} 
        color1="rgba(119, 69, 255, 0.05)" 
        color2="rgba(87, 105, 255, 0.15)"
        style={{ padding: '60px', borderRadius: '16px' }}
      >
        <div style={{ textAlign: 'center' }}>
          <Title level={2}>Gradient animé</Title>
          <Paragraph style={{ fontSize: '18px' }}>
            Ce gradient d&apos;arrière-plan change lentement pour créer un effet vivant et dynamique.
          </Paragraph>
          <Space>
            <Button variant="primary" size="large">Action principale</Button>
            <Button size="large">Action secondaire</Button>
          </Space>
        </div>
      </AnimatedBackground>
      
      <Divider orientation="left" style={{ marginTop: '60px' }}>Éléments apparaissant au scroll</Divider>
      
      <Row gutter={[24, 24]}>
        {['up', 'down', 'left', 'right'].map((direction, index) => (
          <Col xs={24} sm={12} key={index}>
            <AppearingElement 
              direction={direction as 'up' | 'down' | 'left' | 'right'} 
              distance={100}
              delay={index * 0.1}
              once={false}
            >
              <Card title={`Animation depuis ${direction}`}>
                <Paragraph>
                  Cet élément apparaît avec une animation lorsqu&apos;il entre dans la vue.
                  Essayez de défiler pour voir l&apos;effet se reproduire.
                </Paragraph>
              </Card>
            </AppearingElement>
          </Col>
        ))}
      </Row>
      
      <div style={{ height: '100px' }} />
    </div>
  );
} 