import { App as AntdApp, Button, Image, Layout, Menu, theme } from 'antd';
import styles from './App.module.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.tsx';
import { SyntheticEvent } from 'react';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';

function App() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  if (!isLoggedIn) navigate('/login', { replace: true });

  const handleLogout = (e: SyntheticEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <AntdApp>
      <Layout className={styles.container}>
        <Layout.Sider className={styles.sidebar}>
          <div className={styles.logo}>
            <Link to="/">
              <Image src="/logo.png" preview={false} alt="Parkway Ministries" />
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            items={[
              {
                key: 1,
                label: <Link to="/accounts">Accounts</Link>,
                children: [
                  {
                    key: 2,
                    label: <Link to="/accounts/assets">Assets</Link>
                  },
                  {
                    key: 3,
                    label: (
                      <Link to="/accounts/contributions">Contributions</Link>
                    )
                  },
                  {
                    key: 4,
                    label: <Link to="/accounts/vendors">Vendors</Link>
                  }
                ]
              },
              {
                key: 5,
                label: <Link to="/profiles">Directory</Link>
              },
              {
                key: 6,
                label: <Link to="/events">Events</Link>,
                children: [
                  {
                    key: 7,
                    label: <Link to="/events/categories">Event Categories</Link>
                  }
                ]
              },
              {
                key: 8,
                label: <Link to="/giving">Giving</Link>
              },
              {
                key: 9,
                label: <Link to="/songs">Songs</Link>
              },
              {
                key: 10,
                label: <Link to="/teams">Teams</Link>
              }
            ]}
          />
        </Layout.Sider>
        <Layout>
          <Layout.Header style={{ padding: 0, background: colorBgContainer }}>
            <div className={styles.header}>
              <span className={styles.title}>Admin Portal</span>
              <span className={styles.userSection}>
                <Link to="/profiles/me">
                  <Button type="text" title="User Profile">
                    <UserOutlined />
                  </Button>
                </Link>
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
