import { CSSProperties } from 'react';

const negativeAmountStyle: CSSProperties = {
  color: 'red'
};

const MoneyDisplay = ({ pennies }: { pennies: number | undefined }) => {
  const money = pennies ? pennies / 100 : 0;

  return (
    <span style={pennies && pennies < 0 ? negativeAmountStyle : undefined}>
      {money.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })}
    </span>
  );
};

export default MoneyDisplay;
