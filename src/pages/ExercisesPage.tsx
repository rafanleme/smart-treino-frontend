import { useState } from 'react';
import { Typography } from 'antd';
import { useExercises } from '../hooks/useExercises';
import {
  ExerciseFilterBar,
  ExerciseList,
  ExerciseDetailModal,
} from '../components/exercises';
import type { Exercise } from '../types';

const { Title } = Typography;

export function ExercisesPage() {
  const {
    exercises,
    loading,
    currentPage,
    lastPage,
    perPage,
    total,
    filters,
    setFilters,
    setPage,
  } = useExercises();

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedExercise(null);
  };

  return (
    <div>
      <Title level={3}>Exercícios</Title>

      <ExerciseFilterBar
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ExerciseList
        exercises={exercises}
        loading={loading}
        currentPage={currentPage}
        lastPage={lastPage}
        perPage={perPage}
        total={total}
        onPageChange={setPage}
        onExerciseClick={handleExerciseClick}
      />

      <ExerciseDetailModal
        exercise={selectedExercise}
        open={modalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
