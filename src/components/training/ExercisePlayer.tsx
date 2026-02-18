import { useState, useEffect } from 'react';
import { Card, Typography, Button, Space, Divider, Alert } from 'antd';
import { ArrowRightOutlined, StopOutlined } from '@ant-design/icons';
import { SetLogTable } from './SetLogTable';
import { SetLogger } from './SetLogger';
import { RestTimer } from './RestTimer';
import { sessionService } from '../../services/sessionService';
import type { SessionExercise, SessionSet, PreviousLoad } from '../../types';

const { Title, Text } = Typography;

interface ExercisePlayerProps {
  exercise: SessionExercise;
  onUpdate: (exercise: SessionExercise) => void;
  onNext: () => void;
  onSkip: () => void;
}

export function ExercisePlayer({ exercise, onUpdate, onNext, onSkip }: ExercisePlayerProps) {
  const [sets, setSets] = useState<SessionSet[]>(exercise.session_sets || []);
  const [resting, setResting] = useState(false);
  const [restDuration, setRestDuration] = useState(60);
  const [previousLoad, setPreviousLoad] = useState<PreviousLoad | null>(null);

  // Sync sets when exercise changes
  useEffect(() => {
    setSets(exercise.session_sets || []);
  }, [exercise.id]);

  // Load previous load data
  useEffect(() => {
    const loadPreviousLoad = async () => {
      try {
        const response = await sessionService.getPreviousLoad(
          exercise.training_session_id,
          exercise.exercise_id
        );
        if (response.data.data) {
          setPreviousLoad(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load previous load:', error);
      }
    };

    loadPreviousLoad();
  }, [exercise.training_session_id, exercise.exercise_id]);

  // Mark exercise as in_progress when first set is logged
  useEffect(() => {
    if (sets.length > 0 && exercise.status === 'pending') {
      handleStatusChange('in_progress');
    }
  }, [sets.length]);

  const handleStatusChange = async (status: SessionExercise['status']) => {
    try {
      const response = await sessionService.updateExercise(exercise.id, { status });
      onUpdate(response.data.data);
    } catch (error) {
      console.error('Failed to update exercise status:', error);
    }
  };

  const handleSetLogged = (newSet: SessionSet) => {
    setSets([...sets, newSet]);
  };

  const handleRestStart = (duration: number) => {
    setRestDuration(duration);
    setResting(true);
  };

  const handleRestComplete = () => {
    setResting(false);
  };

  const handleRestSkip = () => {
    setResting(false);
  };

  const handleCompleteExercise = async () => {
    await handleStatusChange('completed');
    onNext();
  };

  const handleSkipExercise = async () => {
    await handleStatusChange('skipped');
    onSkip();
  };

  if (resting) {
    return (
      <Card>
        <Title level={4} style={{ textAlign: 'center' }}>Descansando...</Title>
        <RestTimer
          duration={restDuration}
          onComplete={handleRestComplete}
          onSkip={handleRestSkip}
        />
      </Card>
    );
  }

  return (
    <Card
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>{exercise.exercise_name}</Title>
          <Text type="secondary">
            Meta: {exercise.target_sets} séries de {exercise.target_reps} repetições
          </Text>
        </div>
      }
    >
      <Space orientation="vertical" style={{ width: '100%' }} size="large">
        {previousLoad && (
          <Alert
            message="Última Sessão"
            description={`${previousLoad.load_kg}kg × ${previousLoad.reps} reps (${new Date(previousLoad.date).toLocaleDateString()})`}
            type="info"
            showIcon
          />
        )}

        <div>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Séries Registradas ({sets.length}/{exercise.target_sets})
          </Text>
          <SetLogTable sets={sets} />
        </div>

        <Divider />

        <div>
          <Text strong style={{ display: 'block', marginBottom: 16 }}>
            Registrar Nova Série
          </Text>
          <SetLogger
            sessionExerciseId={exercise.id}
            onSetLogged={handleSetLogged}
            onRestStart={handleRestStart}
            defaultRestSeconds={exercise.rest_seconds || 60}
            previousSets={sets}
          />
        </div>

        <Divider />

        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button
            danger
            icon={<StopOutlined />}
            onClick={handleSkipExercise}
            size="large"
          >
            Pular Exercício
          </Button>

          <Button
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={handleCompleteExercise}
            size="large"
          >
            Próximo Exercício
          </Button>
        </Space>
      </Space>
    </Card>
  );
}
