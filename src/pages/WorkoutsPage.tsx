import { Typography, Button, Row, Col, Empty, Skeleton, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useWorkouts } from '../hooks/useWorkouts';
import { WorkoutCard } from '../components/workouts/WorkoutCard';

const { Title } = Typography;

export function WorkoutsPage() {
  const navigate = useNavigate();
  const { workouts, loading, deleteWorkout, duplicateWorkout } = useWorkouts();

  const handleEdit = (id: number) => {
    navigate(`/workouts/${id}/edit`);
  };

  const handleDuplicate = async (id: number) => {
    try {
      const newWorkout = await duplicateWorkout(id);
      navigate(`/workouts/${newWorkout.id}/edit`);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteWorkout(id);
    } catch (error) {
      // Error already handled in hook
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Treinos</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/workouts/new')}
          data-cy="new-workout-btn"
        >
          Novo Treino
        </Button>
      </div>

      {loading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Col key={index} xs={24}>
              <Card>
                <Skeleton active title paragraph={{ rows: 4 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : workouts.length === 0 ? (
        <Empty
          description="Nenhum treino criado ainda"
          style={{ padding: 48 }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/workouts/new')}
            data-cy="create-first-workout-btn"
          >
            Criar Primeiro Treino
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {workouts.map(workout => (
            <Col key={workout.id} xs={24}>
              <WorkoutCard
                workout={workout}
                onEdit={() => handleEdit(workout.id)}
                onDuplicate={() => handleDuplicate(workout.id)}
                onDelete={() => handleDelete(workout.id)}
              />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
