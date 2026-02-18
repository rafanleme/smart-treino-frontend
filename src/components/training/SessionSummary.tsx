import { Card, Statistic, Row, Col, Button, Space } from 'antd';
import {
  CheckCircleOutlined,
  FireOutlined,
  ThunderboltOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { TrainingSession } from '../../types';

interface SessionSummaryProps {
  session: TrainingSession;
}

export function SessionSummary({ session }: SessionSummaryProps) {
  const navigate = useNavigate();
  const summary = session.summary;

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);

    if (hrs > 0) {
      return `${hrs}h ${mins}min`;
    }
    return `${mins}min`;
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <Card
        title={
          <div style={{ textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>Treino Concluído!</div>
            <div style={{ fontSize: 16, color: '#999' }}>{session.workout_name}</div>
          </div>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={6}>
            <Statistic
              title="Tempo Total"
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

        <Space orientation="vertical" style={{ width: '100%' }} size="middle">
          <Button
            type="primary"
            size="large"
            block
            onClick={() => navigate('/')}
          >
            Voltar ao Início
          </Button>

          <Button
            size="large"
            block
            onClick={() => navigate(`/sessions/${session.id}`)}
          >
            Ver Detalhes
          </Button>
        </Space>
      </Card>
    </div>
  );
}
