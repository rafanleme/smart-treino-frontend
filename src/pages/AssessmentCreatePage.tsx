import { Typography, Button, Card, Form, Row, Col, DatePicker, Input, message } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { assessmentService } from '../services/assessmentService';
import { MeasurementField } from '../components/assessments/MeasurementField';
import type { PhysicalAssessment } from '../types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export function AssessmentCreatePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const data: Partial<PhysicalAssessment> = {
        assessed_at: values.assessed_at.format('YYYY-MM-DD'),
        weight_kg: values.weight_kg,
        height_cm: values.height_cm,
        body_fat_pct: values.body_fat_pct,
        chest_cm: values.chest_cm,
        waist_cm: values.waist_cm,
        hip_cm: values.hip_cm,
        left_arm_cm: values.left_arm_cm,
        right_arm_cm: values.right_arm_cm,
        left_thigh_cm: values.left_thigh_cm,
        right_thigh_cm: values.right_thigh_cm,
        left_calf_cm: values.left_calf_cm,
        right_calf_cm: values.right_calf_cm,
        neck_cm: values.neck_cm,
        shoulder_cm: values.shoulder_cm,
        forearm_cm: values.forearm_cm,
        notes: values.notes,
      };

      await assessmentService.create(data);
      message.success('Avaliação criada com sucesso!');
      navigate('/assessments');
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao criar avaliação';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

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
        <Title level={3} style={{ margin: 0 }}>Nova Avaliação Física</Title>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            assessed_at: dayjs(),
          }}
        >
          {/* Seção Geral */}
          <Title level={5}>Dados Gerais</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                name="assessed_at"
                label="Data da Avaliação"
                rules={[{ required: true, message: 'Data é obrigatória' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <MeasurementField
                name="weight_kg"
                label="Peso"
                suffix="kg"
                min={20}
                max={300}
                step={0.1}
                precision={1}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <MeasurementField
                name="height_cm"
                label="Altura"
                suffix="cm"
                min={100}
                max={250}
                step={0.5}
                precision={1}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <MeasurementField
                name="body_fat_pct"
                label="% Gordura"
                suffix="%"
                min={3}
                max={60}
                step={0.1}
                precision={1}
              />
            </Col>
          </Row>

          {/* Seção Tronco */}
          <Title level={5} style={{ marginTop: 24 }}>Tronco</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <MeasurementField
                name="chest_cm"
                label="Peito"
                suffix="cm"
                min={50}
                max={200}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <MeasurementField
                name="waist_cm"
                label="Cintura"
                suffix="cm"
                min={40}
                max={200}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <MeasurementField
                name="hip_cm"
                label="Quadril"
                suffix="cm"
                min={50}
                max={200}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <MeasurementField
                name="neck_cm"
                label="Pescoço"
                suffix="cm"
                min={20}
                max={60}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <MeasurementField
                name="shoulder_cm"
                label="Ombros"
                suffix="cm"
                min={60}
                max={200}
              />
            </Col>
          </Row>

          {/* Seção Membros Superiores */}
          <Title level={5} style={{ marginTop: 24 }}>Membros Superiores</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <MeasurementField
                name="left_arm_cm"
                label="Braço Esquerdo"
                suffix="cm"
                min={15}
                max={80}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <MeasurementField
                name="right_arm_cm"
                label="Braço Direito"
                suffix="cm"
                min={15}
                max={80}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <MeasurementField
                name="forearm_cm"
                label="Antebraço"
                suffix="cm"
                min={15}
                max={50}
              />
            </Col>
          </Row>

          {/* Seção Membros Inferiores */}
          <Title level={5} style={{ marginTop: 24 }}>Membros Inferiores</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <MeasurementField
                name="left_thigh_cm"
                label="Coxa Esquerda"
                suffix="cm"
                min={30}
                max={120}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <MeasurementField
                name="right_thigh_cm"
                label="Coxa Direita"
                suffix="cm"
                min={30}
                max={120}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <MeasurementField
                name="left_calf_cm"
                label="Panturrilha Esquerda"
                suffix="cm"
                min={20}
                max={70}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <MeasurementField
                name="right_calf_cm"
                label="Panturrilha Direita"
                suffix="cm"
                min={20}
                max={70}
              />
            </Col>
          </Row>

          {/* Observações */}
          <Title level={5} style={{ marginTop: 24 }}>Observações</Title>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="notes" label="Notas">
                <Input.TextArea
                  rows={4}
                  placeholder="Observações adicionais sobre a avaliação..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Botões */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 24 }}>
            <Button onClick={() => navigate('/assessments')}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
              Salvar Avaliação
            </Button>
          </div>
        </Form>
      </Card>

      <div style={{ marginTop: 16 }}>
        <Text type="secondary">
          * Preencha apenas os campos que você mediu. Todos os campos são opcionais.
        </Text>
      </div>
    </div>
  );
}
