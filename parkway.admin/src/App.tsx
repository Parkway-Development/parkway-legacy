import { App as AntdApp } from 'antd';
import styles from './App.module.css';

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
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/directory">Directory</a>
              </li>
              <li>
                <a href="/giving">Giving</a>
              </li>
            </ul>
          </nav>
          <div className={styles.mainContent}></div>
        </div>
      </div>
    </AntdApp>
  );
}

export default App;
