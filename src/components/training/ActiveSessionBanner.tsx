import { useState, useEffect } from 'react';
import { Alert, Button, Space, Modal, Typography } from 'antd';
import { PlayCircleOutlined, CloseOutlined, WarningOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTrainingSession } from '../../contexts/TrainingSessionContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { Text } = Typography;

export function ActiveSessionBanner() {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeSession, bannerDismissed, dismissBanner, endSession } = useTrainingSession();
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState('');

  // Calculate elapsed time (hook must be called before any return)
  useEffect(() => {
    if (!activeSession) return;

    const updateElapsed = () => {
      const elapsed = formatDistanceToNow(
        new Date(activeSession.started_at),
        { locale: ptBR, addSuffix: false }
      );
      setElapsedTime(elapsed);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [activeSession?.started_at]);

  // Don't show on active training page
  if (!activeSession || location.pathname.startsWith('/train/')) {
    return null;
  }

  // Don't show if dismissed
  if (bannerDismissed) {
    return null;
  }

  // Check if session is stale (>24 hours)
  const isStale = activeSession &&
    (Date.now() - new Date(activeSession.started_at).getTime()) > 24 * 60 * 60 * 1000;

  const handleResume = () => {
    navigate(`/train/${activeSession.id}`);
  };

  const handleAbandon = async () => {
    await endSession('abandoned', 'Sessão abandonada via banner');
    setShowAbandonModal(false);
  };

  return (
    <>
      <Alert
        title={
          <Space style={{ width: '100%', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Space>
              {isStale && <WarningOutlined style={{ color: '#faad14' }} />}
              <Text strong>{activeSession.workout_name}</Text>
              <Text type="secondary">•</Text>
              <Text type="secondary">
                {isStale ? `Iniciado há ${elapsedTime}` : `Há ${elapsedTime}`}
              </Text>
            </Space>
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={handleResume}
              >
                Retomar Treino
              </Button>
              <Button
                type="text"
                size="small"
                danger
                onClick={() => setShowAbandonModal(true)}
              >
                Abandonar
              </Button>
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={dismissBanner}
              />
            </Space>
          </Space>
        }
        type={isStale ? 'warning' : 'info'}
        banner
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          marginBottom: 16,
        }}
      />

      <Modal
        title="Abandonar Treino"
        open={showAbandonModal}
        onOk={handleAbandon}
        onCancel={() => setShowAbandonModal(false)}
        okText="Sim, Abandonar"
        cancelText="Cancelar"
        okButtonProps={{ danger: true }}
      >
        <Text>
          Tem certeza que deseja abandonar o treino <strong>{activeSession?.workout_name}</strong>?
          {isStale && (
            <>
              <br /><br />
              <Text type="warning">
                Esta sessão foi iniciada há mais de 24 horas.
              </Text>
            </>
          )}
        </Text>
      </Modal>
    </>
  );
}
