import { App, Typography, Button, Card, Select, Row, Col, Spin, Empty, Descriptions, Tag } from 'antd';
import { ArrowLeftOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { assessmentService } from '../services/assessmentService';
import { useAssessments } from '../hooks/useAssessments';
import type { AssessmentComparison, AssessmentDelta } from '../types';

const { Title, Text } = Typography;

export function AssessmentComparePage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { assessments, loading: loadingAssessments } = useAssessments();
  const [fromId, setFromId] = useState<number | null>(null);
  const [toId, setToId] = useState<number | null>(null);
  const [comparison, setComparison] = useState<AssessmentComparison | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fromId && toId && fromId !== toId) {
      fetchComparison();
    } else {
      setComparison(null);
    }
  }, [fromId, toId]);

  const fetchComparison = async () => {
    if (!fromId || !toId) return;

    setLoading(true);
    try {
      const response = await assessmentService.compare(fromId, toId);
      setComparison(response.data.data);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao comparar avaliações';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatValue = (value: number | null | undefined, suffix: string) => {
    return value ? `${value} ${suffix}` : '-';
  };

  const renderDelta = (delta: AssessmentDelta | undefined, suffix: string) => {
    if (!delta) return null;

    const isPositive = delta.delta > 0;
    const isNegative = delta.delta < 0;
    const color = isPositive ? 'green' : isNegative ? 'red' : 'default';

    return (
      <div style={{ marginTop: 4 }}>
        <Tag color={color} icon={isPositive ? <ArrowUpOutlined /> : isNegative ? <ArrowDownOutlined /> : null}>
          {isPositive ? '+' : ''}{delta.delta.toFixed(1)} {suffix} ({isPositive ? '+' : ''}{delta.delta_pct.toFixed(1)}%)
        </Tag>
      </div>
    );
  };

  const assessmentOptions = assessments.map(a => ({
    value: a.id,
    label: formatDate(a.assessed_at),
  }));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/assessments')}
          style={{ marginRight: 16 }}
        >
          Voltar
        </Button>
        <Title level={3} style={{ margin: 0 }}>Comparar Avaliações</Title>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Avaliação Anterior
              </label>
              <Select
                style={{ width: '100%' }}
                placeholder="Selecione uma avaliação"
                value={fromId}
                onChange={setFromId}
                options={assessmentOptions}
                loading={loadingAssessments}
              />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Avaliação Atual
              </label>
              <Select
                style={{ width: '100%' }}
                placeholder="Selecione uma avaliação"
                value={toId}
                onChange={setToId}
                options={assessmentOptions}
                loading={loadingAssessments}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" description="Comparando avaliações..." />
        </div>
      ) : !comparison ? (
        <Empty description="Selecione duas avaliações diferentes para comparar" />
      ) : (
        <>
          <Card title="Dados Gerais" style={{ marginBottom: 16 }}>
            <Descriptions column={{ xs: 1, sm: 2, md: 4 }} bordered>
              <Descriptions.Item label="Peso">
                <div>
                  <Text>{formatValue(comparison.from.weight_kg, 'kg')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.weight_kg, 'kg')}</Text>
                  {renderDelta(comparison.deltas.weight_kg, 'kg')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Altura">
                <div>
                  <Text>{formatValue(comparison.from.height_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.height_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.height_cm, 'cm')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="% Gordura">
                <div>
                  <Text>{formatValue(comparison.from.body_fat_pct, '%')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.body_fat_pct, '%')}</Text>
                  {renderDelta(comparison.deltas.body_fat_pct, '%')}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Tronco" style={{ marginBottom: 16 }}>
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
              <Descriptions.Item label="Peito">
                <div>
                  <Text>{formatValue(comparison.from.chest_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.chest_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.chest_cm, 'cm')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Cintura">
                <div>
                  <Text>{formatValue(comparison.from.waist_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.waist_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.waist_cm, 'cm')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Quadril">
                <div>
                  <Text>{formatValue(comparison.from.hip_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.hip_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.hip_cm, 'cm')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Pescoço">
                <div>
                  <Text>{formatValue(comparison.from.neck_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.neck_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.neck_cm, 'cm')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Ombros">
                <div>
                  <Text>{formatValue(comparison.from.shoulder_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.shoulder_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.shoulder_cm, 'cm')}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Membros Superiores" style={{ marginBottom: 16 }}>
            <Descriptions column={{ xs: 1, sm: 2, md: 3 }} bordered>
              <Descriptions.Item label="Braço Esquerdo">
                <div>
                  <Text>{formatValue(comparison.from.left_arm_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.left_arm_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.left_arm_cm, 'cm')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Braço Direito">
                <div>
                  <Text>{formatValue(comparison.from.right_arm_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.right_arm_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.right_arm_cm, 'cm')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Antebraço">
                <div>
                  <Text>{formatValue(comparison.from.forearm_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.forearm_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.forearm_cm, 'cm')}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Membros Inferiores">
            <Descriptions column={{ xs: 1, sm: 2, md: 4 }} bordered>
              <Descriptions.Item label="Coxa Esquerda">
                <div>
                  <Text>{formatValue(comparison.from.left_thigh_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.left_thigh_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.left_thigh_cm, 'cm')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Coxa Direita">
                <div>
                  <Text>{formatValue(comparison.from.right_thigh_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.right_thigh_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.right_thigh_cm, 'cm')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Panturrilha Esquerda">
                <div>
                  <Text>{formatValue(comparison.from.left_calf_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.left_calf_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.left_calf_cm, 'cm')}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Panturrilha Direita">
                <div>
                  <Text>{formatValue(comparison.from.right_calf_cm, 'cm')}</Text>
                  <Text type="secondary"> → </Text>
                  <Text strong>{formatValue(comparison.to.right_calf_cm, 'cm')}</Text>
                  {renderDelta(comparison.deltas.right_calf_cm, 'cm')}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </>
      )}
    </div>
  );
}
