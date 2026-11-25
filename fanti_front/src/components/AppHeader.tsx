'use client';

import { useAuthContext } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { CalendarOutlined, CheckSquareOutlined, LogoutOutlined, PicRightOutlined, ProjectOutlined, QuestionCircleOutlined, SettingOutlined, TeamOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Layout, Menu, message, Space, Typography } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader() {
  const { user, logout } = useAuthContext();
  const { canAccess, can } = usePermissions();

  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logout realizado com sucesso!');
    } catch (error) {
      message.error('Erro ao fazer logout');
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: (
        <Space direction="vertical" size={0} style={{ padding: '8px 0' }}>
          <Text strong>{user?.name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {user?.email}
          </Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {user?.role}
          </Text>
        </Space>
      ),
      disabled: true,
    },
    {
      key: 'divider-1',
      type: 'divider' as const,
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configurações',
      onClick: () => {
        router.push('/settings');
      },
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: handleLogout,
    },
  ];

  const navigationItems = [
    {
      key: '/',
      icon: <CheckSquareOutlined />,
      label: <Link href="/">Home</Link>,
      visible: canAccess('/'),
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: <Link href="/projects">Produtos</Link>,
      visible: canAccess('/projects'),
    },
    {
      key: '/sprints',
      icon: <ToolOutlined />,
      label: <Link href="/sprints">Milestones</Link>,
      visible: canAccess('/sprints'),
    },
    {
      key: '/tasks',
      icon: <PicRightOutlined />,
      label: <Link href="/tasks">RoadMap</Link>,
      visible: canAccess('/tasks'),
    },
    {
      key: '/periods',
      icon: <CalendarOutlined />,
      label: <Link href="/periods">Sprints</Link>,
      visible: canAccess('/periods'),
    },
    {
      key: '/teams-staff',
      icon: <TeamOutlined />,
      label: <Link href="/teams-staff">Equipes & Colaboradores</Link>,
      visible: canAccess('/teams-staff'),
    },
    {
      key: '/faq',
      icon: <QuestionCircleOutlined />,
      label: <Link href="/faq">FAQ</Link>,
      visible: canAccess('/faq'),
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: <Link href="/users">Usuários</Link>,
      visible: canAccess('/users'),
    },
  ].filter(item => item.visible); // Only show items user has permission to access

  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        padding: '0 24px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <div style={{ marginRight: '48px' }}>
          <Text
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1890ff'
            }}
          >
            Fanti
          </Text>
        </div>

        <Menu
          mode="horizontal"
          selectedKeys={[pathname]}
          items={navigationItems}
          style={{
            border: 'none',
            flex: 1,
            justifyContent: 'flex-start'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <Button type="text" style={{ padding: '0 8px', height: 'auto' }}>
            <Space>
              <Avatar
                size="small"
                icon={<UserOutlined />}
                src={user?.avatar && user.avatar.trim() !== '' ? user.avatar : undefined}
                style={{ backgroundColor: '#1890ff' }}
              />
              <span style={{ color: '#262626' }}>
                {user?.given_name + ' ' + user?.last_name || 'Usuário'}
              </span>
            </Space>
          </Button>
        </Dropdown>
      </div>
    </Header>
  );
}
