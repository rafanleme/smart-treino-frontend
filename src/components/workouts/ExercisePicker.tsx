import { Modal, Input, Tag, Empty, Spin, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useExercises } from '../../hooks/useExercises';
import type { Exercise } from '../../types';

const { Search } = Input;
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

interface ExercisePickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (exercise: Exercise) => void;
  excludeIds?: number[];
}

export function ExercisePicker({ open, onClose, onSelect, excludeIds = [] }: ExercisePickerProps) {
  const { exercises, loading, setFilters } = useExercises();

  const handleSearch = (value: string) => {
    setFilters({ search: value || undefined });
  };

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    onClose();
    setFilters({});
  };

  const filteredExercises = exercises.filter(ex => !excludeIds.includes(ex.id));

  return (
    <Modal
      title="Adicionar Exercício"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Search
        placeholder="Buscar exercício..."
        allowClear
        enterButton={<SearchOutlined />}
        onSearch={handleSearch}
        style={{ marginBottom: 16 }}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin description="Carregando exercícios..." />
        </div>
      ) : filteredExercises.length === 0 ? (
        <Empty description="Nenhum exercício encontrado" />
      ) : (
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              style={{
                cursor: 'pointer',
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                transition: 'background-color 0.2s',
              }}
              onClick={() => handleSelect(exercise)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div>
                    <Text strong>{exercise.name_pt}</Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {exercise.name}
                    </Text>
                  </div>
                </div>
                <Tag color={muscleGroupColors[exercise.muscle_group]}>
                  {muscleGroupLabels[exercise.muscle_group]}
                </Tag>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
