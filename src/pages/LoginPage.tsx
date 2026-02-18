import { Button, Card, Typography } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const { Title, Text } = Typography;

export function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();

  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
    }}>
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Title level={2} style={{ marginBottom: 8 }}>SmartTreino</Title>
        <Text type="secondary" style={{ display: 'block', marginBottom: 32 }}>
          Seu assistente inteligente de treinos
        </Text>
        <Button
          type="primary"
          icon={<GoogleOutlined />}
          size="large"
          onClick={login}
          block
          data-cy="google-login-btn"
        >
          Entrar com Google
        </Button>
      </Card>
    </div>
  );
}
