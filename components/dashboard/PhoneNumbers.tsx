'use client';

import React from 'react';
import { Title, Card } from '@tremor/react';

const PhoneNumbers = () => {
  return (
    <Card className="mt-6">
      <Title>Gestion des Numéros de Téléphone</Title>
      <p className="mt-2 text-tremor-content">
        Ici, vous pourrez gérer vos numéros de téléphone. Cette fonctionnalité est en cours de développement.
      </p>
      {/* TODO: Implémenter la liste des numéros, provisionnement, etc. */}
    </Card>
  );
};

export default PhoneNumbers; 