import {
  App as AntdApp,
  Button,
  Image,
  Layout,
  Menu,
  MenuProps,
  theme
} from 'antd';
import styles from './App.module.css';
import { Link, LinkProps, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.tsx';
import { SyntheticEvent, useCallback, useState } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import useResponsive from './hooks/useResponsive.ts';

function App() {
  const { isLoggedIn, logout, hasClaim } = useAuth();
  const { aboveBreakpoint, mainBreakpoint } = useResponsive();
  const [sideCollapsed, setSideCollapsed] = useState<boolean>(false);
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

  const items: MenuProps['items'] = [];
  let itemKey = 1;

  if (hasClaim('accounting')) {
    items.push({
      key: itemKey++,
      label: (
        <ResponsiveLink to="/accounts" onClick={() => setSideCollapsed(true)}>
          Accounts
        </ResponsiveLink>
      ),
      children: [
        {
          key: itemKey++,
          label: <ResponsiveLink to="/accounts/assets">Assets</ResponsiveLink>
        },
        {
          key: itemKey++,
          label: (
            <ResponsiveLink to="/accounts/contributions">
              Contributions
            </ResponsiveLink>
          )
        },
        {
          key: itemKey++,
          label: <ResponsiveLink to="/accounts/vendors">Vendors</ResponsiveLink>
        }
      ]
    });
  }

  if (hasClaim('userManagement')) {
    items.push({
      key: itemKey++,
      label: <ResponsiveLink to="/profiles">Directory</ResponsiveLink>
    });
  }

  if (hasClaim('calendarManagement')) {
    items.push({
      key: itemKey++,
      label: <ResponsiveLink to="/events">Events</ResponsiveLink>,
      children: [
        {
          key: itemKey++,
          label: (
            <ResponsiveLink to="/events/categories">
              Event Categories
            </ResponsiveLink>
          )
        }
      ]
    });
  }

  if (hasClaim('systemSettings')) {
    items.push({
      key: itemKey++,
      label: (
        <ResponsiveLink to="/platform/enums">Platform Enums</ResponsiveLink>
      )
    });
  }

  // TODO: What app claim is required for this
  if (hasClaim('mediaManagement')) {
    items.push({
      key: itemKey++,
      label: <ResponsiveLink to="/songs">Songs</ResponsiveLink>
    });
  }

  if (hasClaim('teamManagement')) {
    items.push({
      key: itemKey++,
      label: <ResponsiveLink to="/teams">Teams</ResponsiveLink>
    });
  }

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
          <Menu theme="dark" mode="inline" items={items} />
        </Layout.Sider>
        {(aboveBreakpoint || sideCollapsed) && (
          <Layout>
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
        )}
      </Layout>
    </AntdApp>
  );
}

export default App;
