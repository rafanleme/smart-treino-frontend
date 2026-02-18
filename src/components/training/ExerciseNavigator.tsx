import { Badge, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import type { SessionExercise } from '../../types';

const { Text } = Typography;

interface ExerciseNavigatorProps {
  exercises: SessionExercise[];
  currentIndex: number;
  onSelectExercise: (index: number) => void;
}

const statusIcons = {
  pending: <ClockCircleOutlined style={{ color: '#999' }} />,
  in_progress: <ClockCircleOutlined style={{ color: '#1890ff' }} />,
  completed: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  skipped: <MinusCircleOutlined style={{ color: '#999' }} />,
};

const statusColors = {
  pending: 'default',
  in_progress: 'processing',
  completed: 'success',
  skipped: 'default',
} as const;

export function ExerciseNavigator({
  exercises,
  currentIndex,
  onSelectExercise,
}: ExerciseNavigatorProps) {
  return (
    <div>
      {exercises.map((exercise, index) => (
        <div
          key={exercise.id}
          style={{
            cursor: 'pointer',
            backgroundColor: index === currentIndex ? '#e6f7ff' : 'transparent',
            padding: '8px 16px',
            borderBottom: '1px solid #f0f0f0',
            transition: 'background-color 0.2s',
          }}
          onClick={() => onSelectExercise(index)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Badge status={statusColors[exercise.status]} />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong={index === currentIndex}>{exercise.exercise_name}</Text>
                {statusIcons[exercise.status]}
              </div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {exercise.target_sets}x{exercise.target_reps}
              </Text>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
