import { CSSProperties } from 'react';

const negativeAmountStyle: CSSProperties = {
  color: 'red'
};

const MoneyDisplay = ({ money }: { money: number | undefined }) => {
  return (
    <span style={money && money < 0 ? negativeAmountStyle : undefined}>
      {(money ?? 0).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })}
    </span>
  );
};

export default MoneyDisplay;
