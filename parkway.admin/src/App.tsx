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
import useApi, { buildQueryKey } from './hooks/useApi.tsx';
import { useQuery } from '@tanstack/react-query';
import SplashScreen from './components/splash-screen';

function App() {
  const { isLoggedIn, logout, hasClaim, teamsLed, user } = useAuth();
  const { aboveBreakpoint, mainBreakpoint } = useResponsive();
  const [sideCollapsed, setSideCollapsed] = useState<boolean>(false);
  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken();

  if (!isLoggedIn || !user) {
    window.location.href = '/login';
  }

  const handleLogout = (e: SyntheticEvent) => {
    e.preventDefault();
    logout();
  };

  const handleResponsiveLinkClick = useCallback(
    (e: SyntheticEvent) => {
      if (!aboveBreakpoint) {
        setSideCollapsed(true);
      }

      e.stopPropagation();
    },
    [aboveBreakpoint]
  );

  const ResponsiveLink = useCallback(
    ({ ...props }: LinkProps) => {
      return <Link onClick={handleResponsiveLinkClick} {...props} />;
    },
    [handleResponsiveLinkClick]
  );

  const {
    teamsApi: { getAll }
  } = useApi();

  const { data, isLoading } = useQuery({
    queryFn: getAll,
    queryKey: buildQueryKey('teams')
  });

  if (isLoading) return <SplashScreen />;

  const items: MenuProps['items'] = [];
  let itemKey = 1;

  if (hasClaim('accounting')) {
    items.push({
      key: itemKey++,
      label: 'Accounting',
      children: [
        /*{
          key: itemKey++,
          label: <ResponsiveLink to="/accounts/assets">Assets</ResponsiveLink>
        },*/
        {
          key: itemKey++,
          label: <ResponsiveLink to="/accounts">Accounts</ResponsiveLink>
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
          label: (
            <ResponsiveLink to="/accounts/deposits">Deposits</ResponsiveLink>
          )
        }
        /*{
          key: itemKey++,
          label: <ResponsiveLink to="/accounts/vendors">Vendors</ResponsiveLink>
        }*/
      ]
    });
  }

  if (hasClaim('attendance')) {
    items.push({
      key: itemKey++,
      label: <ResponsiveLink to="/attendance">Attendance</ResponsiveLink>,
      children: [
        {
          key: itemKey++,
          label: (
            <ResponsiveLink to="/attendance-categories">
              Categories
            </ResponsiveLink>
          )
        }
      ]
    });
  }

  const hasCalendarManagement = hasClaim('calendarManagement');
  const isTeamLeader = teamsLed.length > 0;

  if (hasCalendarManagement || isTeamLeader) {
    items.push({
      key: itemKey++,
      label: <ResponsiveLink to="/events">Calendar</ResponsiveLink>,
      children: hasCalendarManagement
        ? [
            {
              key: itemKey++,
              label: (
                <ResponsiveLink to="/events/categories">
                  Event Categories
                </ResponsiveLink>
              )
            }
          ]
        : undefined
    });
  }

  /*
if (hasClaim('systemSettings')) {
  items.push({
    key: itemKey++,
    label: (
      <ResponsiveLink to="/platform/enums">Platform Enums</ResponsiveLink>
    )
  });
}
 */

  // TODO This could be a separate role or exposed if user has other roles like this
  if (hasCalendarManagement) {
    items.push({
      key: itemKey++,
      label: <ResponsiveLink to="/locations">Locations</ResponsiveLink>
    });
  }

  if (hasClaim('userManagement')) {
    items.push({
      key: itemKey++,
      label: <ResponsiveLink to="/profiles">People</ResponsiveLink>
    });
  }

  if (hasClaim('mediaManagement')) {
    items.push({
      key: itemKey++,
      label: <ResponsiveLink to="/songs">Songs</ResponsiveLink>
    });
  }

  if (hasClaim('isspecops')) {
    items.push({
      key: itemKey++,
      label: <ResponsiveLink to="/specops">Spec Ops</ResponsiveLink>
    });
  }

  const hasTeamManagementClaim = hasClaim('teamManagement');
  const teamsData = data?.data ?? [];
  const userTeams =
    user?.profileId !== undefined
      ? teamsData
          .filter(
            (team) =>
              team.leader?.includes(user.profileId!) ||
              team.members?.includes(user.profileId!)
          )
          .sort((a, b) => (a.name > b.name ? -1 : 1))
      : [];

  if (userTeams.length || hasTeamManagementClaim) {
    items.push({
      key: itemKey++,
      label: hasTeamManagementClaim ? (
        <ResponsiveLink to="/teams">Teams</ResponsiveLink>
      ) : (
        'Teams'
      ),
      children: userTeams.length
        ? userTeams.map((team) => ({
            key: itemKey++,
            label: (
              <ResponsiveLink to={`/team/${team._id}`}>
                {team.name}
              </ResponsiveLink>
            )
          }))
        : undefined
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
          <Menu theme="dark" mode="inline" items={items} selectable={false} />
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
