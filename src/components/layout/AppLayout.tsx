import { Layout, Drawer, Grid } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { MobileNav } from './MobileNav';
import { useState } from 'react';

const { Sider, Header, Content } = Layout;
const { useBreakpoint } = Grid;

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="md"
          style={{ background: '#fff' }}
        >
          <div style={{ height: 32, margin: 16, textAlign: 'center', fontWeight: 700, fontSize: collapsed ? 14 : 18 }}>
            {collapsed ? 'ST' : 'SmartTreino'}
          </div>
          <Sidebar />
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          title="SmartTreino"
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          open={mobileDrawerOpen}
          bodyStyle={{ padding: 0 }}
        >
          <Sidebar onNavigate={() => setMobileDrawerOpen(false)} />
        </Drawer>
      )}

      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
          <AppHeader onMenuClick={() => setMobileDrawerOpen(true)} showMenuButton={isMobile} />
        </Header>
        <Content style={{
          margin: isMobile ? 8 : 24,
          padding: isMobile ? 16 : 24,
          background: '#fff',
          borderRadius: 8,
          minHeight: 280,
          marginBottom: isMobile ? 64 : 24, // Space for bottom nav on mobile
        }}>
          <Outlet />
        </Content>

        {/* Mobile Bottom Navigation */}
        {isMobile && <MobileNav />}
      </Layout>
    </Layout>
  );
}
