type NumberFormatProps = {
  value: number | undefined | null;
};

const NumberFormat = ({ value }: NumberFormatProps) => {
  if (!value) return null;

  return value.toLocaleString();
};

export default NumberFormat;
