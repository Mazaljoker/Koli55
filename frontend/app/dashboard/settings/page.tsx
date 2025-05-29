"use client";

import React from "react";
import {
  Typography,
  Card,
  Form,
  Input,
  Select,
  Divider,
  Switch,
  Alert,
  Space,
  Row,
  Col,
} from "antd";
import {
  SaveOutlined,
  UserOutlined,
  MailOutlined,
  BellOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";
import { Button } from "@/components/ui/Button";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

export default function SettingsPage() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form values:", values);
    // Ici, vous appelleriez votre API pour sauvegarder les paramètres
  };

  return (
    <div className="w-full">
      <Title level={2} className="!text-allokoli-text-primary !mb-6">
        Paramètres du Compte
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={16}>
          <Space direction="vertical" size="large" className="w-full">
            <Card
              title="Informations Personnelles"
              className="glassmorphism shadow-lg rounded-xl"
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                  name: "Utilisateur AlloKoli",
                  email: "user@example.com",
                  language: "fr",
                }}
              >
                <Form.Item
                  name="name"
                  label="Nom Complet"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez entrer votre nom complet",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Votre nom complet"
                  />
                </Form.Item>
                <Form.Item
                  name="email"
                  label="Adresse E-mail"
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Veuillez entrer une adresse e-mail valide",
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Votre adresse e-mail"
                  />
                </Form.Item>
                <Form.Item name="language" label="Langue Préférée">
                  <Select>
                    <Option value="fr">Français</Option>
                    <Option value="en">English</Option>
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                  >
                    Enregistrer les Informations
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Card
              title="Notifications"
              className="glassmorphism shadow-lg rounded-xl"
            >
              <Form layout="vertical">
                <Form.Item
                  label="Notifications par E-mail pour les appels importants"
                  valuePropName="checked"
                >
                  <Switch defaultChecked />
                </Form.Item>
                <Form.Item
                  label="Résumé hebdomadaire d'activité"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  label="Alertes de facturation"
                  valuePropName="checked"
                >
                  <Switch defaultChecked />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" icon={<SaveOutlined />}>
                    Enregistrer les Préférences de Notification
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Card
              title="Sécurité"
              className="glassmorphism shadow-lg rounded-xl"
            >
              <Form layout="vertical">
                <Form.Item label="Mot de passe actuel">
                  <Input.Password
                    prefix={<SecurityScanOutlined />}
                    placeholder="Mot de passe actuel"
                  />
                </Form.Item>
                <Form.Item label="Nouveau mot de passe">
                  <Input.Password
                    prefix={<SecurityScanOutlined />}
                    placeholder="Nouveau mot de passe"
                  />
                </Form.Item>
                <Form.Item label="Confirmer le nouveau mot de passe">
                  <Input.Password
                    prefix={<SecurityScanOutlined />}
                    placeholder="Confirmer le nouveau mot de passe"
                  />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" danger icon={<SaveOutlined />}>
                    Changer le mot de passe
                  </Button>
                </Form.Item>
                <Divider />
                <Form.Item
                  label="Authentification à deux facteurs (2FA)"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
                <Paragraph className="!text-allokoli-text-secondary !text-xs">
                  Protégez votre compte en ajoutant une couche de sécurité
                  supplémentaire.
                </Paragraph>
                <Button type="default" disabled>
                  Activer la 2FA (Bientôt disponible)
                </Button>
              </Form>
            </Card>
          </Space>
        </Col>
        <Col xs={24} md={8}>
          <Card
            title="Informations sur le Plan"
            className="glassmorphism shadow-lg rounded-xl"
          >
            <Title level={5}>
              Plan Actuel: <Text className="text-allokoli-primary">Pro</Text>
            </Title>
            <Paragraph className="!text-allokoli-text-secondary">
              Accès à toutes les fonctionnalités avancées, support prioritaire
              et plus de minutes d'appel.
            </Paragraph>
            <Button type="primary" block className="mt-4">
              Changer de Plan
            </Button>
            <Button type="link" block className="mt-2">
              Voir les détails de la facturation
            </Button>
          </Card>
          <Alert
            message="Maintenance Programmée"
            description="Une maintenance de nos serveurs est prévue le 30 Juillet de 02:00 à 04:00 UTC. Les services pourraient être temporairement perturbés."
            type="info"
            showIcon
            className="mt-6 glassmorphism"
          />
        </Col>
      </Row>
    </div>
  );
}
