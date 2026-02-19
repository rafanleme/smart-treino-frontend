import React, { Component, ReactNode } from 'react';
import { Result, Button } from 'antd';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '100px 24px', textAlign: 'center' }}>
          <Result
            status="error"
            title="Algo deu errado"
            subTitle="Desculpe, ocorreu um erro inesperado. Por favor, tente novamente."
            extra={[
              <Button type="primary" key="home" onClick={this.handleReset}>
                Voltar ao Início
              </Button>,
              <Button key="reload" onClick={() => window.location.reload()}>
                Recarregar Página
              </Button>,
            ]}
          />
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: 24, textAlign: 'left' }}>
              <summary>Detalhes do erro (development)</summary>
              <pre style={{ padding: 16, background: '#f5f5f5', overflow: 'auto' }}>
                {this.state.error.toString()}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
