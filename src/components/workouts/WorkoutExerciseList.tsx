import { Empty } from 'antd';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { WorkoutExercise } from '../../types';
import { WorkoutExerciseItem } from './WorkoutExerciseItem';

interface WorkoutExerciseListProps {
  exercises: WorkoutExercise[];
  onReorder: (exercises: WorkoutExercise[]) => void;
  onUpdate: (id: number, data: Partial<WorkoutExercise>) => void;
  onRemove: (id: number) => void;
}

export function WorkoutExerciseList({
  exercises,
  onReorder,
  onUpdate,
  onRemove,
}: WorkoutExerciseListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = exercises.findIndex((ex) => ex.id === active.id);
      const newIndex = exercises.findIndex((ex) => ex.id === over.id);

      const newOrder = arrayMove(exercises, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };

  if (exercises.length === 0) {
    return (
      <Empty
        description="Nenhum exercício adicionado ainda"
        style={{ padding: 48 }}
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={exercises.map(ex => ex.id)}
        strategy={verticalListSortingStrategy}
      >
        {exercises.map((exercise) => (
          <WorkoutExerciseItem
            key={exercise.id}
            workoutExercise={exercise}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
