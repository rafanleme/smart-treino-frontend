import { useState, useEffect } from 'react';
import { Typography, Form, Input, InputNumber, Button, Card, Space, message, Spin } from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { workoutService } from '../services/workoutService';
import {
  ExercisePicker,
  WorkoutExerciseList,
} from '../components/workouts';
import type { Workout, WorkoutExercise, Exercise } from '../types';

const { Title } = Typography;
const { TextArea } = Input;

export function WorkoutEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Load workout
  useEffect(() => {
    const loadWorkout = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await workoutService.get(Number(id));
        const workoutData = response.data.data;
        setWorkout(workoutData);
        setExercises(workoutData.workout_exercises || []);
        form.setFieldsValue({
          name: workoutData.name,
          description: workoutData.description,
          estimated_duration_min: workoutData.estimated_duration_min,
        });
      } catch (error: any) {
        message.error(error.response?.data?.message || 'Erro ao carregar treino');
        navigate('/workouts');
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [id, navigate, form]);

  const handleSaveMetadata = async (values: any) => {
    if (!id) return;

    setSaving(true);
    try {
      const response = await workoutService.update(Number(id), values);
      setWorkout(response.data.data);
      message.success('Treino atualizado com sucesso');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao atualizar treino');
    } finally {
      setSaving(false);
    }
  };

  const handleAddExercise = async (exercise: Exercise) => {
    if (!id) return;

    try {
      const response = await workoutService.addExercise(Number(id), {
        exercise_id: exercise.id,
      });
      setExercises([...exercises, response.data.data]);
      message.success('Exercício adicionado');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao adicionar exercício');
    }
  };

  const handleUpdateExercise = async (exerciseId: number, data: Partial<WorkoutExercise>) => {
    if (!id) return;

    try {
      const updateData: { sets?: number; reps?: string; rest_seconds?: number; notes?: string } = {
        ...(data.sets !== undefined && { sets: data.sets }),
        ...(data.reps !== undefined && { reps: data.reps }),
        ...(data.rest_seconds !== undefined && { rest_seconds: data.rest_seconds }),
        ...(data.notes !== undefined && data.notes !== null && { notes: data.notes }),
      };

      const response = await workoutService.updateExercise(Number(id), exerciseId, updateData);
      setExercises(exercises.map(ex =>
        ex.id === exerciseId ? response.data.data : ex
      ));
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao atualizar exercício');
    }
  };

  const handleRemoveExercise = async (exerciseId: number) => {
    if (!id) return;

    try {
      await workoutService.removeExercise(Number(id), exerciseId);
      setExercises(exercises.filter(ex => ex.id !== exerciseId));
      message.success('Exercício removido');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao remover exercício');
    }
  };

  const handleReorder = async (newOrder: WorkoutExercise[]) => {
    if (!id) return;

    const updatedExercises = newOrder.map((ex, index) => ({
      ...ex,
      order: index,
    }));

    setExercises(updatedExercises);

    try {
      await workoutService.reorderExercises(
        Number(id),
        updatedExercises.map((ex) => ({
          workout_exercise_id: ex.id,
          order: ex.order,
        }))
      );
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao reordenar exercícios');
      // Revert on error
      setExercises(exercises);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" description="Carregando treino..." />
      </div>
    );
  }

  if (!workout) {
    return null;
  }

  return (
    <div>
      <Title level={3}>Editar Treino</Title>

      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        {/* Workout Metadata */}
        <Card title="Informações do Treino">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSaveMetadata}
          >
            <Form.Item
              name="name"
              label="Nome do Treino"
              rules={[{ required: true, message: 'Por favor, insira o nome do treino' }]}
            >
              <Input placeholder="Ex: Treino A - Push" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Descrição"
            >
              <TextArea
                rows={4}
                placeholder="Descreva o objetivo deste treino..."
              />
            </Form.Item>

            <Form.Item
              name="estimated_duration_min"
              label="Duração Estimada (minutos)"
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                placeholder="60"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                icon={<SaveOutlined />}
              >
                Salvar Informações
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Exercises List */}
        <Card
          title={`Exercícios (${exercises.length})`}
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setPickerOpen(true)}
            >
              Adicionar Exercício
            </Button>
          }
        >
          <WorkoutExerciseList
            exercises={exercises}
            onReorder={handleReorder}
            onUpdate={handleUpdateExercise}
            onRemove={handleRemoveExercise}
          />
        </Card>
      </Space>

      <ExercisePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleAddExercise}
        excludeIds={exercises.map(ex => ex.exercise_id)}
      />
    </div>
  );
}
