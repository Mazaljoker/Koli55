'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HomeOutlined,
  UserOutlined,
  BarChartOutlined,
  ApiOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  PlusOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { 
  Avatar, 
  Button, 
  Layout, 
  Tooltip, 
  Typography, 
  ConfigProvider,
  Space,
  Menu,
  theme
} from 'antd';

const { Title, Text } = Typography;
const { Sider, Header, Content } = Layout;

// Définition des tokens de couleur Ant Design
const customTheme = {
  token: {
    colorPrimary: '#7745FF', // Violet
    colorSecondary: '#5769FF', // Blue
    colorTertiary: '#9CB8FF', // Light blue
    colorBgContainer: '#F7F7FC', // Background
    colorBgElevated: '#F2F5FF', // Accent
    colorText: '#1B1D2A', // Text
  },
  components: {
    Layout: {
      colorBgHeader: 'rgba(255, 255, 255, 0.7)',
      bodyBg: 'transparent',
    },
    Menu: {
      colorItemBg: 'transparent',
      colorItemText: 'rgba(255, 255, 255, 0.85)',
      colorItemTextHover: '#ffffff',
      colorItemBgHover: 'rgba(255, 255, 255, 0.1)',
    },
  },
};

// Style glassmorphism réutilisable
const glassmorphismStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
};

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { token } = theme.useToken();

  // Navigation items pour la sidebar
  const navItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Accueil',
      href: '/dashboard'
    },
    {
      key: 'assistants',
      icon: <UserOutlined />,
      label: 'Assistants',
      href: '/dashboard/assistants'
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytique',
      href: '/dashboard/analytics'
    },
    {
      key: 'logs',
      icon: <FileTextOutlined />,
      label: 'Logs',
      href: '/dashboard/logs'
    },
    {
      key: 'api',
      icon: <ApiOutlined />,
      label: 'API',
      href: '/dashboard/api'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Paramètres',
      href: '/dashboard/settings'
    }
  ];

  const handleLogout = () => {
    // Logique de déconnexion à implémenter
    console.log('Déconnexion de l\'utilisateur');
  };

  return (
    <ConfigProvider theme={customTheme}>
      <Layout style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, rgba(237, 233, 254, 0.5), rgba(231, 238, 255, 0.5), rgba(243, 240, 255, 0.5))'
      }}>
        {/* Sidebar avec effet glassmorphism */}
        <Sider
          width={240}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          collapsedWidth={80}
          style={{
            ...glassmorphismStyle,
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 10,
            overflow: 'auto',
            height: '100vh',
          }}
        >
          {/* Logo de l'entreprise */}
          <div style={{ 
            padding: 16, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 64, 
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Space>
              <div style={{ 
                width: 40, 
                height: 40, 
                background: 'linear-gradient(to right, #7745FF, #5769FF)', 
                borderRadius: 8, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontWeight: 'bold', 
                fontSize: 18, 
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
              }}>
                AK
              </div>
              {!collapsed && (
                <Text strong style={{ color: 'white', fontSize: 18 }}>AlloKoli</Text>
              )}
            </Space>
          </div>

          {/* Navigation */}
          <Menu
            mode="inline"
            style={{ 
              background: 'transparent', 
              borderRight: 'none',
              padding: '24px 8px',
            }}
            items={navItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: (
                <Link href={item.href}>
                  {item.label}
                </Link>
              ),
            }))}
          />

          {/* Avatar utilisateur en bas */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <Space size={12}>
              <Avatar 
                size="large" 
                icon={<UserOutlined />} 
                style={{
                  background: 'linear-gradient(to right, #7745FF, #5769FF)',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
              />
              {!collapsed && (
                <Space direction="vertical" size={0}>
                  <Text style={{ color: 'white', fontWeight: 500 }}>Utilisateur</Text>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}>utilisateur@allokoli.com</Text>
                </Space>
              )}
            </Space>
          </div>
        </Sider>

        {/* Layout principal */}
        <Layout style={{ 
          marginLeft: collapsed ? 80 : 240,
          transition: 'all 0.3s'
        }}>
          {/* Navbar avec effet glassmorphism */}
          <Header style={{
            ...glassmorphismStyle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: 64,
            position: 'sticky',
            top: 0,
            zIndex: 10,
            borderTop: 'none',
            borderLeft: 'none', 
            borderRight: 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{ marginRight: 16, color: token.colorPrimary }}
              />
              <Title level={4} style={{ margin: 0, color: token.colorPrimary }}>
                Tableau de bord
              </Title>
            </div>
            
            <Space size={16}>
              {/* Bouton "Create Assistant" */}
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  background: 'linear-gradient(to right, #7745FF, #5769FF)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Link href="/assistants/new">Créer un Assistant</Link>
              </Button>
              
              <Tooltip title="Déconnexion">
                <Button 
                  type="text" 
                  icon={<LogoutOutlined />} 
                  onClick={handleLogout}
                  style={{ color: token.colorPrimary }}
                />
              </Tooltip>
            </Space>
          </Header>

          {/* Contenu principal */}
          <Content style={{ margin: 24 }}>
            <div style={{
              ...glassmorphismStyle,
              padding: 24,
              background: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 16,
            }}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
} 