import { useState } from 'react';
import { Typography, Form, Select, Checkbox, InputNumber, Input, Button, Card, Row, Col, Spin, Alert, Collapse, message, Space, Divider } from 'antd';
import { RobotOutlined, ThunderboltOutlined, SaveOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { aiService, type GenerateWorkoutRequest, type GeneratedWorkout } from '../services/aiService';
import { workoutService } from '../services/workoutService';
import { exerciseService } from '../services/exerciseService';
import type { Exercise } from '../types';
import { useEffect } from 'react';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const muscleGroupOptions = [
  { label: 'Peito', value: 'chest' },
  { label: 'Costas', value: 'back' },
  { label: 'Pernas', value: 'legs' },
  { label: 'Ombros', value: 'shoulders' },
  { label: 'Bíceps', value: 'biceps' },
  { label: 'Tríceps', value: 'triceps' },
  { label: 'Abdômen', value: 'abs' },
  { label: 'Glúteos', value: 'glutes' },
  { label: 'Panturrilhas', value: 'calves' },
  { label: 'Antebraços', value: 'forearms' },
];

const loadingMessages = [
  'Analisando seu histórico...',
  'Selecionando exercícios ideais...',
  'Calculando volume e intensidade...',
  'Montando o treino perfeito...',
];

export function AiBuilderPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedWorkout, setGeneratedWorkout] = useState<GeneratedWorkout | null>(null);
  const [exerciseMap, setExerciseMap] = useState<Map<number, Exercise>>(new Map());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch exercises for mapping IDs to names
    const fetchExercises = async () => {
      try {
        const response = await exerciseService.list({ perPage: 1000 } as any);
        const map = new Map<number, Exercise>();
        response.data.data.forEach((exercise) => {
          map.set(exercise.id, exercise);
        });
        console.log('📚 Exercise map loaded:', map.size, 'exercises');
        console.log('Sample IDs:', Array.from(map.keys()).slice(0, 10));
        setExerciseMap(map);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        message.error('Erro ao carregar exercícios');
      }
    };

    fetchExercises();
  }, []);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleGenerate = async (values: GenerateWorkoutRequest) => {
    setLoading(true);
    setGeneratedWorkout(null);
    setLoadingMessageIndex(0);

    try {
      const response = await aiService.generateWorkout(values);
      const workout = response.data.data;
      console.log('🤖 Generated workout:', workout);
      console.log('Exercise IDs from AI:', workout.exercises.map((e: any) => e.exercise_id));
      setGeneratedWorkout(workout);
      message.success('Treino gerado com sucesso pela IA!');
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao gerar treino');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!generatedWorkout) return;

    setSaving(true);
    try {
      // Create workout
      const workoutResponse = await workoutService.create({
        name: generatedWorkout.name,
        description: generatedWorkout.description,
        estimated_duration_min: generatedWorkout.estimated_duration_min,
      });

      const workoutId = workoutResponse.data.data.id;

      // Add exercises to workout
      for (const exercise of generatedWorkout.exercises) {
        await workoutService.addExercise(workoutId, {
          exercise_id: exercise.exercise_id,
          sets: exercise.sets,
          reps: exercise.reps,
          rest_seconds: exercise.rest_seconds,
          notes: exercise.notes || exercise.ai_reasoning,
        });
      }

      message.success('Treino salvo com sucesso!');
      navigate(`/workouts/${workoutId}/edit`);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao salvar treino');
    } finally {
      setSaving(false);
    }
  };

  const handleEditBeforeSave = () => {
    if (!generatedWorkout) return;

    // Navigate to create page with pre-filled data
    // We'll save it first and then redirect to edit
    handleSave();
  };

  const handleGenerateAgain = () => {
    setGeneratedWorkout(null);
    form.submit(); // Re-submit form
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={3}>
          <RobotOutlined /> Gerador de Treinos com IA
        </Title>
        <Paragraph type="secondary">
          Use inteligência artificial para criar treinos personalizados baseados no seu histórico e objetivos.
        </Paragraph>
      </div>

      {!generatedWorkout && !loading && (
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleGenerate}
            initialValues={{
              goal: 'hypertrophy',
              difficulty: 'intermediate',
              duration_minutes: 60,
            }}
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Objetivo do Treino"
                  name="goal"
                  rules={[{ required: true, message: 'Selecione o objetivo' }]}
                >
                  <Select
                    size="large"
                    options={[
                      { label: 'Hipertrofia (Ganho de Massa)', value: 'hypertrophy' },
                      { label: 'Força Máxima', value: 'strength' },
                      { label: 'Resistência Muscular', value: 'endurance' },
                    ]}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Nível de Dificuldade"
                  name="difficulty"
                  rules={[{ required: true, message: 'Selecione a dificuldade' }]}
                >
                  <Select
                    size="large"
                    options={[
                      { label: 'Iniciante', value: 'beginner' },
                      { label: 'Intermediário', value: 'intermediate' },
                      { label: 'Avançado', value: 'advanced' },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Grupos Musculares (opcional - deixe vazio para treino completo)"
              name="muscle_groups"
            >
              <Checkbox.Group options={muscleGroupOptions} />
            </Form.Item>

            <Form.Item
              label="Duração Estimada (minutos)"
              name="duration_minutes"
            >
              <InputNumber
                min={15}
                max={180}
                step={15}
                style={{ width: '100%' }}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Observações (lesões, limitações, preferências)"
              name="notes"
            >
              <TextArea
                rows={4}
                placeholder="Ex: lesão no ombro direito, sem equipamento de barra, prefiro exercícios com halteres..."
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<ThunderboltOutlined />}
                block
              >
                Gerar Treino com IA
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" />
            <Title level={4} style={{ marginTop: 24 }}>
              {loadingMessages[loadingMessageIndex]}
            </Title>
            <Paragraph type="secondary">
              A IA está criando o treino perfeito para você...
            </Paragraph>
          </div>
        </Card>
      )}

      {generatedWorkout && !loading && (
        <div>
          <Alert
            message="Treino gerado com sucesso!"
            description={generatedWorkout.ai_notes}
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Card
            title={
              <Space>
                <RobotOutlined />
                <span>{generatedWorkout.name}</span>
              </Space>
            }
            extra={
              <Space>
                <Text type="secondary">
                  {generatedWorkout.estimated_duration_min} min
                </Text>
              </Space>
            }
          >
            {generatedWorkout.description && (
              <Paragraph>{generatedWorkout.description}</Paragraph>
            )}

            <Divider />

            <Title level={5}>Exercícios ({generatedWorkout.exercises.length})</Title>

            <Collapse
              items={generatedWorkout.exercises.map((exercise, index) => {
                const exerciseData = exerciseMap.get(exercise.exercise_id);
                return {
                  key: index,
                  label: (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <Text strong>
                        {index + 1}. {exerciseData?.name_pt || `Exercício #${exercise.exercise_id}`}
                      </Text>
                      <Text type="secondary">
                        {exercise.sets} x {exercise.reps} • {exercise.rest_seconds}s descanso
                      </Text>
                    </div>
                  ),
                  children: (
                    <div>
                      {exerciseData && (
                        <Paragraph type="secondary">
                          <strong>Grupo:</strong> {exerciseData.muscle_group} •
                          <strong> Equipamento:</strong> {exerciseData.equipment} •
                          <strong> Dificuldade:</strong> {exerciseData.difficulty}
                        </Paragraph>
                      )}
                      {exercise.ai_reasoning && (
                        <Alert
                          message="💡 Por que este exercício?"
                          description={exercise.ai_reasoning}
                          type="info"
                          showIcon={false}
                          style={{ marginTop: 8 }}
                        />
                      )}
                      {exercise.notes && exercise.notes !== exercise.ai_reasoning && (
                        <Alert
                          message="📝 Notas"
                          description={exercise.notes}
                          type="warning"
                          showIcon={false}
                          style={{ marginTop: 8 }}
                        />
                      )}
                    </div>
                  ),
                };
              })}
            />

            <Divider />

            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Button
                  type="primary"
                  size="large"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  loading={saving}
                  block
                >
                  Salvar Treino
                </Button>
              </Col>
              <Col xs={24} md={8}>
                <Button
                  size="large"
                  icon={<EditOutlined />}
                  onClick={handleEditBeforeSave}
                  loading={saving}
                  block
                >
                  Editar Antes de Salvar
                </Button>
              </Col>
              <Col xs={24} md={8}>
                <Button
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={handleGenerateAgain}
                  block
                >
                  Gerar Novamente
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      )}
    </div>
  );
}
