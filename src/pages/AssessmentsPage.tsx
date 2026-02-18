import { Typography, Button, Card, Row, Col, Empty, Spin, Tag, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAssessments } from '../hooks/useAssessments';

const { Title, Text } = Typography;

export function AssessmentsPage() {
  const navigate = useNavigate();
  const { assessments, loading, deleteAssessment } = useAssessments();

  const handleDelete = async (id: number) => {
    try {
      await deleteAssessment(id);
    } catch (error) {
      // Error already handled in hook
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 48 }}>
        <Spin size="large" description="Carregando avaliações..." />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Avaliações Físicas</Title>
        <div>
          <Button onClick={() => navigate('/assessments/compare')} style={{ marginRight: 8 }}>
            Comparar
          </Button>
          <Button onClick={() => navigate('/assessments/progress')} style={{ marginRight: 8 }}>
            Ver Progresso
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/assessments/new')}>
            Nova Avaliação
          </Button>
        </div>
      </div>

      {assessments.length === 0 ? (
        <Empty description="Nenhuma avaliação registrada" style={{ padding: 48 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/assessments/new')}>
            Criar Primeira Avaliação
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {assessments.map((assessment) => (
            <Col key={assessment.id} xs={24} sm={12} lg={8}>
              <Card
                title={new Date(assessment.assessed_at).toLocaleDateString('pt-BR')}
                extra={
                  <div>
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => navigate(`/assessments/${assessment.id}`)}
                    />
                    <Popconfirm
                      title="Excluir avaliação?"
                      onConfirm={() => handleDelete(assessment.id)}
                      okText="Sim"
                      cancelText="Não"
                      okButtonProps={{ danger: true }}
                    >
                      <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </div>
                }
              >
                {assessment.weight_kg && (
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Peso: </Text>
                    <Tag color="blue">{assessment.weight_kg} kg</Tag>
                  </div>
                )}
                {assessment.body_fat_pct && (
                  <div style={{ marginBottom: 8 }}>
                    <Text strong>Gordura: </Text>
                    <Tag color="orange">{assessment.body_fat_pct}%</Tag>
                  </div>
                )}
                {assessment.notes && (
                  <Text type="secondary" ellipsis>{assessment.notes}</Text>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
