import { App, Card, Avatar, Typography, Button, Row, Col, Statistic, Divider, Space } from 'antd';
import { UserOutlined, LogoutOutlined, TrophyOutlined, FireOutlined, LineChartOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { statsService } from '../services/statsService';
import type { DashboardStats } from '../types';

const { Title, Text } = Typography;

export function ProfilePage() {
  const { message } = App.useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsService.getDashboard();
        setStats(data);
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

              <Space orientation="vertical" style={{ width: '100%' }}>
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
                  title="Volume Total"
                  value={stats?.total_volume_kg || 0}
                  suffix="kg"
                  prefix={<LineChartOutlined />}
                />
              </Col>
              <Col xs={12} sm={8}>
                <Statistic
                  title="Duração Total"
                  value={stats?.total_duration_hours || 0}
                  suffix="h"
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
