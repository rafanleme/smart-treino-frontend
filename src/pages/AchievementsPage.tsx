import { Skeleton, Typography, Alert, Card, Row, Col } from 'antd';
import { AchievementGrid } from '../components/gamification/AchievementGrid';
import { useAchievements } from '../hooks/useAchievements';

const { Title, Paragraph } = Typography;

export function AchievementsPage() {
  const { achievements, loading, error } = useAchievements();

  if (error) {
    return (
      <Alert
        message="Erro"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>🏆 Conquistas</Title>
      {!loading && (
        <Paragraph type="secondary">
          Você desbloqueou {unlockedCount} de {totalCount} conquistas ({Math.round((unlockedCount / totalCount) * 100)}%)
        </Paragraph>
      )}

      {loading ? (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card>
                <Skeleton active avatar paragraph={{ rows: 2 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <AchievementGrid achievements={achievements} />
      )}
    </div>
  );
}
