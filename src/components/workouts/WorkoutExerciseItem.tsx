import { useState, useEffect } from 'react';
import { Card, Typography, Tag, Button, Input, Space } from 'antd';
import { DeleteOutlined, HolderOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { WorkoutExercise } from '../../types';
import { SetsRepsInput } from './SetsRepsInput';

const { Text } = Typography;
const { TextArea } = Input;

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

interface WorkoutExerciseItemProps {
  workoutExercise: WorkoutExercise;
  onUpdate: (id: number, data: Partial<WorkoutExercise>) => void;
  onRemove: (id: number) => void;
}

export function WorkoutExerciseItem({ workoutExercise, onUpdate, onRemove }: WorkoutExerciseItemProps) {
  const [localNotes, setLocalNotes] = useState(workoutExercise.notes || '');
  const [localSets, setLocalSets] = useState<number>(workoutExercise.sets);
  const [localReps, setLocalReps] = useState<string>(workoutExercise.reps);
  const [localRest, setLocalRest] = useState<number>(workoutExercise.rest_seconds);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: workoutExercise.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const exercise = workoutExercise.exercise;
  if (!exercise) return null;

  // Sync local state when workoutExercise changes externally
  useEffect(() => {
    setLocalNotes(workoutExercise.notes || '');
    setLocalSets(workoutExercise.sets);
    setLocalReps(workoutExercise.reps);
    setLocalRest(workoutExercise.rest_seconds);
  }, [workoutExercise.notes, workoutExercise.sets, workoutExercise.reps, workoutExercise.rest_seconds]);

  // Save notes to API only when user leaves the field
  const handleNotesBlur = () => {
    if (localNotes !== (workoutExercise.notes || '')) {
      onUpdate(workoutExercise.id, { notes: localNotes });
    }
  };

  // Save sets, reps, rest to API only when user leaves the field
  const handleSetsBlur = () => {
    if (localSets !== workoutExercise.sets) {
      onUpdate(workoutExercise.id, { sets: localSets });
    }
  };

  const handleRepsBlur = () => {
    if (localReps !== workoutExercise.reps) {
      onUpdate(workoutExercise.id, { reps: localReps });
    }
  };

  const handleRestBlur = () => {
    if (localRest !== workoutExercise.rest_seconds) {
      onUpdate(workoutExercise.id, { rest_seconds: localRest });
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        size="small"
        style={{ marginBottom: 8 }}
        title={
          <Space>
            <HolderOutlined
              {...attributes}
              {...listeners}
              style={{ cursor: 'grab', fontSize: 16 }}
            />
            <Text strong>{exercise.name_pt}</Text>
            <Tag color={muscleGroupColors[exercise.muscle_group]}>
              {muscleGroupLabels[exercise.muscle_group]}
            </Tag>
          </Space>
        }
        extra={
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onRemove(workoutExercise.id)}
          >
            Remover
          </Button>
        }
      >
        <Space orientation="vertical" style={{ width: '100%' }}>
          <SetsRepsInput
            sets={localSets}
            reps={localReps}
            restSeconds={localRest}
            onSetsChange={(value) => value !== null && setLocalSets(value)}
            onRepsChange={(value) => setLocalReps(value)}
            onRestChange={(value) => value !== null && setLocalRest(value)}
            onSetsBlur={handleSetsBlur}
            onRepsBlur={handleRepsBlur}
            onRestBlur={handleRestBlur}
          />

          <TextArea
            placeholder="Notas (opcional)..."
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            onBlur={handleNotesBlur}
            autoSize={{ minRows: 1, maxRows: 3 }}
          />
        </Space>
      </Card>
    </div>
  );
}
