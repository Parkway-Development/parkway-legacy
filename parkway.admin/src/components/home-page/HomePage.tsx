import DepositsChart from './DepositsChart.tsx';
import AttendanceChart from './AttendanceChart.tsx';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <>
      <h2>Home</h2>
      <div className={styles.chartsContainer}>
        <DepositsChart />
        <AttendanceChart />
      </div>
    </>
  );
};

export default HomePage;
