import { useState } from 'react';
import { Button, Card, Typography } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const { Title, Text } = Typography;

export function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      {/* Overlay escuro com blur */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }} />

      {/* Card de login */}
      <Card style={{
        width: 400,
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}>
        <Title level={2} style={{ marginBottom: 8 }}>SmartTreino</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
          Seu assistente inteligente de treinos
        </Text>
        <Button
          type="primary"
          icon={<GoogleOutlined />}
          size="large"
          onClick={handleLogin}
          loading={isLoggingIn}
          block
          data-cy="google-login-btn"
        >
          Entrar com Google
        </Button>
      </Card>
    </div>
  );
}
