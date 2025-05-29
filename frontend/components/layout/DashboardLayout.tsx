"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeOutlined,
  UserOutlined,
  BarChartOutlined,
  BookOutlined,
  SettingOutlined,
  CreditCardOutlined,
  MessageOutlined,
  PhoneOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  TeamOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Layout,
  Tooltip,
  Typography,
  Menu,
  Dropdown,
  Space,
  Breadcrumb,
} from "antd";
import { useSupabaseUser } from "@/lib/supabase/hooks/useSupabaseUser";
import {
  generateBreadcrumbs,
  BreadcrumbItem as BreadcrumbItemType,
} from "@/lib/utils/navigation";
import { Button } from "@/components/ui/Button";

const { Title, Text } = Typography;
const { Sider, Header, Content } = Layout;

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const mainNavItems = [
  { key: "/dashboard", icon: <HomeOutlined />, label: "Dashboard" },
  {
    key: "/dashboard/assistants",
    icon: <UserOutlined />,
    label: "Mes Assistants",
  },
  {
    key: "/dashboard/knowledge-bases",
    icon: <BookOutlined />,
    label: "Knowledge Bases",
  },
  {
    key: "/dashboard/phone-numbers",
    icon: <PhoneOutlined />,
    label: "Numéros de téléphone",
  },
];

const accountNavItems = [
  {
    key: "/dashboard/usage-billing",
    icon: <CreditCardOutlined />,
    label: "Usage & Facturation",
  },
  {
    key: "/dashboard/settings",
    icon: <SettingOutlined />,
    label: "Paramètres",
  },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useSupabaseUser();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItemType[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      } else {
        // Optionnel: Dé-colapser sur desktop si ce n'était pas un choix utilisateur
        // setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setBreadcrumbs(generateBreadcrumbs(pathname));
  }, [pathname]);

  const userMenuItems = (
    <Menu
      items={[
        { key: "profile", label: user?.email || "Profil" },
        { type: "divider" },
        {
          key: "logout",
          label: "Déconnexion",
          onClick: signOut,
          icon: <LogoutOutlined />,
        },
      ]}
    />
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
        trigger={null}
        width={260}
        className="glassmorphism !fixed left-0 top-0 bottom-0 z-50 h-screen overflow-auto shadow-lg"
      >
        <div className="flex items-center justify-center p-4 h-16 sticky top-0 z-10 glassmorphism">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-allokoli-primary to-allokoli-secondary rounded-md flex items-center justify-center text-white font-bold text-lg shadow-md">
              A
            </div>
            {!collapsed && (
              <Title level={4} className="!m-0 !text-allokoli-text-primary">
                AlloKoli
              </Title>
            )}
          </Link>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          className="!bg-transparent !border-none mt-4"
          items={[
            ...mainNavItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: <Link href={item.key}>{item.label}</Link>,
            })),
            { type: "divider", className: "!bg-gray-600 mx-4" },
            ...accountNavItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              label: <Link href={item.key}>{item.label}</Link>,
            })),
          ]}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed && !isMobile ? 80 : isMobile ? 0 : 260,
          transition: "margin-left 0.2s",
        }}
        className="bg-allokoli-background"
      >
        <Header className="glassmorphism !flex items-center justify-between !px-6 !h-16 sticky top-0 z-40 shadow-sm">
          <Space>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="!text-xl !text-allokoli-text-primary hover:!text-allokoli-primary"
            />
            <Breadcrumb className="hidden md:block">
              {breadcrumbs.map((crumb, index) => (
                <Breadcrumb.Item key={crumb.path}>
                  {index === breadcrumbs.length - 1 || !crumb.path ? (
                    <Text className="!text-allokoli-text-primary font-medium">
                      {crumb.title}
                    </Text>
                  ) : (
                    <Link
                      href={crumb.path}
                      className="hover:!text-allokoli-primary"
                    >
                      {crumb.title}
                    </Link>
                  )}
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          </Space>
          <Space align="center">
            <Dropdown overlay={userMenuItems} placement="bottomRight">
              <Avatar
                size="large"
                icon={user?.user_metadata?.avatar_url ? null : <UserOutlined />}
                src={user?.user_metadata?.avatar_url}
                className="cursor-pointer bg-allokoli-primary hover:opacity-80 transition-opacity"
              />
            </Dropdown>
          </Space>
        </Header>
        <Content className="p-6 overflow-auto" style={{}}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
