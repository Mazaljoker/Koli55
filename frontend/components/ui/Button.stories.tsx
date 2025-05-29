import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
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
    onClick: action("primary-clicked"),
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Bouton Secondaire",
    onClick: action("secondary-clicked"),
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Bouton Contour",
    onClick: action("outline-clicked"),
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Bouton Fantôme",
    onClick: action("ghost-clicked"),
  },
};

// Stories pour les tailles
export const SmallSize: Story = {
  args: {
    variant: "primary",
    size: "sm",
    children: "Petit",
    onClick: action("small-clicked"),
  },
};

export const MediumSize: Story = {
  args: {
    variant: "primary",
    size: "md",
    children: "Moyen",
    onClick: action("medium-clicked"),
  },
};

export const LargeSize: Story = {
  args: {
    variant: "primary",
    size: "lg",
    children: "Grand",
    onClick: action("large-clicked"),
  },
};

// Stories avec icônes
export const WithIcon: Story = {
  args: {
    variant: "primary",
    icon: <PlusOutlined />,
    children: "Ajouter",
    onClick: action("with-icon-clicked"),
  },
};

export const WithIconRight: Story = {
  args: {
    variant: "secondary",
    icon: <SaveOutlined />,
    iconPosition: "right",
    children: "Enregistrer",
    onClick: action("with-icon-right-clicked"),
  },
};

export const IconOnly: Story = {
  args: {
    variant: "outline",
    icon: <EditOutlined />,
    "aria-label": "Modifier",
    onClick: action("icon-only-clicked"),
  },
};

// Stories d'états
export const Loading: Story = {
  args: {
    variant: "primary",
    isLoading: true,
    children: "Chargement...",
    onClick: action("loading-clicked"),
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
    children: "Désactivé",
    onClick: action("disabled-clicked"),
  },
};

export const FullWidth: Story = {
  args: {
    variant: "primary",
    fullWidth: true,
    children: "Bouton Pleine Largeur",
    onClick: action("full-width-clicked"),
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
        <Button variant="primary" onClick={action("primary")}>
          Primary
        </Button>
        <Button variant="secondary" onClick={action("secondary")}>
          Secondary
        </Button>
        <Button variant="outline" onClick={action("outline")}>
          Outline
        </Button>
        <Button variant="ghost" onClick={action("ghost")}>
          Ghost
        </Button>
      </div>

      <h3 className="text-lg font-semibold">Toutes les tailles</h3>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" size="sm" onClick={action("small")}>
          Small
        </Button>
        <Button variant="primary" size="md" onClick={action("medium")}>
          Medium
        </Button>
        <Button variant="primary" size="lg" onClick={action("large")}>
          Large
        </Button>
      </div>

      <h3 className="text-lg font-semibold">États spéciaux</h3>
      <div className="flex flex-wrap gap-4">
        <Button variant="primary" isLoading onClick={action("loading")}>
          Loading
        </Button>
        <Button variant="primary" disabled onClick={action("disabled")}>
          Disabled
        </Button>
        <Button
          variant="primary"
          icon={<PlusOutlined />}
          onClick={action("with-icon")}
        >
          With Icon
        </Button>
        <Button
          variant="outline"
          icon={<DeleteOutlined />}
          aria-label="Supprimer"
          onClick={action("icon-only")}
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
  },
};
