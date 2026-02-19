import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  ThunderboltOutlined,
  PlayCircleOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './MobileNav.css';

const navItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Home' },
  { key: '/workouts', icon: <ThunderboltOutlined />, label: 'Treinos' },
  { key: '/train', icon: <PlayCircleOutlined />, label: 'Treinar' },
  { key: '/achievements', icon: <TrophyOutlined />, label: 'Conquistas' },
  { key: '/profile', icon: <UserOutlined />, label: 'Perfil' },
];

export function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => {
    const match = navItems.find((item) =>
      item.key === location.pathname ||
      (item.key !== '/' && location.pathname.startsWith(item.key))
    );
    return match?.key || '/';
  };

  const selectedKey = getSelectedKey();

  return (
    <nav className="mobile-nav">
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`mobile-nav-item ${selectedKey === item.key ? 'active' : ''}`}
          onClick={() => navigate(item.key)}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 0',
            gap: '4px',
            color: selectedKey === item.key ? '#1890ff' : '#8c8c8c',
            minHeight: 56,
          }}
        >
          <span style={{ fontSize: 24 }}>{item.icon}</span>
          <span style={{ fontSize: 11 }}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
