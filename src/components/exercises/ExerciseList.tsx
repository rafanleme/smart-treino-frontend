import { Row, Col, Pagination, Empty, Skeleton, Card } from 'antd';
import type { Exercise } from '../../types';
import { ExerciseCard } from './ExerciseCard';

interface ExerciseListProps {
  exercises: Exercise[];
  loading: boolean;
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onExerciseClick: (exercise: Exercise) => void;
}

export function ExerciseList({
  exercises,
  loading,
  currentPage,
  lastPage,
  perPage,
  total,
  onPageChange,
  onExerciseClick,
}: ExerciseListProps) {
  if (loading) {
    return (
      <Row gutter={[16, 16]}>
        {Array.from({ length: perPage }).map((_, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
            <Card>
              <Skeleton active avatar paragraph={{ rows: 3 }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (exercises.length === 0) {
    return (
      <Empty
        description="Nenhum exercício encontrado"
        style={{ padding: 48 }}
      />
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {exercises.map(exercise => (
          <Col
            key={exercise.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            xl={6}
          >
            <ExerciseCard
              exercise={exercise}
              onClick={() => onExerciseClick(exercise)}
            />
          </Col>
        ))}
      </Row>

      {lastPage > 1 && (
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Pagination
            current={currentPage}
            total={total}
            pageSize={perPage}
            onChange={onPageChange}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} de ${total} exercícios`
            }
          />
        </div>
      )}
    </div>
  );
}
