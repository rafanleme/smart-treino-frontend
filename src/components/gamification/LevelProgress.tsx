import { Progress, Typography, Space } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface LevelProgressProps {
  level: number;
  totalXp: number;
  xpToNextLevel: number;
  compact?: boolean;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  totalXp,
  xpToNextLevel,
  compact = false,
}) => {
  const xpInCurrentLevel = totalXp - (level * (level - 1) / 2) * 100;
  const xpRequiredForCurrentLevel = level * 100;
  const percent = Math.floor((xpInCurrentLevel / xpRequiredForCurrentLevel) * 100);

  if (compact) {
    return (
      <Space>
        <TrophyOutlined style={{ color: '#faad14' }} />
        <Text strong>Nível {level}</Text>
        <Progress
          percent={percent}
          size="small"
          showInfo={false}
          style={{ width: '60px' }}
        />
      </Space>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Space>
          <TrophyOutlined style={{ color: '#faad14', fontSize: '20px' }} />
          <Text strong style={{ fontSize: '16px' }}>Nível {level}</Text>
        </Space>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {xpToNextLevel} XP para nível {level + 1}
        </Text>
      </div>

      <Progress
        percent={percent}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
      />

      <Text type="secondary" style={{ fontSize: '12px' }}>
        {totalXp} XP total
      </Text>
    </div>
  );
};
