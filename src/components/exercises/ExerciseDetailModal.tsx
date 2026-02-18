import { Modal, Descriptions, Tag, Image, Typography } from 'antd';
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

const difficultyLabels: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
};

const exerciseTypeLabels: Record<string, string> = {
  strength: 'Força',
  cardio: 'Cardio',
  stretching: 'Alongamento',
  plyometrics: 'Pliometria',
};

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  open: boolean;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise, open, onClose }: ExerciseDetailModalProps) {
  if (!exercise) return null;

  return (
    <Modal
      title={exercise.name_pt}
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {exercise.image_url && (
        <div style={{ marginBottom: 16, textAlign: 'center' }}>
          <Image
            src={exercise.image_url}
            alt={exercise.name_pt}
            style={{ maxHeight: 300, objectFit: 'cover' }}
          />
        </div>
      )}

      <Descriptions column={1} bordered>
        <Descriptions.Item label="Nome em inglês">
          {exercise.name}
        </Descriptions.Item>

        <Descriptions.Item label="Grupo muscular principal">
          <Tag color={muscleGroupColors[exercise.muscle_group]}>
            {muscleGroupLabels[exercise.muscle_group]}
          </Tag>
        </Descriptions.Item>

        {exercise.secondary_muscles && exercise.secondary_muscles.length > 0 && (
          <Descriptions.Item label="Músculos secundários">
            {exercise.secondary_muscles.map(muscle => (
              <Tag key={muscle} color={muscleGroupColors[muscle]} style={{ marginBottom: 4 }}>
                {muscleGroupLabels[muscle]}
              </Tag>
            ))}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Equipamento">
          {equipmentLabels[exercise.equipment]}
        </Descriptions.Item>

        <Descriptions.Item label="Dificuldade">
          {difficultyLabels[exercise.difficulty]}
        </Descriptions.Item>

        <Descriptions.Item label="Tipo de exercício">
          {exerciseTypeLabels[exercise.exercise_type]}
        </Descriptions.Item>

        {exercise.description_pt && (
          <Descriptions.Item label="Descrição">
            <Text>{exercise.description_pt}</Text>
          </Descriptions.Item>
        )}

        {exercise.is_custom && (
          <Descriptions.Item label="Tipo">
            <Tag color="blue">Exercício Customizado</Tag>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
}
