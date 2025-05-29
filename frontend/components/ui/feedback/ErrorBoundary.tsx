"use client";

import React from "react";
import { Result, Typography } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { Button } from "@/components/ui/Button";

const { Paragraph, Text } = Typography;

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    // Vous pouvez également logger l'erreur vers un service externe ici
    console.error("Uncaught error:", error, errorInfo);
  }

  handleResetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    // Optionnel : forcer un rechargement ou une redirection si nécessaire
    // window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          icon={<WarningOutlined className="text-red-500" />}
          title="Une erreur inattendue est survenue"
          subTitle="Nous sommes désolés pour la gêne occasionnée. Veuillez réessayer ou contacter le support si le problème persiste."
          className="p-8 m-4 border border-red-200 rounded-lg glassmorphism dark:border-red-700"
          extra={[
            <Button type="primary" key="reload" onClick={this.handleResetError}>
              Réessayer
            </Button>,
            <Button key="support" href="mailto:support@allokoli.com">
              Contacter le Support
            </Button>,
          ]}
        >
          {process.env.NODE_ENV === "development" && this.state.error && (
            <div className="p-4 mt-6 overflow-auto rounded-md desc bg-red-50 dark:bg-red-900">
              <Paragraph strong className="!text-red-700 dark:!text-red-300">
                Détails de l'erreur (Mode Développement) :
              </Paragraph>
              <Text code className="block text-xs whitespace-pre-wrap">
                {this.state.error.toString()}
                {this.state.errorInfo &&
                  `\n\nComponent Stack:\n${this.state.errorInfo.componentStack}`}
              </Text>
            </div>
          )}
        </Result>
      );
    }

    return this.props.children;
  }
}
