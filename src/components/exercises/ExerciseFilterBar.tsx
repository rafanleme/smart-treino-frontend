import { Input, Select, Segmented, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import type { MuscleGroup, Equipment, Difficulty, ExerciseFilters } from '../../types';

const muscleGroupOptions: { value: MuscleGroup; label: string; color: string }[] = [
  { value: 'chest', label: 'Peito', color: 'red' },
  { value: 'back', label: 'Costas', color: 'blue' },
  { value: 'legs', label: 'Pernas', color: 'orange' },
  { value: 'shoulders', label: 'Ombros', color: 'purple' },
  { value: 'biceps', label: 'Bíceps', color: 'cyan' },
  { value: 'triceps', label: 'Tríceps', color: 'geekblue' },
  { value: 'abs', label: 'Abdômen', color: 'green' },
  { value: 'cardio', label: 'Cardio', color: 'volcano' },
  { value: 'glutes', label: 'Glúteos', color: 'magenta' },
  { value: 'forearms', label: 'Antebraços', color: 'gold' },
  { value: 'calves', label: 'Panturrilhas', color: 'lime' },
];

const equipmentOptions: { value: Equipment; label: string }[] = [
  { value: 'barbell', label: 'Barra' },
  { value: 'dumbbell', label: 'Halter' },
  { value: 'machine', label: 'Máquina' },
  { value: 'cable', label: 'Cabo' },
  { value: 'bodyweight', label: 'Peso Corporal' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'band', label: 'Elástico' },
  { value: 'other', label: 'Outro' },
];

const difficultyOptions = [
  { value: 'beginner', label: 'Iniciante' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'advanced', label: 'Avançado' },
];

interface ExerciseFilterBarProps {
  filters: ExerciseFilters;
  onFiltersChange: (filters: ExerciseFilters) => void;
}

export function ExerciseFilterBar({ filters, onFiltersChange }: ExerciseFilterBarProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const filtersRef = useRef(filters);

  // Keep ref in sync with latest filters
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filtersRef.current, search: searchValue || undefined });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, onFiltersChange]);

  const handleMuscleGroupChange = (muscleGroup: MuscleGroup | undefined) => {
    onFiltersChange({ ...filters, muscle_group: muscleGroup });
  };

  const handleEquipmentChange = (equipment: Equipment | undefined) => {
    onFiltersChange({ ...filters, equipment });
  };

  const handleDifficultyChange = (difficulty: string | number) => {
    onFiltersChange({
      ...filters,
      difficulty: difficulty === 'all' ? undefined : difficulty as Difficulty
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <Space orientation="vertical" style={{ width: '100%', marginBottom: 24 }} size="middle">
      {/* Search */}
      <Input
        placeholder="Buscar exercício por nome..."
        allowClear
        prefix={<SearchOutlined />}
        size="large"
        onChange={handleSearchChange}
        value={searchValue}
      />

      {/* Muscle Groups - Chips/Tags */}
      <div>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>Grupo muscular:</div>
        <Space size={[8, 8]} wrap>
          <Tag
            style={{ cursor: 'pointer', padding: '4px 12px' }}
            color={!filters.muscle_group ? 'blue' : undefined}
            onClick={() => handleMuscleGroupChange(undefined)}
          >
            Todos
          </Tag>
          {muscleGroupOptions.map(option => (
            <Tag
              key={option.value}
              style={{ cursor: 'pointer', padding: '4px 12px' }}
              color={filters.muscle_group === option.value ? option.color : undefined}
              onClick={() => handleMuscleGroupChange(option.value)}
            >
              {option.label}
            </Tag>
          ))}
        </Space>
      </div>

      {/* Equipment and Difficulty */}
      <Space size="middle" wrap>
        <div style={{ minWidth: 200 }}>
          <div style={{ marginBottom: 4, fontSize: 13, fontWeight: 500 }}>Equipamento:</div>
          <Select
            placeholder="Selecione o equipamento"
            allowClear
            style={{ width: '100%' }}
            options={equipmentOptions}
            value={filters.equipment}
            onChange={handleEquipmentChange}
          />
        </div>

        <div style={{ minWidth: 300 }}>
          <div style={{ marginBottom: 4, fontSize: 13, fontWeight: 500 }}>Dificuldade:</div>
          <Segmented
            options={[
              { value: 'all', label: 'Todas' },
              ...difficultyOptions,
            ]}
            value={filters.difficulty || 'all'}
            onChange={handleDifficultyChange}
            block
          />
        </div>
      </Space>
    </Space>
  );
}
