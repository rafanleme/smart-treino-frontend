import { Card, Statistic, Row, Col } from 'antd';
import {
  FireOutlined,
  ThunderboltOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  RiseOutlined,
} from '@ant-design/icons';

interface StatsWidgetProps {
  totalSessions: number;
  totalDurationHours: number;
  totalVolumeKg: number;
  currentStreak: number;
  recentPRs: number;
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({
  totalSessions,
  totalDurationHours,
  totalVolumeKg,
  currentStreak,
  recentPRs,
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic
            title="Total de Treinos"
            value={totalSessions}
            prefix={<ThunderboltOutlined />}
            styles={{ content: { color: '#3f8600' } }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic
            title="Horas Treinadas"
            value={totalDurationHours}
            precision={1}
            prefix={<ClockCircleOutlined />}
            suffix="h"
            styles={{ content: { color: '#1890ff' } }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic
            title="Volume Total"
            value={totalVolumeKg}
            precision={0}
            prefix={<RiseOutlined />}
            suffix="kg"
            styles={{ content: { color: '#cf1322' } }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic
            title="Streak Atual"
            value={currentStreak}
            prefix={<FireOutlined />}
            suffix="dias"
            styles={{ content: { color: '#faad14' } }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={8}>
        <Card>
          <Statistic
            title="PRs Recentes (30 dias)"
            value={recentPRs}
            prefix={<TrophyOutlined />}
            styles={{ content: { color: '#52c41a' } }}
          />
        </Card>
      </Col>
    </Row>
  );
};
