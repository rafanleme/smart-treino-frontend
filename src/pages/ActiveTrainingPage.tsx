import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Button, Spin, Popconfirm, Card, message, Tag } from 'antd';
import { StopOutlined, EyeOutlined } from '@ant-design/icons';
import { sessionService } from '../services/sessionService';
import { useTrainingSession } from '../contexts/TrainingSessionContext';
import { useWakeLock } from '../hooks/useWakeLock';
import {
  SessionTimer,
  ExerciseNavigator,
  ExercisePlayer,
  SessionSummary,
} from '../components/training';
import type { TrainingSession, SessionExercise } from '../types';

export function ActiveTrainingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { endSession, clearSession } = useTrainingSession();
  const { isSupported: isWakeLockSupported, isActive: isWakeLockActive, request: requestWakeLock, release: releaseWakeLock } = useWakeLock();

  const [session, setSession] = useState<TrainingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // Load session
  useEffect(() => {
    const loadSession = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await sessionService.get(Number(id));
        setSession(response.data.data);
      } catch (error: any) {
        message.error(error.response?.data?.message || 'Erro ao carregar sessão');
        navigate('/train');
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [id, navigate]);

  // Auto-refresh session every 30 seconds
  useEffect(() => {
    if (!id) return;

    const interval = setInterval(async () => {
      try {
        const response = await sessionService.get(Number(id));
        setSession(response.data.data);
      } catch (error) {
        console.error('Failed to refresh session:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [id]);

  // Wake Lock: keep screen active during training
  useEffect(() => {
    if (session?.status === 'in_progress') {
      requestWakeLock();
    }

    return () => {
      releaseWakeLock();
    };
  }, [session?.status, requestWakeLock, releaseWakeLock]);

  const handleExerciseUpdate = (updatedExercise: SessionExercise) => {
    if (!session) return;

    setSession({
      ...session,
      session_exercises: session.session_exercises?.map(ex =>
        ex.id === updatedExercise.id ? updatedExercise : ex
      ),
    });
  };

  const handleNext = () => {
    if (!session?.session_exercises) return;

    if (currentExerciseIndex < session.session_exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      handleFinishSession();
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleFinishSession = async () => {
    if (!session) return;

    try {
      // Update session status to completed
      const response = await sessionService.update(session.id, { status: 'completed' });

      // Update local session state to show summary
      setSession(response.data.data);

      // Clear the active session from context (without updating again)
      clearSession();

      message.success('Treino finalizado!');
    } catch (error: any) {
      console.error('Failed to finish session:', error);
      message.error(error.response?.data?.message || 'Erro ao finalizar treino');
    }
  };

  const handleAbandonSession = async () => {
    if (!session) return;

    try {
      await endSession('abandoned');
      navigate('/');
    } catch (error) {
      console.error('Failed to abandon session:', error);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" description="Carregando treino..." />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Show summary if session is completed
  if (session.status === 'completed') {
    return <SessionSummary session={session} />;
  }

  const exercises = session.session_exercises || [];
  const currentExercise = exercises[currentExerciseIndex];

  return (
    <div>
      <Row gutter={[16, 16]}>
        {/* Header - Timer and Abandon */}
        <Col xs={24}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>
                  {session.workout_name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <SessionTimer startedAt={session.started_at} />
                  {isWakeLockSupported && isWakeLockActive && (
                    <Tag icon={<EyeOutlined />} color="success">
                      Tela mantida ativa
                    </Tag>
                  )}
                </div>
              </div>

              <Popconfirm
                title="Abandonar treino?"
                description="Você perderá o progresso deste treino."
                onConfirm={handleAbandonSession}
                okText="Sim"
                cancelText="Não"
                okButtonProps={{ danger: true }}
              >
                <Button danger icon={<StopOutlined />} size="large">
                  Abandonar
                </Button>
              </Popconfirm>
            </div>
          </Card>
        </Col>

        {/* Exercise Navigator - Show on medium+ screens */}
        <Col xs={0} md={8}>
          <Card title="Exercícios" style={{ height: '100%' }}>
            <ExerciseNavigator
              exercises={exercises}
              currentIndex={currentExerciseIndex}
              onSelectExercise={setCurrentExerciseIndex}
            />
          </Card>
        </Col>

        {/* Exercise Player */}
        <Col xs={24} md={16}>
          {currentExercise && (
            <ExercisePlayer
              exercise={currentExercise}
              onUpdate={handleExerciseUpdate}
              onNext={handleNext}
              onSkip={handleSkip}
            />
          )}
        </Col>

        {/* Mobile Exercise Navigator */}
        <Col xs={24} md={0}>
          <Card title="Outros Exercícios">
            <ExerciseNavigator
              exercises={exercises}
              currentIndex={currentExerciseIndex}
              onSelectExercise={setCurrentExerciseIndex}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
