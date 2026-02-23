import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Empty, Skeleton, Typography, Tag, Row, Col, Statistic, Button } from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { sessionService } from '../services/sessionService';
import type { TrainingSession } from '../types';

const { Title, Text } = Typography;

export function SessionHistoryPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    loadSessions();
  }, [pagination.current]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const response = await sessionService.list({
        status: 'completed',
        per_page: pagination.pageSize,
        page: pagination.current,
      });
      setSessions(response.data.data);
      setPagination({
        ...pagination,
        total: response.data.meta.total,
      });
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
      return `${hrs}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Histórico de Treinos</Title>
      <Text type="secondary">Revise seus treinos anteriores e acompanhe seu progresso</Text>

      {loading && sessions.length === 0 && (
        <div style={{ marginTop: 24 }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} style={{ marginBottom: 16 }}>
              <Skeleton active title paragraph={{ rows: 2 }} />
            </Card>
          ))}
        </div>
      )}

      {!loading && sessions.length === 0 ? (
        <Card style={{ marginTop: 24 }}>
          <Empty
            description="Nenhum treino concluído ainda"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/train')}>
              Iniciar Primeiro Treino
            </Button>
          </Empty>
        </Card>
      ) : (
        <div style={{ marginTop: 24 }}>
          {sessions.map((session) => {
            const summary = session.summary;
            return (
              <Card
                key={session.id}
                style={{ marginBottom: 16 }}
                hoverable
                onClick={() => navigate(`/sessions/${session.id}`)}
              >
                <Row gutter={[16, 16]} align="middle">
                  <Col xs={24} sm={12} md={8}>
                    <div>
                      <Text strong style={{ fontSize: 16 }}>
                        {session.workout_name || 'Treino Livre'}
                      </Text>
                      <br />
                      <Text type="secondary">
                        <CalendarOutlined /> {formatDate(session.started_at)}
                      </Text>
                    </div>
                  </Col>

                  <Col xs={12} sm={6} md={4}>
                    <Statistic
                      title="Duração"
                      value={session.duration_seconds ? formatDuration(session.duration_seconds) : '0min'}
                      prefix={<ClockCircleOutlined />}
                      styles={{ content: { fontSize: 16 } }}
                    />
                  </Col>

                  <Col xs={12} sm={6} md={4}>
                    <Statistic
                      title="Séries"
                      value={summary?.total_sets || 0}
                      prefix={<FireOutlined />}
                      styles={{ content: { fontSize: 16 } }}
                    />
                  </Col>

                  <Col xs={12} sm={6} md={4}>
                    <Statistic
                      title="Volume (kg)"
                      value={summary?.total_volume_kg || 0}
                      prefix={<TrophyOutlined />}
                      styles={{ content: { fontSize: 16 } }}
                      precision={0}
                    />
                  </Col>

                  <Col xs={12} sm={6} md={4}>
                    <div style={{ textAlign: 'right' }}>
                      <Tag color="success">
                        {summary?.completed_exercises || 0}/{summary?.total_exercises || 0} exercícios
                      </Tag>
                      <br />
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sessions/${session.id}`);
                        }}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            );
          })}

          {pagination.total > pagination.pageSize && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Button
                onClick={() => setPagination({ ...pagination, current: pagination.current - 1 })}
                disabled={pagination.current === 1}
                style={{ marginRight: 8 }}
              >
                Anterior
              </Button>
              <Text>
                Página {pagination.current} de {Math.ceil(pagination.total / pagination.pageSize)}
              </Text>
              <Button
                onClick={() => setPagination({ ...pagination, current: pagination.current + 1 })}
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                style={{ marginLeft: 8 }}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
