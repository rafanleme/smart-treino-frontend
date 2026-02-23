import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { App, Card, Statistic, Row, Col, Collapse, Button, Typography, Spin } from 'antd';
import {
  ClockCircleOutlined,
  ThunderboltOutlined,
  FireOutlined,
  TrophyOutlined,
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { sessionService } from '../services/sessionService';
import { SetLogTable } from '../components/training/SetLogTable';
import type { TrainingSession } from '../types';

const { Title, Text } = Typography;

export function SessionDetailPage() {
  const { message } = App.useApp();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [id]);

  const loadSession = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await sessionService.get(Number(id));
      setSession(response.data.data);
    } catch (error) {
      message.error('Erro ao carregar detalhes da sessão');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
      return `${hrs}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" tip="Carregando sessão..." />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const summary = session.summary;
  const exercises = session.session_exercises || [];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Voltar
      </Button>

      <Card
        title={
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <Title level={3} style={{ margin: 0 }}>
                {session.workout_name || 'Treino Livre'}
              </Title>
            </div>
            <Text type="secondary">
              <CalendarOutlined /> {formatDate(session.started_at)}
            </Text>
          </div>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <Statistic
              title="Duração"
              value={session.duration_seconds ? formatDuration(session.duration_seconds) : '0min'}
              prefix={<ClockCircleOutlined />}
            />
          </Col>

          <Col xs={12} sm={6}>
            <Statistic
              title="Exercícios"
              value={summary?.completed_exercises || 0}
              suffix={`/ ${summary?.total_exercises || 0}`}
              prefix={<ThunderboltOutlined />}
            />
          </Col>

          <Col xs={12} sm={6}>
            <Statistic
              title="Séries Totais"
              value={summary?.total_sets || 0}
              prefix={<FireOutlined />}
            />
          </Col>

          <Col xs={12} sm={6}>
            <Statistic
              title="Volume (kg)"
              value={summary?.total_volume_kg || 0}
              precision={0}
              prefix={<TrophyOutlined />}
            />
          </Col>
        </Row>

        {session.notes && (
          <div style={{ marginTop: 16, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            <Text strong>Observações:</Text>
            <br />
            <Text>{session.notes}</Text>
          </div>
        )}
      </Card>

      <Card title="Exercícios Realizados">
        {exercises.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24, color: '#999' }}>
            Nenhum exercício registrado
          </div>
        ) : (
          <Collapse>
            {exercises.map((exercise) => {
              const sets = exercise.session_sets || [];
              const statusColors = {
                completed: '#52c41a',
                skipped: '#999',
                in_progress: '#1890ff',
                pending: '#d9d9d9',
              };

              return (
                <Collapse.Panel
                  key={exercise.id}
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <Text strong>{exercise.exercise_name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Meta: {exercise.target_sets}x{exercise.target_reps}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Text type="secondary">{sets.length} séries</Text>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: statusColors[exercise.status],
                          }}
                        />
                      </div>
                    </div>
                  }
                >
                  <SetLogTable sets={sets} />
                </Collapse.Panel>
              );
            })}
          </Collapse>
        )}
      </Card>
    </div>
  );
}
