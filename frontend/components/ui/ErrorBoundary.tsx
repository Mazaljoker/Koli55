'use client';

import React, { Component, ReactNode } from 'react';
import { Result, Typography, Space, Card } from 'antd';
import { ReloadOutlined, HomeOutlined, BugOutlined } from '@ant-design/icons';
import { isDevelopment } from '@/lib/config/env';
import { Button } from "@/components/ui/Button";

const { Paragraph, Text } = Typography;

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log de l'erreur
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Callback personnalisé si fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // En production, vous pourriez vouloir envoyer l'erreur à un service de monitoring
    if (!isDevelopment) {
      // Exemple: Sentry, LogRocket, etc.
      // sentryLogger.captureException(error, { extra: errorInfo });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleReportBug = () => {
    const { error, errorInfo } = this.state;
    const subject = encodeURIComponent('Bug Report: Erreur dans l\'application');
    const body = encodeURIComponent(`
Bonjour,

J'ai rencontré une erreur dans l'application AlloKoli:

**Erreur:** ${error?.message || 'Erreur inconnue'}

**Stack trace:**
${error?.stack || 'Non disponible'}

**Informations supplémentaires:**
${errorInfo?.componentStack || 'Non disponibles'}

**URL:** ${window.location.href}
**User Agent:** ${navigator.userAgent}
**Timestamp:** ${new Date().toISOString()}

Merci de votre aide !
    `);

    window.open(`mailto:support@allokoli.com?subject=${subject}&body=${body}`);
  };

  render() {
    if (this.state.hasError) {
      // Utiliser le fallback personnalisé si fourni
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo } = this.state;
      const showDetails = this.props.showDetails || isDevelopment;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <Result
              status="error"
              title="Oups ! Une erreur s'est produite"
              subTitle="Nous sommes désolés, quelque chose s'est mal passé. Votre action n'a pas pu être completée."
              extra={
                <Space direction="vertical" size="middle" className="w-full">
                  <Space wrap>
                    <Button
                      variant="primary"
                      icon={<ReloadOutlined />}
                      onClick={this.handleRetry}
                      size="large"
                    >
                      Réessayer
                    </Button>
                    <Button
                      icon={<HomeOutlined />}
                      onClick={this.handleGoHome}
                      size="large"
                    >
                      Retour à l&apos;accueil
                    </Button>
                    <Button
                      icon={<BugOutlined />}
                      onClick={this.handleReportBug}
                      size="large"
                    >
                      Signaler le problème
                    </Button>
                  </Space>

                  {showDetails && error && (
                    <Card 
                      size="small" 
                      title="Détails techniques" 
                      className="mt-4 text-left"
                      style={{ background: '#fafafa' }}
                    >
                      <Space direction="vertical" size="small" className="w-full">
                        <div>
                          <Text strong>Message d&apos;erreur:</Text>
                          <Paragraph
                            code
                            copyable
                            className="mt-1 mb-2"
                            style={{ whiteSpace: 'pre-wrap' }}
                          >
                            {error.message}
                          </Paragraph>
                        </div>

                        {error.stack && (
                          <div>
                            <Text strong>Stack trace:</Text>
                            <Paragraph
                              code
                              copyable
                              className="mt-1 mb-2"
                              style={{ 
                                whiteSpace: 'pre-wrap',
                                fontSize: '11px',
                                maxHeight: '200px',
                                overflow: 'auto'
                              }}
                            >
                              {error.stack}
                            </Paragraph>
                          </div>
                        )}

                        {errorInfo?.componentStack && (
                          <div>
                            <Text strong>Composant affecté:</Text>
                            <Paragraph
                              code
                              copyable
                              className="mt-1"
                              style={{ 
                                whiteSpace: 'pre-wrap',
                                fontSize: '11px',
                                maxHeight: '150px',
                                overflow: 'auto'
                              }}
                            >
                              {errorInfo.componentStack}
                            </Paragraph>
                          </div>
                        )}
                      </Space>
                    </Card>
                  )}
                </Space>
              }
            />
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook pour utiliser ErrorBoundary avec des fonctions
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Composant ErrorBoundary spécifique pour les pages
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      showDetails={isDevelopment}
      onError={(error, errorInfo) => {
        // Log spécifique pour les erreurs de page
        console.group('🚨 Page Error Boundary');
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.groupEnd();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Composant ErrorBoundary spécifique pour les composants
export function ComponentErrorBoundary({ 
  children, 
  componentName 
}: { 
  children: ReactNode;
  componentName?: string;
}) {
  return (
    <ErrorBoundary
      showDetails={false}
      fallback={
        <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
          <div className="flex items-center space-x-2 text-red-600">
            <BugOutlined />
            <span className="font-medium">
              Erreur dans {componentName || 'le composant'}
            </span>
          </div>
          <p className="text-sm text-red-500 mt-1">
            Ce composant a rencontré un problème. Rechargez la page pour réessayer.
          </p>
        </div>
      }
      onError={(error, errorInfo) => {
        console.group(`🔧 Component Error: ${componentName || 'Unknown'}`);
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.groupEnd();
      }}
    >
      {children}
    </ErrorBoundary>
  );
} 