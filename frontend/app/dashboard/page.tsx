'use client';

import Link from 'next/link';
import { Button, Table, Tag, Typography, Row, Col, Card, Space, Checkbox, ConfigProvider } from 'antd';
import { 
  PlusCircle, 
  Phone, 
  MessageSquare, 
  Database, 
  ChevronRight,
  Sparkles,
  Play
} from 'lucide-react';

const { Title, Text, Paragraph } = Typography;

// Personnalisation du thème
const theme = {
  token: {
    colorPrimary: '#7745FF',
    colorSuccess: '#52c41a',
    colorError: '#FF6B6B',
    colorInfo: '#3ABFF8',
    colorWarning: '#faad14',
    colorTextBase: '#22223B',
    colorBgBase: '#ffffff',
    colorBorder: '#F0EDFF',
    borderRadius: 8,
  },
};

export default function DashboardPage() {
  // Données fictives pour les assistants
  const assistants = [
    { id: '1', name: 'Assistant Service Client', model: 'gpt-4o', status: 'active', lastActive: '1h' },
    { id: '2', name: 'Support Technique', model: 'claude-3-opus', status: 'inactive', lastActive: '1j' },
    { id: '3', name: 'Agent Commercial', model: 'gpt-4o', status: 'draft', lastActive: '3j' },
  ];

  type Assistant = {
    id: string;
    name: string;
    model: string;
    status: string;
    lastActive: string;
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Assistant) => (
        <Link href={`/dashboard/assistants/${record.id}`} style={{ color: '#22223B' }}>
          {text}
        </Link>
      ),
    },
    {
      title: 'Modèle',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = '#4F3FF0';
        
        if (status === 'inactive') {
          color = '#FF6B6B';
        } else if (status === 'draft') {
          color = '#3ABFF8';
        }
        
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Dernière activité',
      dataIndex: 'lastActive',
      key: 'lastActive',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: function ActionsCell() {
        return (
          <Space>
            <Button type="text" style={{ color: '#4F3FF0' }}>
              Gérer
            </Button>
            <Button type="text" style={{ color: '#4F3FF0' }}>
              Simuler
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <ConfigProvider theme={theme}>
      <Space direction="vertical" size={32} style={{ width: '100%' }}>
        {/* Titre du Dashboard */}
        <div>
          <Title level={3} style={{ color: '#22223B', margin: 0 }}>Tableau de bord</Title>
          <Text type="secondary" style={{ color: '#8586A5' }}>Bienvenue sur votre tableau de bord AlloKoli</Text>
        </div>
        
        {/* Grid Layout principal */}
        <Row gutter={[24, 24]}>
          {/* Partie gauche (2/3 sur desktop) */}
          <Col xs={24} lg={16}>
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              {/* Wizard Card - Carte principale avec fond glassmorphism */}
              <Card
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(182, 163, 255, 0.25)',
                  borderRadius: 16,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom right, #8F6FFF, #4F3FF0)',
                  opacity: 0.05,
                  zIndex: 0,
                }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <Space align="center" style={{ marginBottom: 16 }}>
                    <Sparkles style={{ color: '#8F6FFF' }} size={20} />
                    <Title level={4} style={{ margin: 0 }}>Assistant Wizard</Title>
                  </Space>
                  
                  <Paragraph style={{ color: '#8586A5', marginBottom: 24 }}>
                    Configurez rapidement un nouvel assistant pour votre équipe
                  </Paragraph>
                  
                  <Card
                    style={{
                      marginBottom: 24,
                      background: '#ffffff',
                      border: '1px solid #F0EDFF',
                    }}
                  >
                    <Title level={5} style={{ marginBottom: 8 }}>1. Sélectionnez un modèle</Title>
                    <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                      <Col span={12}>
                        <Button
                          style={{
                            width: '100%',
                            height: 'auto',
                            padding: 12,
                            border: '1px solid #B6A3FF',
                            borderRadius: 8,
                            color: '#4F3FF0',
                            background: '#F7F8FF',
                          }}
                        >
                          Service Client
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          style={{
                            width: '100%',
                            height: 'auto',
                            padding: 12,
                            border: '1px solid #B6A3FF',
                            borderRadius: 8,
                            color: '#4F3FF0',
                            background: '#F7F8FF',
                          }}
                        >
                          Commercial
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          style={{
                            width: '100%',
                            height: 'auto',
                            padding: 12,
                            border: '1px solid #B6A3FF',
                            borderRadius: 8,
                            color: '#4F3FF0',
                            background: '#F7F8FF',
                          }}
                        >
                          Support Technique
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          style={{
                            width: '100%',
                            height: 'auto',
                            padding: 12,
                            border: '1px solid #B6A3FF',
                            borderRadius: 8,
                            color: '#4F3FF0',
                            background: '#F7F8FF',
                          }}
                        >
                          Assistant Personnel
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                  
                  <Card
                    style={{
                      background: '#ffffff',
                      border: '1px solid #F0EDFF',
                    }}
                  >
                    <Title level={5} style={{ marginBottom: 8 }}>2. Personnalisez vos capacités</Title>
                    <Space direction="vertical" size={16} style={{ width: '100%', marginTop: 12 }}>
                      <Card size="small" bordered style={{ border: '1px solid #F0EDFF', borderRadius: 8 }}>
                        <Space>
                          <div style={{
                            height: 40,
                            width: 40,
                            borderRadius: '50%',
                            background: '#F0EDFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <MessageSquare size={16} style={{ color: '#8F6FFF' }} />
                          </div>
                          <div>
                            <Text strong style={{ display: 'block' }}>Réponses personnalisées</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>Adaptez le ton et le style</Text>
                          </div>
                          <Checkbox defaultChecked style={{ marginLeft: 'auto' }} />
                        </Space>
                      </Card>
                      
                      <Card size="small" bordered style={{ border: '1px solid #F0EDFF', borderRadius: 8 }}>
                        <Space>
                          <div style={{
                            height: 40,
                            width: 40,
                            borderRadius: '50%',
                            background: '#F0EDFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Database size={16} style={{ color: '#8F6FFF' }} />
                          </div>
                          <div>
                            <Text strong style={{ display: 'block' }}>Base de connaissances</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>Connectez vos données</Text>
                          </div>
                          <Checkbox style={{ marginLeft: 'auto' }} />
                        </Space>
                      </Card>
                      
                      <Card size="small" bordered style={{ border: '1px solid #F0EDFF', borderRadius: 8 }}>
                        <Space>
                          <div style={{
                            height: 40,
                            width: 40,
                            borderRadius: '50%',
                            background: '#F0EDFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Phone size={16} style={{ color: '#8F6FFF' }} />
                          </div>
                          <div>
                            <Text strong style={{ display: 'block' }}>Intégration téléphonique</Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>Gérez les appels entrants</Text>
                          </div>
                          <Checkbox style={{ marginLeft: 'auto' }} />
                        </Space>
                      </Card>
                    </Space>
                  </Card>
                  
                  <Button
                    type="primary"
                    style={{
                      marginTop: 24,
                      height: 40,
                      background: 'linear-gradient(to right, #8F6FFF, #4F3FF0)',
                      border: 'none',
                      boxShadow: '0 2px 8px rgba(79, 63, 240, 0.2)',
                    }}
                  >
                    Créer mon assistant
                  </Button>
                </div>
              </Card>
              
              {/* Section des assistants existants */}
              <Card
                title="Mes assistants"
                extra={<Button type="primary" icon={<PlusCircle size={14} />}>Nouvel assistant</Button>}
                style={{
                  borderRadius: 16,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Table 
                  dataSource={assistants} 
                  columns={columns} 
                  rowKey="id"
                  pagination={false}
                />
              </Card>
            </Space>
          </Col>
          
          {/* Partie droite (1/3 sur desktop) */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              {/* Assistant Summary Card */}
              <Card
                style={{
                  borderRadius: 16,
                  border: '1px solid #B6A3FF',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Title level={4} style={{ marginBottom: 12 }}>Vue d&apos;ensemble</Title>
                
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={12}>
                    <Card
                      style={{
                        background: '#F7F8FF',
                        textAlign: 'center',
                        borderRadius: 8,
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 12 }}>Assistants</Text>
                      <Title level={2} style={{ color: '#4F3FF0', margin: '4px 0' }}>3</Title>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card
                      style={{
                        background: '#F7F8FF',
                        textAlign: 'center',
                        borderRadius: 8,
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 12 }}>Appels ce mois</Text>
                      <Title level={2} style={{ color: '#4F3FF0', margin: '4px 0' }}>147</Title>
                    </Card>
                  </Col>
                </Row>
                
                <div style={{ marginBottom: 16 }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text type="secondary">Utilisation</Text>
                    </Col>
                    <Col>
                      <Text>32% <Text type="success">↑4%</Text></Text>
                    </Col>
                  </Row>
                  <div
                    style={{
                      height: 8,
                      background: '#F0EDFF',
                      borderRadius: 8,
                      marginTop: 8,
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: '32%',
                        background: 'linear-gradient(to right, #8F6FFF, #4F3FF0)',
                        borderRadius: 8,
                      }}
                    ></div>
                  </div>
                </div>
                
                <Link href="/dashboard/usage-billing" style={{ color: '#4F3FF0', display: 'flex', alignItems: 'center' }}>
                  Voir les statistiques <ChevronRight size={16} style={{ marginLeft: 4 }} />
                </Link>
              </Card>
              
              {/* AI Suggestion Bubble */}
              <Card
                style={{
                  background: 'linear-gradient(to right, #8F6FFF, #4F3FF0)',
                  borderRadius: 16,
                  color: 'white',
                  border: 'none',
                }}
                bodyStyle={{ padding: 20 }}
              >
                <Space style={{ marginBottom: 12 }}>
                  <div style={{
                    height: 32,
                    width: 32,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Sparkles size={16} style={{ color: 'white' }} />
                  </div>
                  <Text strong style={{ color: 'white' }}>Suggestion IA</Text>
                </Space>
                <Paragraph style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 16 }}>
                  Améliorez votre taux de réponse en ajoutant une base de connaissances à vos assistants.
                </Paragraph>
                <Button
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: 'none',
                  }}
                >
                  Essayer maintenant
                </Button>
              </Card>
              
              {/* Recent activities */}
              <Card
                title="Activités récentes"
                style={{
                  borderRadius: 16,
                  border: '1px solid #B6A3FF',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <Card 
                    size="small"
                    style={{ 
                      borderRadius: 8, 
                      border: '1px solid #F0EDFF',
                    }}
                  >
                    <Space>
                      <div style={{
                        height: 40,
                        width: 40,
                        borderRadius: '50%',
                        background: '#F0EDFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Phone size={16} style={{ color: '#8F6FFF' }} />
                      </div>
                      <div>
                        <Text strong style={{ display: 'block' }}>Appel entrant</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>Il y a 23 minutes</Text>
                      </div>
                    </Space>
                  </Card>
                  
                  <Card 
                    size="small"
                    style={{ 
                      borderRadius: 8, 
                      border: '1px solid #F0EDFF',
                    }}
                  >
                    <Space>
                      <div style={{
                        height: 40,
                        width: 40,
                        borderRadius: '50%',
                        background: '#F0EDFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Play size={16} style={{ color: '#8F6FFF' }} />
                      </div>
                      <div>
                        <Text strong style={{ display: 'block' }}>Assistant créé</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>Hier, 14:30</Text>
                      </div>
                    </Space>
                  </Card>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>
      </Space>
    </ConfigProvider>
  );
} 