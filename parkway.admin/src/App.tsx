import { App as AntdApp } from 'antd';
import styles from './App.module.css';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <AntdApp>
      <div className={styles.mainContainer}>
        <header>
          <h1>Parkway Ministries Admin</h1>
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
