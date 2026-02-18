import { Spin, Typography, Alert, Card, Row, Col, Space } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatsWidget } from '../components/gamification/StatsWidget';
import { LevelProgress } from '../components/gamification/LevelProgress';
import { StreakDisplay } from '../components/gamification/StreakDisplay';
import { AchievementBadge } from '../components/gamification/AchievementBadge';
import { PersonalRecordCard } from '../components/gamification/PersonalRecordCard';
import { useStats } from '../hooks/useStats';
import { useRecentAchievements } from '../hooks/useAchievements';
import { usePersonalRecords } from '../hooks/usePersonalRecords';

const { Title, Text } = Typography;

export function DashboardPage() {
  const { stats, loading: statsLoading, error: statsError } = useStats();
  const { achievements, loading: achievementsLoading } = useRecentAchievements();
  const { records, loading: recordsLoading } = usePersonalRecords();

  if (statsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (statsError || !stats) {
    return (
      <Alert
        message="Erro"
        description={statsError || 'Erro ao carregar estatísticas'}
        type="error"
        showIcon
      />
    );
  }

  const recentRecords = records.slice(0, 3);
  const recentAchievements = achievements.slice(0, 3);

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>📊 Dashboard</Title>

      {/* Level and Streak */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={16}>
          <Card title="Progresso de Nível">
            <LevelProgress
              level={stats.level}
              totalXp={stats.total_xp}
              xpToNextLevel={stats.xp_to_next_level}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Streak Atual" style={{ textAlign: 'center' }}>
            <StreakDisplay streak={stats.current_streak} size="large" />
            <div style={{ marginTop: '16px' }}>
              <Text strong style={{ fontSize: '24px' }}>{stats.current_streak}</Text>
              <Text type="secondary" style={{ display: 'block' }}>dias consecutivos</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Stats Widgets */}
      <div style={{ marginBottom: '24px' }}>
        <StatsWidget
          totalSessions={stats.total_sessions}
          totalDurationHours={stats.total_duration_hours}
          totalVolumeKg={stats.total_volume_kg}
          currentStreak={stats.current_streak}
          recentPRs={stats.recent_prs}
        />
      </div>

      {/* Weekly Volume Chart */}
      <Card title="Volume Semanal (kg)" style={{ marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.weekly_volume}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="volume_kg" fill="#1890ff" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Achievements and PRs */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Conquistas Recentes" loading={achievementsLoading}>
            {recentAchievements.length === 0 ? (
              <Text type="secondary">Nenhuma conquista desbloqueada ainda</Text>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {recentAchievements.map(achievement => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
              </Space>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Records Recentes" loading={recordsLoading}>
            {recentRecords.length === 0 ? (
              <Text type="secondary">Nenhum record pessoal ainda</Text>
            ) : (
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {recentRecords.map(record => (
                  <PersonalRecordCard key={record.id} record={record} />
                ))}
              </Space>
            )}
          </Card>
        </Col>
      </Row>

      {/* Favorite Exercise */}
      {stats.favorite_exercise && (
        <Card title="Exercício Favorito" style={{ marginTop: '24px' }}>
          <Space direction="vertical">
            <Text strong style={{ fontSize: '18px' }}>{stats.favorite_exercise.name_pt}</Text>
            <Text type="secondary">Realizado {stats.favorite_exercise.times_performed} vezes</Text>
          </Space>
        </Card>
      )}
    </div>
  );
}
