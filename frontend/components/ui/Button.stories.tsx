import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Button } from "./Button";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Composant Button unifié basé sur Ant Design avec les variantes et tailles d'AlloKoli.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost"],
      description: "Style du bouton",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "small", "middle", "large"],
      description:
        "Taille du bouton (supporte les tailles Ant Design et personnalisées)",
    },
    isLoading: {
      control: "boolean",
      description: "État de chargement du bouton",
    },
    disabled: {
      control: "boolean",
      description: "État désactivé du bouton",
    },
    fullWidth: {
      control: "boolean",
      description: "Bouton pleine largeur",
    },
    iconPosition: {
      control: "select",
      options: ["left", "right"],
      description: "Position de l'icône",
    },
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stories de base pour chaque variante
export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Bouton Principal",
    onClick: fn(),
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Bouton Secondaire",
    onClick: fn(),
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Bouton Contour",
    onClick: fn(),
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Bouton Fantôme",
    onClick: fn(),
  },
};

// Stories pour les tailles
export const SmallSize: Story = {
  args: {
    variant: "primary",
    size: "sm",
    children: "Petit",
    onClick: fn(),
  },
};

export const MediumSize: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Moyen",
    onClick: fn(),
  },
};

export const LargeSize: Story = {
  args: {
    variant: "primary",
    size: "lg",
    children: "Grand",
    onClick: fn(),
  },
};

// Stories avec icônes
export const WithIcon: Story = {
  args: {
    variant: "primary",
    icon: <PlusOutlined />,
    children: "Ajouter",
    onClick: fn(),
  },
};

export const WithIconRight: Story = {
  args: {
    variant: "secondary",
    icon: <SaveOutlined />,
    iconPosition: "right",
    children: "Enregistrer",
    onClick: fn(),
  },
};

export const IconOnly: Story = {
  args: {
    variant: "outline",
    icon: <EditOutlined />,
    "aria-label": "Modifier",
    onClick: fn(),
  },
};

// Stories d'états
export const Loading: Story = {
  args: {
    variant: "primary",
    isLoading: true,
    children: "Chargement...",
    onClick: fn(),
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "Désactivé",
    onClick: fn(),
  },
};

export const FullWidth: Story = {
  args: {
    variant: "primary",
    fullWidth: true,
    children: "Bouton Pleine Largeur",
    onClick: fn(),
  },
  parameters: {
    layout: "padded",
  },
};

// Story démonstrative avec toutes les variantes
export const AllVariants: Story = {
  render: () => (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Toutes les variantes</h3>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" onClick={fn()}>
          Primary
        </Button>
        <Button variant="secondary" onClick={fn()}>
          Secondary
        </Button>
        <Button variant="outline" onClick={fn()}>
          Outline
        </Button>
        <Button variant="ghost" onClick={fn()}>
          Ghost
        </Button>
      </div>

      <h3 className="text-lg font-semibold">Toutes les tailles</h3>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" size="sm" onClick={fn()}>
          Small
        </Button>
        <Button variant="primary" size="md" onClick={fn()}>
          Medium
        </Button>
        <Button variant="primary" size="lg" onClick={fn()}>
          Large
        </Button>
      </div>

      <h3 className="text-lg font-semibold">États spéciaux</h3>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" isLoading onClick={fn()}>
          Loading
        </Button>
        <Button variant="primary" disabled onClick={fn()}>
          Disabled
        </Button>
        <Button variant="primary" icon={<PlusOutlined />} onClick={fn()}>
          With Icon
        </Button>
        <Button
          variant="outline"
          icon={<DeleteOutlined />}
          aria-label="Supprimer"
          onClick={fn()}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
