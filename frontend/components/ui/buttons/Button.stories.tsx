import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Plus, Download, Settings } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "UI/Buttons/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Système de boutons unifié pour AlloKoli - Remplace tous les autres composants Button",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "destructive"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    loading: {
      control: "boolean",
    },
    disabled: {
      control: "boolean",
    },
    fullWidth: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic variants
export const Primary: Story = {
  args: {
    children: "Bouton principal",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Bouton secondaire",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Bouton outlined",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Bouton fantôme",
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    children: "Supprimer",
    variant: "destructive",
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: "Petit bouton",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    children: "Bouton moyen",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    children: "Grand bouton",
    size: "lg",
  },
};

// States
export const Loading: Story = {
  args: {
    children: "Chargement...",
    loading: true,
    loadingText: "Traitement en cours...",
  },
};

export const Disabled: Story = {
  args: {
    children: "Bouton désactivé",
    disabled: true,
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    children: "Ajouter",
    leftIcon: <Plus className="w-4 h-4" />,
  },
};

export const WithRightIcon: Story = {
  args: {
    children: "Télécharger",
    rightIcon: <Download className="w-4 h-4" />,
  },
};

export const IconOnly: Story = {
  args: {
    children: <Settings className="w-4 h-4" />,
    variant: "ghost",
    size: "sm",
  },
};

// Full width
export const FullWidth: Story = {
  args: {
    children: "Bouton pleine largeur",
    fullWidth: true,
  },
  parameters: {
    layout: "padded",
  },
};

// Async action example
export const AsyncAction: Story = {
  args: {
    children: "Action asynchrone",
    asyncAction: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Action terminée !");
    },
    loadingText: "Traitement...",
  },
};
