import { Card, Tag, Typography } from 'antd';
import type { Exercise } from '../../types';

const { Text } = Typography;

const muscleGroupColors: Record<string, string> = {
  chest: 'red',
  back: 'blue',
  legs: 'orange',
  shoulders: 'purple',
  biceps: 'cyan',
  triceps: 'geekblue',
  abs: 'green',
  cardio: 'volcano',
  glutes: 'magenta',
  forearms: 'gold',
  calves: 'lime',
};

const muscleGroupLabels: Record<string, string> = {
  chest: 'Peito',
  back: 'Costas',
  legs: 'Pernas',
  shoulders: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  abs: 'Abdômen',
  cardio: 'Cardio',
  glutes: 'Glúteos',
  forearms: 'Antebraços',
  calves: 'Panturrilhas',
};

const equipmentLabels: Record<string, string> = {
  barbell: 'Barra',
  dumbbell: 'Halter',
  machine: 'Máquina',
  cable: 'Cabo',
  bodyweight: 'Peso Corporal',
  kettlebell: 'Kettlebell',
  band: 'Elástico',
  other: 'Outro',
};

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: () => void;
}

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ height: '100%' }}
      styles={{ body: { padding: 16 } }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Tag color={muscleGroupColors[exercise.muscle_group]}>
          {muscleGroupLabels[exercise.muscle_group]}
        </Tag>

        <Text strong style={{ fontSize: 16 }}>
          {exercise.name_pt}
        </Text>

        <Text type="secondary" style={{ fontSize: 13 }}>
          {equipmentLabels[exercise.equipment]}
        </Text>
      </div>
    </Card>
  );
}
