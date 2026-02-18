import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spin, Typography, message } from 'antd';

const { Text } = Typography;

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('Login cancelado.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!code) {
      setError('Codigo de autorizacao nao encontrado.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    handleGoogleCallback(code)
      .then(() => {
        message.success('Login realizado com sucesso!');
        navigate('/');
      })
      .catch(() => {
        setError('Falha ao autenticar. Tente novamente.');
        setTimeout(() => navigate('/login'), 3000);
      });
  }, [searchParams, handleGoogleCallback, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      gap: 16,
    }}>
      {error ? (
        <Text type="danger">{error}</Text>
      ) : (
        <>
          <Spin size="large" />
          <Text>Autenticando...</Text>
        </>
      )}
    </div>
  );
}
