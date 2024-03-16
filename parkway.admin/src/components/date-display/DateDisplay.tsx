const DateDisplay = ({
  date,
  displayTime = false
}: {
  date: Date | undefined;
  displayTime?: boolean;
}) => {
  if (!date) return undefined;

  const finalDate = new Date(date);

  if (displayTime) {
    return `${finalDate.toLocaleDateString()} ${finalDate.toLocaleTimeString(
      [],
      {
        hour: 'numeric',
        minute: '2-digit'
      }
    )}`;
  }

  return finalDate.toLocaleDateString();
};

export default DateDisplay;
