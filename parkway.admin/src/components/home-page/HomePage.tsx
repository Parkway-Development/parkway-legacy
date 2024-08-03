import DepositsChart from './DepositsChart.tsx';

const HomePage = () => {
  return (
    <>
      <h2>Home</h2>
      <div style={{ width: 500, height: 300 }}>
        <DepositsChart />
      </div>
    </>
  );
};

export default HomePage;
