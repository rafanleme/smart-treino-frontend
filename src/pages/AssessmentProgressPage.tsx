import { App, Typography, Button, Card, Select, DatePicker, Row, Col, Spin, Empty, Statistic } from 'antd';
import { ArrowLeftOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { assessmentService } from '../services/assessmentService';
import type { ProgressDataPoint } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type Dayjs } from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

const MEASUREMENT_OPTIONS = [
  { value: 'weight_kg', label: 'Peso (kg)' },
  { value: 'body_fat_pct', label: '% Gordura' },
  { value: 'chest_cm', label: 'Peito (cm)' },
  { value: 'waist_cm', label: 'Cintura (cm)' },
  { value: 'hip_cm', label: 'Quadril (cm)' },
  { value: 'left_arm_cm', label: 'Braço Esquerdo (cm)' },
  { value: 'right_arm_cm', label: 'Braço Direito (cm)' },
  { value: 'left_thigh_cm', label: 'Coxa Esquerda (cm)' },
  { value: 'right_thigh_cm', label: 'Coxa Direita (cm)' },
  { value: 'left_calf_cm', label: 'Panturrilha Esquerda (cm)' },
  { value: 'right_calf_cm', label: 'Panturrilha Direita (cm)' },
  { value: 'neck_cm', label: 'Pescoço (cm)' },
  { value: 'shoulder_cm', label: 'Ombros (cm)' },
  { value: 'forearm_cm', label: 'Antebraço (cm)' },
];

export function AssessmentProgressPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [selectedField, setSelectedField] = useState<string>('weight_kg');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [progressData, setProgressData] = useState<ProgressDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProgressData();
  }, [selectedField, dateRange]);

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const dateFrom = dateRange?.[0]?.format('YYYY-MM-DD');
      const dateTo = dateRange?.[1]?.format('YYYY-MM-DD');

      const response = await assessmentService.progress(selectedField, dateFrom, dateTo);
      setProgressData(response.data.data);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Erro ao carregar progresso';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getFieldLabel = () => {
    const option = MEASUREMENT_OPTIONS.find(opt => opt.value === selectedField);
    return option?.label || 'Medida';
  };

  const getUnit = () => {
    if (selectedField === 'weight_kg') return 'kg';
    if (selectedField === 'body_fat_pct') return '%';
    return 'cm';
  };

  const calculateStats = () => {
    if (progressData.length === 0) {
      return { initial: 0, final: 0, delta: 0, deltaPct: 0 };
    }

    const initial = progressData[0].value;
    const final = progressData[progressData.length - 1].value;
    const delta = final - initial;
    const deltaPct = initial > 0 ? (delta / initial) * 100 : 0;

    return { initial, final, delta, deltaPct };
  };

  const stats = calculateStats();

  const chartData = progressData.map(point => ({
    date: new Date(point.date).toLocaleDateString('pt-BR'),
    value: point.value,
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
        <Title level={3} style={{ margin: 0 }}>Progresso das Medidas</Title>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Medida
              </label>
              <Select
                style={{ width: '100%' }}
                value={selectedField}
                onChange={setSelectedField}
                options={MEASUREMENT_OPTIONS}
              />
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Período
              </label>
              <RangePicker
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
                value={dateRange}
                onChange={setDateRange}
                placeholder={['Data inicial', 'Data final']}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <Spin size="large" description="Carregando dados..." />
        </div>
      ) : progressData.length === 0 ? (
        <Empty description="Nenhum dado disponível para o período selecionado" />
      ) : (
        <>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Valor Inicial"
                  value={stats.initial}
                  suffix={getUnit()}
                  precision={1}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Valor Atual"
                  value={stats.final}
                  suffix={getUnit()}
                  precision={1}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Variação"
                  value={Math.abs(stats.delta)}
                  suffix={getUnit()}
                  precision={1}
                  styles={{ content: { color: stats.delta > 0 ? '#3f8600' : stats.delta < 0 ? '#cf1322' : undefined } }}
                  prefix={stats.delta > 0 ? <ArrowUpOutlined /> : stats.delta < 0 ? <ArrowDownOutlined /> : null}
                />
                <div style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
                  {stats.deltaPct > 0 ? '+' : ''}{stats.deltaPct.toFixed(1)}%
                </div>
              </Card>
            </Col>
          </Row>

          <Card title={`Evolução de ${getFieldLabel()}`}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  label={{ value: getUnit(), angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  formatter={(value: number | undefined) => value !== undefined ? [`${value} ${getUnit()}`, getFieldLabel()] : ['-', getFieldLabel()]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#1890ff"
                  strokeWidth={2}
                  name={getFieldLabel()}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </div>
  );
}
