import { CSSProperties } from 'react';

const negativeAmountStyle: CSSProperties = {
  color: 'red'
};

export const formatPennies = (pennies: number | undefined) => {
  const money = pennies ? pennies / 100 : 0;

  return money.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });
};

const MoneyDisplay = ({ pennies }: { pennies: number | undefined }) => {
  const money = formatPennies(pennies);

  return (
    <span style={pennies && pennies < 0 ? negativeAmountStyle : undefined}>
      {money}
    </span>
  );
};

export default MoneyDisplay;
