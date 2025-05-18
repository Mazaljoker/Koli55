'use client';

import React from 'react';
import { Typography, Divider, Card } from 'antd';
import MultiStepFormExample from './multi-step-form-example';

const { Title, Paragraph, Text } = Typography;

const MultiStepFormDemoPage: React.FC = () => {
  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Title>Formulaire multi-étapes avec validation</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Paragraph>
          Ce composant met en œuvre un formulaire multi-étapes (wizard pattern) construit avec Ant Design et React.
          Il offre les fonctionnalités suivantes :
        </Paragraph>
        
        <ul>
          <li>
            <Text strong>Interface à étapes visuelles</Text> - Navigation claire entre les différentes étapes du formulaire
          </li>
          <li>
            <Text strong>Validation à chaque étape</Text> - Les utilisateurs ne peuvent passer à l&apos;étape suivante qu&apos;après avoir complété correctement l&apos;étape actuelle
          </li>
          <li>
            <Text strong>Conservation des données</Text> - Les données saisies sont conservées lorsque l&apos;utilisateur navigue entre les étapes
          </li>
          <li>
            <Text strong>Validations personnalisées</Text> - Possibilité d&apos;ajouter des validations spécifiques à chaque étape
          </li>
          <li>
            <Text strong>Entièrement configurable</Text> - Le composant peut être adapté à différents cas d&apos;utilisation
          </li>
        </ul>
      </Card>
      
      <Divider orientation="left">Exemple d&apos;implémentation</Divider>
      
      <Card style={{ marginBottom: 24 }}>
        <Paragraph>
          L&apos;exemple ci-dessous montre un formulaire d&apos;inscription en quatre étapes :
        </Paragraph>
        
        <ol>
          <li><Text strong>Informations personnelles</Text> - Collecte des informations de base de l&apos;utilisateur</li>
          <li><Text strong>Adresse</Text> - Collecte des informations d&apos;adresse</li>
          <li><Text strong>Préférences</Text> - Personnalisation des préférences utilisateur</li>
          <li><Text strong>Commentaires</Text> - Feedback et finalisation de l&apos;inscription</li>
        </ol>
        
        <Paragraph>
          Essayez de naviguer à travers les étapes pour voir comment fonctionne la validation à chaque étape.
        </Paragraph>
      </Card>
      
      <MultiStepFormExample />
      
      <Divider orientation="left">Comment utiliser ce composant</Divider>
      
      <Card>
        <Paragraph>
          Pour utiliser ce composant dans votre propre projet :
        </Paragraph>
        
        <ol>
          <li>Importez le composant <Text code>MultiStepForm</Text> dans votre fichier</li>
          <li>Définissez les étapes de votre formulaire avec leur contenu et schémas de validation</li>
          <li>Configurez les valeurs initiales et la fonction de soumission</li>
          <li>Personnalisez l&apos;apparence selon vos besoins</li>
        </ol>
        
        <Paragraph>
          Consultez la documentation pour plus de détails sur les options de configuration disponibles.
        </Paragraph>
      </Card>
    </div>
  );
};

export default MultiStepFormDemoPage; 