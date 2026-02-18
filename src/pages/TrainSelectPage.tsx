import { useEffect } from 'react';
import { Typography, Card, Button, Empty, Spin, Row, Col } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useWorkouts } from '../hooks/useWorkouts';
import { useTrainingSession } from '../contexts/TrainingSessionContext';

const { Title, Text } = Typography;

export function TrainSelectPage() {
  const navigate = useNavigate();
  const { workouts, loading } = useWorkouts();
  const { activeSession, startSession } = useTrainingSession();

  // If there's an active session, redirect to it
  useEffect(() => {
    if (activeSession) {
      navigate(`/train/${activeSession.id}`);
    }
  }, [activeSession, navigate]);

  const handleStartWorkout = async (workoutId: number) => {
    const session = await startSession(workoutId);
    if (session) {
      navigate(`/train/${session.id}`);
    }
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
    </div>
  );
}
