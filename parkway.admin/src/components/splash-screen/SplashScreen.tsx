import styles from './SplashScreen.module.css';
import { Card, Image, Spin } from 'antd';

const SplashScreen = () => {
  return (
    <div className="entryPage">
      <Card
        title="Parkway Ministries Admin Login"
        bordered={false}
        style={{ width: '90vw', maxWidth: 500 }}
      >
        <div className={styles.logoContainer}>
          <Image
            className={styles.logo}
            height={175}
            loading="eager"
            src="/logo.png"
            preview={false}
            alt="Parkway Ministries"
          />
          <Spin />
        </div>
      </Card>
    </div>
  );
};

export default SplashScreen;
