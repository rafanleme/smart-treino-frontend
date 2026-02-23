import { useState } from 'react';
import { App, Typography, Card, Button, Empty, Spin, Row, Col, Modal, Space, Divider } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useWorkouts } from '../hooks/useWorkouts';
import { useTrainingSession } from '../contexts/TrainingSessionContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { TrainingSession } from '../types';

const { Title, Text } = Typography;

export function TrainSelectPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { workouts, loading } = useWorkouts();
  const { startSession, endSession } = useTrainingSession();
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictSession, setConflictSession] = useState<TrainingSession | null>(null);
  const [pendingWorkoutId, setPendingWorkoutId] = useState<number | null>(null);

  const handleStartWorkout = async (workoutId: number) => {
    try {
      const session = await startSession(workoutId);
      if (session) {
        navigate(`/train/${session.id}`);
      }
    } catch (error: any) {
      // Check if error is due to existing active session
      if (error.response?.status === 400 && error.response?.data?.data?.session) {
        setConflictSession(error.response.data.data.session);
        setPendingWorkoutId(workoutId);
        setShowConflictModal(true);
      } else {
        message.error(error.response?.data?.message || 'Erro ao iniciar treino');
      }
    }
  };

  const handleResumeExisting = () => {
    if (conflictSession) {
      navigate(`/train/${conflictSession.id}`);
    }
    setShowConflictModal(false);
  };

  const handleAbandonAndStart = async () => {
    if (conflictSession && pendingWorkoutId) {
      try {
        await endSession('abandoned', 'Abandonado para iniciar novo treino');
        // Try starting new session again
        const session = await startSession(pendingWorkoutId);
        if (session) {
          navigate(`/train/${session.id}`);
        }
      } catch (error: any) {
        message.error(error.response?.data?.message || 'Erro ao iniciar novo treino');
      }
    }
    setShowConflictModal(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" description="Carregando treinos..." />
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div>
        <Title level={3}>Selecionar Treino</Title>
        <Empty
          description="Nenhum treino disponível"
          style={{ padding: 48 }}
        >
          <Button type="primary" onClick={() => navigate('/workouts/new')}>
            Criar Treino
          </Button>
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <Title level={3}>Selecionar Treino</Title>
      <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
        Escolha um treino para iniciar sua sessão
      </Text>

      <Row gutter={[16, 16]}>
        {workouts.map((workout) => (
          <Col key={workout.id} xs={24} sm={12} lg={8}>
            <Card
              title={workout.name}
              extra={
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  onClick={() => handleStartWorkout(workout.id)}
                  size="large"
                >
                  Iniciar
                </Button>
              }
            >
              {workout.description && (
                <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                  {workout.description}
                </Text>
              )}
              <Text>
                <strong>{workout.exercises_count || 0}</strong> exercícios
              </Text>
              {workout.estimated_duration_min && (
                <Text type="secondary" style={{ display: 'block' }}>
                  ~{workout.estimated_duration_min} minutos
                </Text>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={
          <Space>
            <WarningOutlined style={{ color: '#faad14' }} />
            <span>Treino Ativo Detectado</span>
          </Space>
        }
        open={showConflictModal}
        onCancel={() => setShowConflictModal(false)}
        footer={
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button onClick={() => setShowConflictModal(false)}>
              Cancelar
            </Button>
            <Space>
              <Button danger onClick={handleAbandonAndStart}>
                Abandonar e Criar Novo
              </Button>
              <Button type="primary" icon={<PlayCircleOutlined />} onClick={handleResumeExisting}>
                Retomar Treino
              </Button>
            </Space>
          </Space>
        }
        width={500}
      >
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <Text type="secondary">Você já tem uma sessão de treino ativa:</Text>
          </div>

          <Card size="small" style={{ background: '#f5f5f5' }}>
            <Space orientation="vertical" size="small" style={{ width: '100%' }}>
              <Title level={5} style={{ margin: 0 }}>
                {conflictSession?.workout_name}
              </Title>
              {conflictSession && (
                <Text type="secondary">
                  <ClockCircleOutlined /> Iniciada {formatDistanceToNow(
                    new Date(conflictSession.started_at),
                    { locale: ptBR, addSuffix: true }
                  )}
                </Text>
              )}
            </Space>
          </Card>

          <Divider style={{ margin: '8px 0' }} />

          <Text>
            Deseja retomar o treino existente ou abandoná-lo para iniciar um novo?
          </Text>
        </Space>
      </Modal>
    </div>
  );
}
