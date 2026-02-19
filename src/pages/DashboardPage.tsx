import { Spin, Typography, Alert, Card, Row, Col, Space, Badge, Progress } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { FireFilled, TrophyOutlined, CalendarOutlined } from '@ant-design/icons';
import { StatsWidget } from '../components/gamification/StatsWidget';
import { LevelProgress } from '../components/gamification/LevelProgress';
import { AchievementBadge } from '../components/gamification/AchievementBadge';
import { PersonalRecordCard } from '../components/gamification/PersonalRecordCard';
import { useStats } from '../hooks/useStats';
import { useRecentAchievements } from '../hooks/useAchievements';
import { usePersonalRecords } from '../hooks/usePersonalRecords';
import { useState, useEffect, useMemo } from 'react';
import { sessionService } from '../services/sessionService';
import { achievementService } from '../services/achievementService';

const { Title, Text } = Typography;

export function DashboardPage() {
  const { stats, loading: statsLoading, error: statsError } = useStats();
  const { achievements, loading: achievementsLoading } = useRecentAchievements();
  const { records, loading: recordsLoading } = usePersonalRecords();
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [nextAchievement, setNextAchievement] = useState<any>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Compute derived values BEFORE any conditional returns
  const recentRecords = useMemo(() => records.slice(0, 3), [records]);
  const recentAchievements = useMemo(() => achievements.slice(0, 3), [achievements]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent sessions
        const sessionsResponse = await sessionService.list({ per_page: 5, page: 1, status: 'completed' });
        setRecentSessions(sessionsResponse.data.data);

        // Fetch all achievements to find next one
        const allAchievements = await achievementService.getAll();

        // Find next achievement closest to unlock (locked with highest progress)
        const locked = allAchievements.filter((a: any) => !a.unlocked_at);
        if (locked.length > 0) {
          // For now, just pick the first locked one
          // TODO: Calculate progress based on threshold
          setNextAchievement(locked[0]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchData();
  }, []);

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
          <Card
            title={
              <Space>
                <FireFilled style={{ color: '#ff4d4f' }} />
                <span>Streak Atual</span>
              </Space>
            }
            style={{
              textAlign: 'center',
              background: stats.current_streak > 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
              color: stats.current_streak > 0 ? 'white' : undefined,
            }}
          >
            <div style={{
              fontSize: 72,
              animation: stats.current_streak > 0 ? 'pulse 2s infinite' : undefined,
            }}>
              🔥
            </div>
            <div style={{ marginTop: '16px' }}>
              <Text strong style={{
                fontSize: '48px',
                color: stats.current_streak > 0 ? 'white' : undefined,
              }}>
                {stats.current_streak}
              </Text>
              <Text
                type={stats.current_streak > 0 ? undefined : 'secondary'}
                style={{
                  display: 'block',
                  fontSize: '16px',
                  color: stats.current_streak > 0 ? 'rgba(255,255,255,0.9)' : undefined,
                }}
              >
                dias consecutivos
              </Text>
            </div>
          </Card>
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.8; }
            }
          `}</style>
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

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Volume Semanal (kg)">
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
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Sessões por Semana">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.weekly_volume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#52c41a"
                  strokeWidth={2}
                  name="Sessões"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Next Achievement */}
      {nextAchievement && (
        <Card
          title={
            <Space>
              <TrophyOutlined />
              <span>Próxima Conquista</span>
            </Space>
          }
          style={{ marginBottom: '24px' }}
        >
          <Row gutter={16} align="middle">
            <Col flex="none">
              <Badge count={nextAchievement.xp_reward + ' XP'} showZero>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24
                }}>
                  {nextAchievement.icon || '🏆'}
                </div>
              </Badge>
            </Col>
            <Col flex="auto">
              <Text strong style={{ fontSize: 16 }}>{nextAchievement.name_pt}</Text>
              <div>
                <Text type="secondary">{nextAchievement.description_pt}</Text>
              </div>
              {nextAchievement.threshold_value && (
                <Progress percent={0} size="small" style={{ marginTop: 8 }} />
              )}
            </Col>
          </Row>
        </Card>
      )}

      {/* Recent Sessions */}
      <Card
        title={
          <Space>
            <CalendarOutlined />
            <span>Últimas Sessões</span>
          </Space>
        }
        loading={loadingSessions}
        style={{ marginBottom: '24px' }}
      >
        {recentSessions.length === 0 ? (
          <Text type="secondary">Nenhuma sessão realizada ainda</Text>
        ) : (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {recentSessions.map((session: any) => (
              <Card key={session.id} size="small" style={{ background: '#fafafa' }}>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>{session.workout_name}</Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {new Date(session.started_at).toLocaleDateString('pt-BR')} •
                        {' '}{Math.floor((session.duration_seconds || 0) / 60)} min
                      </Text>
                    </div>
                  </Col>
                  <Col>
                    <Badge
                      count={session.exercises?.length || 0}
                      showZero
                      style={{ backgroundColor: '#52c41a' }}
                      title="Exercícios"
                    />
                  </Col>
                </Row>
              </Card>
            ))}
          </Space>
        )}
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
