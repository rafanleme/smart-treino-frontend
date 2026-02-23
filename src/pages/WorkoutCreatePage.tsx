import { useState } from 'react';
import { App, Typography, Form, Input, InputNumber, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services/workoutService';

const { Title } = Typography;
const { TextArea } = Input;

export function WorkoutCreatePage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await workoutService.create(values);
      message.success('Treino criado com sucesso');
      navigate(`/workouts/${response.data.data.id}/edit`);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao criar treino');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={3}>Novo Treino</Title>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Nome do Treino"
            rules={[{ required: true, message: 'Por favor, insira o nome do treino' }]}
          >
            <Input placeholder="Ex: Treino A - Push" data-cy="workout-name-input" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Descrição"
          >
            <TextArea
              rows={4}
              placeholder="Descreva o objetivo deste treino..."
              data-cy="workout-description-input"
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
              data-cy="workout-duration-input"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block data-cy="submit-workout-btn">
              Criar Treino
            </Button>
            <Button
              style={{ marginTop: 8 }}
              onClick={() => navigate('/workouts')}
              block
              data-cy="cancel-btn"
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
