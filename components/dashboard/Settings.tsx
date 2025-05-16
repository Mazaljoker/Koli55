'use client';

import React from 'react';
import { Title, Card } from '@tremor/react';

const Settings = () => {
  return (
    <Card className="mt-6">
      <Title>Paramètres</Title>
      <p className="mt-2 text-tremor-content">
        Ici, vous pourrez configurer les paramètres de votre compte et de l'application. Cette fonctionnalité est en cours de développement.
      </p>
      {/* TODO: Implémenter les différents formulaires de paramètres (profil, organisation, etc.) */}
    </Card>
  );
};

export default Settings; 