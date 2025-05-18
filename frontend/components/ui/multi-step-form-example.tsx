'use client';

import React from 'react';
import { Form, Input, Select, DatePicker, InputNumber, Radio, Checkbox, Typography } from 'antd';
import MultiStepForm from './multi-step-form';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const MultiStepFormExample: React.FC = () => {
  const handleFinish = (values: Record<string, unknown>) => {
    console.log('Formulaire soumis:', values);
    // Ici vous pourriez envoyer les données à une API
    alert('Formulaire soumis avec succès! Consultez la console pour voir les données.');
  };

  // Configuration des étapes du formulaire
  const steps = [
    {
      title: 'Informations personnelles',
      content: (
        <div>
          <Title level={4}>Vos informations personnelles</Title>
          <Text type="secondary">Veuillez entrer vos informations personnelles</Text>
          
          <Form.Item 
            name="name" 
            label="Nom complet" 
            rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}
          >
            <Input placeholder="Entrez votre nom complet" />
          </Form.Item>
          
          <Form.Item 
            name="email" 
            label="Email" 
            rules={[
              { required: true, message: 'Veuillez entrer votre email' },
              { type: 'email', message: 'Email invalide' }
            ]}
          >
            <Input placeholder="Entrez votre email" />
          </Form.Item>
          
          <Form.Item 
            name="birthdate" 
            label="Date de naissance"
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          
          <Form.Item 
            name="gender" 
            label="Genre"
          >
            <Radio.Group>
              <Radio value="male">Homme</Radio>
              <Radio value="female">Femme</Radio>
              <Radio value="other">Autre</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      ),
      validationSchema: {
        required: ['name', 'email'],
        validator: (values: Record<string, unknown>) => {
          if (values.email && !String(values.email).includes('@')) {
            return { error: true, message: 'Veuillez entrer un email valide avec @' };
          }
          return { error: false };
        }
      }
    },
    {
      title: 'Adresse',
      content: (
        <div>
          <Title level={4}>Votre adresse</Title>
          <Text type="secondary">Veuillez entrer votre adresse complète</Text>
          
          <Form.Item 
            name="address" 
            label="Adresse"
            rules={[{ required: true, message: 'Veuillez entrer votre adresse' }]}
          >
            <Input placeholder="Numéro et rue" />
          </Form.Item>
          
          <Form.Item 
            name="city" 
            label="Ville"
            rules={[{ required: true, message: 'Veuillez entrer votre ville' }]}
          >
            <Input placeholder="Ville" />
          </Form.Item>
          
          <Form.Item 
            name="zipCode" 
            label="Code postal"
            rules={[{ required: true, message: 'Veuillez entrer votre code postal' }]}
          >
            <Input placeholder="Code postal" />
          </Form.Item>
          
          <Form.Item 
            name="country" 
            label="Pays"
            rules={[{ required: true, message: 'Veuillez sélectionner votre pays' }]}
          >
            <Select placeholder="Sélectionnez votre pays">
              <Option value="france">France</Option>
              <Option value="canada">Canada</Option>
              <Option value="belgique">Belgique</Option>
              <Option value="suisse">Suisse</Option>
            </Select>
          </Form.Item>
        </div>
      ),
      validationSchema: {
        required: ['address', 'city', 'zipCode', 'country']
      }
    },
    {
      title: 'Préférences',
      content: (
        <div>
          <Title level={4}>Vos préférences</Title>
          <Text type="secondary">Personnalisez vos préférences</Text>
          
          <Form.Item 
            name="interests" 
            label="Centres d'intérêt"
            rules={[{ required: true, message: 'Veuillez sélectionner au moins un centre d\'intérêt' }]}
          >
            <Checkbox.Group 
              options={[
                { label: 'Technologie', value: 'tech' },
                { label: 'Sport', value: 'sport' },
                { label: 'Musique', value: 'music' },
                { label: 'Cinéma', value: 'cinema' },
                { label: 'Voyage', value: 'travel' }
              ]} 
            />
          </Form.Item>
          
          <Form.Item 
            name="notifications" 
            label="Préférences de notification"
            rules={[{ required: true, message: 'Veuillez sélectionner vos préférences de notification' }]}
          >
            <Radio.Group>
              <Radio value="all">Toutes les notifications</Radio>
              <Radio value="important">Notifications importantes uniquement</Radio>
              <Radio value="none">Aucune notification</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item 
            name="contactFrequency" 
            label="Fréquence de contact"
          >
            <Radio.Group>
              <Radio value="daily">Quotidienne</Radio>
              <Radio value="weekly">Hebdomadaire</Radio>
              <Radio value="monthly">Mensuelle</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      ),
      validationSchema: {
        required: ['interests', 'notifications']
      }
    },
    {
      title: 'Commentaires',
      content: (
        <div>
          <Title level={4}>Vos commentaires</Title>
          <Text type="secondary">Partagez vos commentaires ou questions</Text>
          
          <Form.Item 
            name="feedback" 
            label="Commentaires ou questions"
          >
            <TextArea rows={4} placeholder="Entrez vos commentaires ou questions (optionnel)" />
          </Form.Item>
          
          <Form.Item 
            name="rating" 
            label="Évaluez votre expérience (1-10)"
          >
            <InputNumber min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item 
            name="agreement" 
            valuePropName="checked"
            rules={[
              { 
                validator: (_, value) => 
                  value ? Promise.resolve() : Promise.reject(new Error('Vous devez accepter les conditions')) 
              }
            ]}
          >
            <Checkbox>
              J&apos;accepte les <a href="#">termes et conditions</a>
            </Checkbox>
          </Form.Item>
        </div>
      ),
      validationSchema: {
        validator: (values: Record<string, unknown>) => {
          if (!values.agreement) {
            return { error: true, message: 'Vous devez accepter les termes et conditions pour continuer' };
          }
          return { error: false };
        }
      }
    }
  ];

  const initialValues = {
    birthdate: dayjs().subtract(18, 'year'),
    contactFrequency: 'weekly',
    notifications: 'important'
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={2}>Exemple de formulaire multi-étapes</Title>
      <Text style={{ display: 'block', marginBottom: 20 }}>
        Ce formulaire démontre l&apos;utilisation du composant MultiStepForm avec des validations à chaque étape.
      </Text>
      
      <MultiStepForm
        steps={steps}
        initialValues={initialValues}
        onFinish={handleFinish}
        finishButtonText="Soumettre"
        nextButtonText="Suivant"
        prevButtonText="Précédent"
      />
    </div>
  );
};

export default MultiStepFormExample; 