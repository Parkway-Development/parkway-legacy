const DateDisplay = ({
  date,
  displayTime = false
}: {
  date: Date | undefined;
  displayTime?: boolean;
}) => {
  if (!date) return undefined;

  if (displayTime) {
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }

  return date.toLocaleDateString();
};

export default DateDisplay;
