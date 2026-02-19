import { Card, Avatar, Typography, Button, Row, Col, Statistic, Divider, Space, message } from 'antd';
import { UserOutlined, LogoutOutlined, TrophyOutlined, FireOutlined, LineChartOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { statsService } from '../services/statsService';

const { Title, Text } = Typography;

interface Stats {
  total_sessions: number;
  total_workouts: number;
  total_achievements: number;
  current_streak: number;
  total_volume_kg: number;
  total_xp: number;
  level: number;
}

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsService.getDashboard();
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      message.error('Erro ao fazer logout');
    }
  };

  // Debug avatar
  console.log('👤 User in ProfilePage:', user);
  console.log('🖼️ Avatar URL:', user?.avatar_url);

  return (
    <div>
      <Title level={3}>Meu Perfil</Title>

      <Row gutter={[16, 16]}>
        {/* Profile Card */}
        <Col xs={24} md={12} lg={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar
                size={120}
                src={user?.avatar_url}
                icon={<UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              <Title level={4} style={{ marginBottom: 4 }}>{user?.name}</Title>
              <Text type="secondary">{user?.email}</Text>

              <Divider />

              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  block
                >
                  Sair
                </Button>
              </Space>
            </div>
          </Card>
        </Col>

        {/* Stats Card */}
        <Col xs={24} md={12} lg={16}>
          <Card title="Estatísticas Gerais" loading={loading}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Sessões Totais"
                  value={stats?.total_sessions || 0}
                  prefix={<FireOutlined />}
                />
              </Col>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Treinos Criados"
                  value={stats?.total_workouts || 0}
                  prefix={<LineChartOutlined />}
                />
              </Col>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Conquistas"
                  value={stats?.total_achievements || 0}
                  prefix={<TrophyOutlined />}
                />
              </Col>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Streak Atual"
                  value={stats?.current_streak || 0}
                  suffix="dias"
                />
              </Col>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Volume Total"
                  value={stats?.total_volume_kg || 0}
                  suffix="kg"
                />
              </Col>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Nível"
                  value={stats?.level || 1}
                  suffix={`(${stats?.total_xp || 0} XP)`}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Account Info */}
      <Card title="Informações da Conta" style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Text strong>Nome:</Text> <Text>{user?.name}</Text>
          </Col>
          <Col span={24}>
            <Text strong>Email:</Text> <Text>{user?.email}</Text>
          </Col>
          <Col span={24}>
            <Text strong>Avatar URL:</Text> <Text code>{user?.avatar_url || 'Nenhum'}</Text>
          </Col>
          <Col span={24}>
            <Text strong>Membro desde:</Text> <Text>{user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}</Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
