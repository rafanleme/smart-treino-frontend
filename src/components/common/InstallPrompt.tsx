import { useEffect, useState } from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { DownloadOutlined, CloseOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  useEffect(() => {
    // Hide prompt if app is installed
    const handleAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to install prompt: ${outcome}`);

    // Clear the prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        maxWidth: 320,
      }}
    >
      <Card
        size="small"
        extra={
          <Button
            type="text"
            size="small"
            icon={<CloseOutlined />}
            onClick={handleDismiss}
          />
        }
      >
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text strong>Instalar SmartTreino</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Adicione o app à tela inicial para acesso rápido
            </Text>
          </div>

          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleInstallClick}
            block
          >
            Instalar
          </Button>
        </Space>
      </Card>
    </div>
  );
}
