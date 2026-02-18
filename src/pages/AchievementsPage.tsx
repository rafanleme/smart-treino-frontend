import { Spin, Typography, Alert } from 'antd';
import { AchievementGrid } from '../components/gamification/AchievementGrid';
import { useAchievements } from '../hooks/useAchievements';

const { Title, Paragraph } = Typography;

export function AchievementsPage() {
  const { achievements, loading, error } = useAchievements();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

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
      <Paragraph type="secondary">
        Você desbloqueou {unlockedCount} de {totalCount} conquistas ({Math.round((unlockedCount / totalCount) * 100)}%)
      </Paragraph>

      <AchievementGrid achievements={achievements} />
    </div>
  );
}
