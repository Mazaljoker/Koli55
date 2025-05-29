import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { Button } from "../Button";

// Mock Ant Design pour éviter les erreurs de rendu
jest.mock("antd", () => ({
  Button: ({ children, loading, icon, ...props }: any) => (
    <button {...props} data-loading={loading}>
      {loading && <span data-testid="loading-spinner">Loading...</span>}
      {icon && <span data-testid="button-icon">{icon}</span>}
      {children}
    </button>
  ),
}));

describe("Button Component", () => {
  const defaultProps = {
    children: "Test Button",
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendu de base", () => {
    it("rend correctement avec le texte par défaut", () => {
      render(<Button {...defaultProps} />);
      expect(screen.getByText("Test Button")).toBeInTheDocument();
    });

    it("rend avec la variante primary par défaut", () => {
      render(<Button {...defaultProps} />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Variantes", () => {
    it("rend avec la variante primary", () => {
      render(<Button {...defaultProps} variant="primary" />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("rend avec la variante secondary", () => {
      render(<Button {...defaultProps} variant="secondary" />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("rend avec la variante outline", () => {
      render(<Button {...defaultProps} variant="outline" />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("rend avec la variante ghost", () => {
      render(<Button {...defaultProps} variant="ghost" />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("Tailles", () => {
    it("rend avec la taille sm", () => {
      render(<Button {...defaultProps} size="sm" />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("rend avec la taille md", () => {
      render(<Button {...defaultProps} size="md" />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("rend avec la taille lg", () => {
      render(<Button {...defaultProps} size="lg" />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    // Support des tailles Ant Design
    it("rend avec la taille small (Ant Design)", () => {
      render(<Button {...defaultProps} size="small" />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("rend avec la taille middle (Ant Design)", () => {
      render(<Button {...defaultProps} size="middle" />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("rend avec la taille large (Ant Design)", () => {
      render(<Button {...defaultProps} size="large" />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });
  });

  describe("État isLoading", () => {
    it("affiche le spinner quand isLoading est true", () => {
      render(<Button {...defaultProps} isLoading={true} />);

      // Rechercher l'icône de spinner par sa classe
      const spinner = screen.getByRole("button").querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("n'affiche pas le spinner quand isLoading est false", () => {
      render(<Button {...defaultProps} isLoading={false} />);

      const spinner = screen.getByRole("button").querySelector(".animate-spin");
      expect(spinner).not.toBeInTheDocument();
    });

    it("désactive le bouton quand isLoading est true", () => {
      render(<Button {...defaultProps} isLoading={true} />);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  describe("État désactivé", () => {
    it("rend le bouton désactivé", () => {
      render(<Button {...defaultProps} disabled />);

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });
  });

  describe("Icônes", () => {
    it("rend avec une icône", () => {
      render(<Button {...defaultProps} icon={<PlusOutlined />} />);

      // Rechercher l'icône Ant Design par son rôle
      const icon = screen.getByRole("img", { name: /plus/i });
      expect(icon).toBeInTheDocument();
    });

    it("rend sans texte (icon-only)", () => {
      render(
        <Button
          icon={<EditOutlined />}
          aria-label="Modifier"
          onClick={defaultProps.onClick}
        />
      );

      const icon = screen.getByRole("img", { name: /edit/i });
      expect(icon).toBeInTheDocument();

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Modifier");
    });
  });

  describe("Largeur complète", () => {
    it("rend avec fullWidth", () => {
      render(<Button {...defaultProps} fullWidth />);

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      // Vérifie que la classe w-full est présente
      expect(button).toHaveClass("w-full");
    });
  });

  describe("Interactions", () => {
    it("appelle onClick quand cliqué", async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();

      render(<Button onClick={mockClick}>Click me</Button>);

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it("n'appelle pas onClick quand désactivé", async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();

      render(
        <Button onClick={mockClick} disabled>
          Click me
        </Button>
      );

      const button = screen.getByRole("button");
      await user.click(button);

      expect(mockClick).not.toHaveBeenCalled();
    });

    it("désactive les interactions quand en état de chargement", async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();

      render(
        <Button onClick={mockClick} isLoading>
          Click me
        </Button>
      );

      const button = screen.getByRole("button");
      expect(button).toBeDisabled();

      await user.click(button);
      expect(mockClick).not.toHaveBeenCalled();
    });
  });

  describe("Accessibilité", () => {
    it("rend avec aria-label pour les boutons icon-only", () => {
      render(
        <Button
          icon={<EditOutlined />}
          aria-label="Modifier"
          onClick={defaultProps.onClick}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Modifier");
    });

    it("supporte les attributs aria personnalisés", () => {
      render(<Button {...defaultProps} aria-describedby="description" />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-describedby", "description");
    });
  });

  describe("Props forwarding", () => {
    it("transmet les props HTML standard", () => {
      render(<Button {...defaultProps} data-testid="custom-button" />);

      const button = screen.getByTestId("custom-button");
      expect(button).toBeInTheDocument();
    });

    it("transmet les props de classe CSS", () => {
      render(<Button {...defaultProps} className="custom-class" />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });
  });

  describe("Mapping des tailles Ant Design", () => {
    it("mappe correctement les tailles Ant Design vers les tailles personnalisées", () => {
      const { rerender } = render(<Button size="small">Small</Button>);
      let button = screen.getByRole("button");
      expect(button).toHaveClass("h-8"); // taille sm

      rerender(<Button size="middle">Medium</Button>);
      button = screen.getByRole("button");
      expect(button).toHaveClass("h-10"); // taille md

      rerender(<Button size="large">Large</Button>);
      button = screen.getByRole("button");
      expect(button).toHaveClass("h-12"); // taille lg
    });
  });
});
