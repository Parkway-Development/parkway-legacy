import { transformToTime } from '../../utilities';

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
    return `${finalDate.toLocaleDateString()} ${transformToTime(finalDate)}`;
  }

  return finalDate.toLocaleDateString();
};

export default DateDisplay;
