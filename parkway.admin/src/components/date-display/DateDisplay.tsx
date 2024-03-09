const DateDisplay = ({ date }: { date: Date | undefined }) => {
  if (!date) return undefined;
  return new Date(date).toLocaleDateString();
};

export default DateDisplay;
