import { Badge, Tooltip } from 'antd';
import { FireOutlined } from '@ant-design/icons';

interface StreakDisplayProps {
  streak: number;
  size?: 'small' | 'default' | 'large';
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, size = 'default' }) => {
  const getColor = () => {
    if (streak === 0) return '#d9d9d9';
    if (streak >= 90) return '#FFD700'; // Gold
    if (streak >= 14) return '#ff4d4f'; // Red
    if (streak >= 7) return '#ff7a45'; // Orange-red
    if (streak >= 3) return '#faad14'; // Orange
    return '#d9d9d9'; // Gray
  };

  const fontSize = size === 'small' ? '16px' : size === 'large' ? '32px' : '24px';

  return (
    <Tooltip title={streak > 0 ? `${streak} dias seguidos treinando!` : 'Comece sua streak!'}>
      <Badge count={streak} showZero style={{ backgroundColor: getColor() }}>
        <FireOutlined style={{ fontSize, color: getColor() }} />
      </Badge>
    </Tooltip>
  );
};
