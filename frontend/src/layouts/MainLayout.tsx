import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, theme } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  AimOutlined,
  CloudUploadOutlined,
  TeamOutlined,
  BellOutlined,
  UserOutlined,
  BankOutlined,
  FundProjectionScreenOutlined,
  SendOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '@/stores/authStore';
import { useMessageStore } from '@/stores/messageStore';

const { Header, Sider, Content, Footer } = Layout;

const menuConfig: Record<string, MenuProps['items']> = {
  talent: [
    { key: '/', icon: <DashboardOutlined />, label: '首页' },
    { key: '/profile/talent', icon: <UserOutlined />, label: '人才画像' },
    { key: '/policies', icon: <FileTextOutlined />, label: '政策库' },
    { key: '/matching', icon: <AimOutlined />, label: '政策匹配' },
    { key: '/application/materials', icon: <CloudUploadOutlined />, label: '申报中心' },
    { key: '/collaboration', icon: <TeamOutlined />, label: '协同申报' },
    { key: '/messages', icon: <BellOutlined />, label: '消息中心' },
  ],
  tech_enterprise: [
    { key: '/', icon: <DashboardOutlined />, label: '首页' },
    { key: '/profile/enterprise', icon: <ProfileOutlined />, label: '企业画像' },
    { key: '/policies', icon: <FileTextOutlined />, label: '政策库' },
    { key: '/matching', icon: <AimOutlined />, label: '政策匹配' },
    { key: '/application/materials', icon: <CloudUploadOutlined />, label: '申报中心' },
    { key: '/collaboration', icon: <TeamOutlined />, label: '协同申报' },
    { key: '/messages', icon: <BellOutlined />, label: '消息中心' },
  ],
  transform_enterprise: [
    { key: '/', icon: <DashboardOutlined />, label: '首页' },
    { key: '/profile/enterprise', icon: <ProfileOutlined />, label: '企业画像' },
    { key: '/policies', icon: <FileTextOutlined />, label: '政策库' },
    { key: '/matching', icon: <AimOutlined />, label: '政策匹配' },
    { key: '/application/materials', icon: <CloudUploadOutlined />, label: '申报中心' },
    { key: '/messages', icon: <BellOutlined />, label: '消息中心' },
  ],
  park: [
    { key: '/', icon: <DashboardOutlined />, label: '首页' },
    { key: '/profile/park', icon: <BankOutlined />, label: '园区画像' },
    { key: '/policies', icon: <FileTextOutlined />, label: '政策库' },
    { key: '/park/investment', icon: <FundProjectionScreenOutlined />, label: '智能招商' },
    { key: '/park/policy-push', icon: <SendOutlined />, label: '政策推送' },
    { key: '/park/insights', icon: <AimOutlined />, label: '产业洞察' },
    { key: '/messages', icon: <BellOutlined />, label: '消息中心' },
  ],
};

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const unreadCount = useMessageStore((s) => s.unreadCount);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const role = user?.role || 'tech_enterprise';
  const items = menuConfig[role] || menuConfig.tech_enterprise;

  const dropdownItems: MenuProps['items'] = [
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', onClick: () => { logout(); navigate('/login'); } },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ height: 48, margin: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: collapsed ? 14 : 18, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {collapsed ? 'PC' : '政策罗盘'}
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={items} onClick={({ key }) => navigate(key)} />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
          <Badge count={unreadCount} size="small">
            <BellOutlined style={{ fontSize: 18, cursor: 'pointer' }} onClick={() => navigate('/messages')} />
          </Badge>
          <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
            <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
          </Dropdown>
        </Header>
        <Content style={{ margin: 24 }}>
          <div style={{ padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG, minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>PolicyCompass &copy; 2026</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
