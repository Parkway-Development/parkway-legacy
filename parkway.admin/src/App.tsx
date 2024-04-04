import { App as AntdApp, Button, Image, Layout, Menu, theme } from 'antd';
import styles from './App.module.css';
import { Link, LinkProps, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.tsx';
import { SyntheticEvent, useCallback, useState } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import useResponsive from './hooks/useResponsive.ts';

function App() {
  const { isLoggedIn, logout } = useAuth();
  const { aboveBreakpoint, mainBreakpoint } = useResponsive();
  const [sideCollapsed, setSideCollapsed] = useState<boolean>(true);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  if (!isLoggedIn) {
    window.location.href = '/login';
  }

  const handleLogout = (e: SyntheticEvent) => {
    e.preventDefault();
    logout();
  };

  const ResponsiveLink = useCallback(
    ({ ...props }: LinkProps) => {
      return (
        <Link
          onClick={aboveBreakpoint ? undefined : () => setSideCollapsed(true)}
          {...props}
        />
      );
    },
    [aboveBreakpoint]
  );

  return (
    <AntdApp>
      <Layout className={styles.container}>
        <Layout.Sider
          className={styles.sidebar}
          breakpoint={mainBreakpoint}
          collapsedWidth={0}
          collapsed={sideCollapsed}
          onCollapse={(collapsed) => setSideCollapsed(collapsed)}
        >
          <div className={styles.logo}>
            <ResponsiveLink to="/">
              <Image src="/logo.png" preview={false} alt="Parkway Ministries" />
            </ResponsiveLink>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            items={[
              {
                key: 1,
                label: (
                  <ResponsiveLink
                    to="/accounts"
                    onClick={() => setSideCollapsed(true)}
                  >
                    Accounts
                  </ResponsiveLink>
                ),
                children: [
                  {
                    key: 2,
                    label: (
                      <ResponsiveLink to="/accounts/assets">
                        Assets
                      </ResponsiveLink>
                    )
                  },
                  {
                    key: 3,
                    label: (
                      <ResponsiveLink to="/accounts/contributions">
                        Contributions
                      </ResponsiveLink>
                    )
                  },
                  {
                    key: 4,
                    label: (
                      <ResponsiveLink to="/accounts/vendors">
                        Vendors
                      </ResponsiveLink>
                    )
                  }
                ]
              },
              {
                key: 5,
                label: <ResponsiveLink to="/profiles">Directory</ResponsiveLink>
              },
              {
                key: 6,
                label: <ResponsiveLink to="/events">Events</ResponsiveLink>,
                children: [
                  {
                    key: 7,
                    label: (
                      <ResponsiveLink to="/events/categories">
                        Event Categories
                      </ResponsiveLink>
                    )
                  }
                ]
              },
              {
                key: 9,
                label: (
                  <ResponsiveLink to="/platform/enums">
                    Platform Enums
                  </ResponsiveLink>
                )
              },
              {
                key: 10,
                label: <ResponsiveLink to="/songs">Songs</ResponsiveLink>
              },
              {
                key: 11,
                label: <ResponsiveLink to="/teams">Teams</ResponsiveLink>
              }
            ]}
          />
        </Layout.Sider>
        <Layout
          style={{
            display: !aboveBreakpoint && !sideCollapsed ? 'none' : undefined
          }}
        >
          <Layout.Header style={{ padding: 0, background: colorBgContainer }}>
            <div className={styles.header}>
              <span className={styles.title}>Admin Portal</span>
              <span className={styles.userSection}>
                <ResponsiveLink to="/profiles/me">
                  <Button type="text" title="User Profile">
                    <UserOutlined />
                  </Button>
                </ResponsiveLink>
                <Button onClick={handleLogout} type="text" title="Logout">
                  <LogoutOutlined />
                </Button>
              </span>
            </div>
          </Layout.Header>
          <Layout.Content
            className={styles.mainContent}
            style={{
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG
            }}
          >
            <Outlet />
          </Layout.Content>
        </Layout>
      </Layout>
    </AntdApp>
  );
}

export default App;
