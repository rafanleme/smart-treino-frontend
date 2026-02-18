import { Typography, Button, Card, Descriptions, Spin, Empty } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { assessmentService } from '../services/assessmentService';
import type { PhysicalAssessment } from '../types';
import { message } from 'antd';

const { Title } = Typography;

export function AssessmentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [assessment, setAssessment] = useState<PhysicalAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const response = await assessmentService.get(Number(id));
        setAssessment(response.data.data);
      } catch (error: any) {
        const errorMsg = error.response?.data?.message || 'Erro ao carregar avaliação';
        message.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" description="Carregando avaliação..." />
      </div>
    );
  }

  if (!assessment) {
    return (
      <Empty description="Avaliação não encontrada">
        <Button onClick={() => navigate('/assessments')}>Voltar</Button>
      </Empty>
    );
  }

  const formatValue = (value: number | null | undefined, suffix: string) => {
    return value ? `${value} ${suffix}` : '-';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/assessments')}
            style={{ marginRight: 16 }}
          >
            Voltar
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            Avaliação de {new Date(assessment.assessed_at).toLocaleDateString('pt-BR')}
          </Title>
        </div>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => navigate(`/assessments/${id}/edit`)}
        >
          Editar
        </Button>
      </div>

      <Card title="Dados Gerais" style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2, md: 4 }}>
          <Descriptions.Item label="Data">
            {new Date(assessment.assessed_at).toLocaleDateString('pt-BR')}
          </Descriptions.Item>
          <Descriptions.Item label="Peso">
            {formatValue(assessment.weight_kg, 'kg')}
          </Descriptions.Item>
          <Descriptions.Item label="Altura">
            {formatValue(assessment.height_cm, 'cm')}
          </Descriptions.Item>
          <Descriptions.Item label="% Gordura">
            {formatValue(assessment.body_fat_pct, '%')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Tronco" style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="Peito">
            {formatValue(assessment.chest_cm, 'cm')}
          </Descriptions.Item>
          <Descriptions.Item label="Cintura">
            {formatValue(assessment.waist_cm, 'cm')}
          </Descriptions.Item>
          <Descriptions.Item label="Quadril">
            {formatValue(assessment.hip_cm, 'cm')}
          </Descriptions.Item>
          <Descriptions.Item label="Pescoço">
            {formatValue(assessment.neck_cm, 'cm')}
          </Descriptions.Item>
          <Descriptions.Item label="Ombros">
            {formatValue(assessment.shoulder_cm, 'cm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Membros Superiores" style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="Braço Esquerdo">
            {formatValue(assessment.left_arm_cm, 'cm')}
          </Descriptions.Item>
          <Descriptions.Item label="Braço Direito">
            {formatValue(assessment.right_arm_cm, 'cm')}
          </Descriptions.Item>
          <Descriptions.Item label="Antebraço">
            {formatValue(assessment.forearm_cm, 'cm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Membros Inferiores" style={{ marginBottom: 16 }}>
        <Descriptions column={{ xs: 1, sm: 2, md: 4 }}>
          <Descriptions.Item label="Coxa Esquerda">
            {formatValue(assessment.left_thigh_cm, 'cm')}
          </Descriptions.Item>
          <Descriptions.Item label="Coxa Direita">
            {formatValue(assessment.right_thigh_cm, 'cm')}
          </Descriptions.Item>
          <Descriptions.Item label="Panturrilha Esquerda">
            {formatValue(assessment.left_calf_cm, 'cm')}
          </Descriptions.Item>
          <Descriptions.Item label="Panturrilha Direita">
            {formatValue(assessment.right_calf_cm, 'cm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {assessment.notes && (
        <Card title="Observações">
          <p style={{ whiteSpace: 'pre-wrap' }}>{assessment.notes}</p>
        </Card>
      )}
    </div>
  );
}
