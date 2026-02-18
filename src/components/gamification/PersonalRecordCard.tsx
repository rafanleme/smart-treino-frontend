import { Card, Typography, Tag, Space } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import type { PersonalRecord } from '../../types';
import dayjs from 'dayjs';

const { Text } = Typography;

interface PersonalRecordCardProps {
  record: PersonalRecord;
}

export const PersonalRecordCard: React.FC<PersonalRecordCardProps> = ({ record }) => {
  return (
    <Card size="small" style={{ borderLeft: '3px solid #52c41a' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <TrophyOutlined style={{ color: '#faad14', fontSize: '18px' }} />
            <Text strong>{record.exercise.name_pt}</Text>
          </Space>
          <Tag color="green">{record.exercise.muscle_group}</Tag>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text>
            <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
              {record.load_kg}kg
            </Text>
            {' × '}
            <Text strong style={{ fontSize: '18px' }}>
              {record.reps} reps
            </Text>
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {dayjs(record.achieved_at).format('DD/MM/YYYY')}
          </Text>
        </div>
      </Space>
    </Card>
  );
};
