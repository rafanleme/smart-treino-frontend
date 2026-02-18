import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
  PlayCircleOutlined,
  HistoryOutlined,
  LineChartOutlined,
  TrophyOutlined,
  RobotOutlined,
  UserOutlined,
} from '@ant-design/icons';

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/exercises', icon: <UnorderedListOutlined />, label: 'Exercícios' },
  { key: '/workouts', icon: <ThunderboltOutlined />, label: 'Treinos' },
  { key: '/train', icon: <PlayCircleOutlined />, label: 'Treinar' },
  { key: '/sessions', icon: <HistoryOutlined />, label: 'Histórico' },
  { key: '/assessments', icon: <LineChartOutlined />, label: 'Avaliações' },
  { key: '/achievements', icon: <TrophyOutlined />, label: 'Conquistas' },
  { key: '/records', icon: <TrophyOutlined />, label: 'Records' },
  { key: '/ai/builder', icon: <RobotOutlined />, label: 'IA Builder' },
  { key: '/profile', icon: <UserOutlined />, label: 'Perfil' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = menuItems
    .filter((item) => location.pathname.startsWith(item.key) && item.key !== '/')
    .sort((a, b) => b.key.length - a.key.length)[0]?.key || '/';

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
}
