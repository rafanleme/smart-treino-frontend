import { Card, Typography } from 'antd';
import type { Achievement } from '../../types';
import dayjs from 'dayjs';

const { Text, Paragraph } = Typography;

interface AchievementBadgeProps {
  achievement: Achievement;
}

const iconMap: Record<string, string> = {
  trophy: '🏆',
  fire: '🔥',
  star: '⭐',
  crown: '👑',
  medal: '🏅',
  sword: '⚔️',
  sunrise: '🌅',
  moon: '🌙',
  muscle: '💪',
  lightning: '⚡',
  weight: '🏋️',
  mountain: '🏔️',
  dna: '🧬',
  ruler: '📏',
  chart: '📊',
  trending: '📈',
  calendar: '📅',
  arrow_down: '⬇️',
  arrow_up: '⬆️',
  target: '🎯',
  cake: '🎂',
  pencil: '✏️',
  robot: '🤖',
  palette: '🎨',
  diamond: '💎',
};

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const isLocked = !achievement.unlocked;

  return (
    <Card
      hoverable={!isLocked}
      style={{
        opacity: isLocked ? 0.5 : 1,
        backgroundColor: isLocked ? '#f5f5f5' : '#fff',
        borderColor: achievement.unlocked ? '#52c41a' : '#d9d9d9',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px', filter: isLocked ? 'grayscale(100%)' : 'none' }}>
          {iconMap[achievement.icon] || '🏆'}
        </div>

        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
          {achievement.name_pt}
        </Text>

        <Paragraph
          type="secondary"
          style={{ fontSize: '12px', marginBottom: '8px' }}
          ellipsis={{ rows: 2 }}
        >
          {achievement.description_pt}
        </Paragraph>

        <div style={{ fontSize: '12px', color: '#1890ff' }}>
          {achievement.xp_reward} XP
        </div>

        {achievement.unlocked && achievement.unlocked_at && (
          <Text type="success" style={{ fontSize: '11px', display: 'block', marginTop: '8px' }}>
            Desbloqueado em {dayjs(achievement.unlocked_at).format('DD/MM/YYYY')}
          </Text>
        )}

        {isLocked && (
          <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '8px' }}>
            🔒 Bloqueado
          </Text>
        )}
      </div>
    </Card>
  );
};
