import { isDateString } from '../../utilities';
import { parseISO } from 'date-fns';

const DateDisplay = ({
  date,
  displayTime = false
}: {
  date: Date | string | undefined;
  displayTime?: boolean;
}) => {
  if (!date) return undefined;

  const finalDate: Date = isDateString(date)
    ? parseISO(date as string)
    : (date as Date);

  if (displayTime) {
    return `${finalDate.toLocaleDateString()} ${finalDate.toLocaleTimeString()}`;
  }

  return finalDate.toLocaleDateString();
};

export default DateDisplay;
