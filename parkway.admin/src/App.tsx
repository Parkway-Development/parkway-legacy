import { App as AntdApp } from 'antd';
import styles from './App.module.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.tsx';
import { SyntheticEvent } from 'react';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) navigate('/login');

  const handleLogout = (e: SyntheticEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  return (
    <AntdApp>
      <div className={styles.mainContainer}>
        <header>
          <h1>Parkway Ministries Admin</h1>
          <p>
            Welcome, {user?.name}!{' '}
            <a href="#" onClick={handleLogout}>
              Logout
            </a>
          </p>
        </header>
        <div className={styles.container}>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/directory">Directory</Link>
              </li>
              <li>
                <Link to="/giving">Giving</Link>
              </li>
            </ul>
          </nav>
          <div className={styles.mainContent}>
            <Outlet />
          </div>
        </div>
      </div>
    </AntdApp>
  );
}

export default App;
