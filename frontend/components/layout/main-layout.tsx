'use client';

import { Layout, Menu, Avatar, Dropdown } from 'antd';
import { UserOutlined, MenuOutlined, HomeOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Link from 'next/link';

const { Header, Content, Sider } = Layout;

type MainLayoutProps = {
  children: React.ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link href="/dashboard">Tableau de bord</Link>,
    },
    {
      key: 'applications',
      icon: <AppstoreOutlined />,
      label: <Link href="/applications">Applications</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Profil',
    },
    {
      key: 'logout',
      label: 'Déconnexion',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="flex items-center justify-between p-0 bg-white shadow-sm">
        <div className="flex items-center">
          <div className="px-4 text-lg font-bold">
            Koli55
          </div>
          <MenuOutlined
            className="lg:hidden ml-4 cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>
        <div className="px-4">
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar icon={<UserOutlined />} className="cursor-pointer" />
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          className="hidden lg:block"
          breakpoint="lg"
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['dashboard']}
            items={menuItems}
            className="h-[calc(100vh-64px)]"
          />
        </Sider>
        <Content className="p-6 bg-gray-50">
          <div className="bg-white p-6 rounded-md shadow-sm min-h-[calc(100vh-160px)]">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
} 