import {
  Alert,
  Calendar as CalendarControl,
  Col,
  Row,
  Select,
  Spin,
  Tooltip
} from 'antd';
import { Dayjs } from 'dayjs';
// @ts-ignore
import dayLocaleData from 'dayjs/plugin/localeData';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQuery } from '@tanstack/react-query';
import styles from './Calendar.module.css';
import { Event } from '../../types';
import { isSameDate, transformToTime } from '../../utilities';
import DateDisplay from '../date-display';
import { useNavigate } from 'react-router-dom';
import { SyntheticEvent } from 'react';
import { SelectInfo } from 'antd/lib/calendar/generateCalendar';

const Calendar = () => {
  const navigate = useNavigate();

  const {
    eventsApi: { getAll },
    formatError
  } = useApi();
  const { isPending, error, data } = useQuery({
    queryFn: getAll,
    queryKey: buildQueryKey('events')
  });

  if (error) {
    return <Alert type="error" message={formatError(error)} />;
  }

  if (isPending) {
    return <Spin />;
  }

  const navigateToItem = (e: SyntheticEvent<HTMLLIElement>, event: Event) => {
    e.stopPropagation();
    navigate(`/events/${event._id}/edit`);
  };

  const createNewItem = (dayjs: Dayjs, selectInfo: SelectInfo) => {
    if (selectInfo.source === 'date') {
      navigate(`/events/add?date=${dayjs.format('YYYY-MM-DD')}`);
    }
  };

  const cellRenderer = (date: Dayjs) => {
    const items = data?.data?.filter(
      (x) => new Date(x.start).getDate() === date.date()
    );

    if (!items.length) return undefined;

    items.sort((a, b) => (a.start < b.start ? -1 : 1));

    return (
      <ul className={styles.events}>
        {items.map((item) => (
          <Tooltip key={item._id} title={<CalendarTooltip event={item} />}>
            <li onClick={(e) => navigateToItem(e, item)}>{item.name}</li>
          </Tooltip>
        ))}
      </ul>
    );
  };

  return (
    <CalendarControl
      cellRender={cellRenderer}
      onSelect={createNewItem}
      headerRender={({
        value,
        onChange
      }: {
        value: Dayjs;
        onChange: (day: Dayjs) => void;
      }) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];

        let current = value.clone();
        const localeData = value.localeData();
        const months = [];
        for (let i = 0; i < 12; i++) {
          current = current.month(i);
          months.push(localeData.monthsShort(current));
        }

        for (let i = start; i < end; i++) {
          monthOptions.push(
            <Select.Option key={i} value={i} className="month-item">
              {months[i]}
            </Select.Option>
          );
        }

        const year = value.year();
        const month = value.month();
        const options = [];
        for (let i = year - 10; i < year + 10; i += 1) {
          options.push(
            <Select.Option key={i} value={i} className="year-item">
              {i}
            </Select.Option>
          );
        }
        return (
          <div style={{ padding: 8 }}>
            <Row gutter={8}>
              <Col>
                <Select
                  size="small"
                  popupMatchSelectWidth={false}
                  className="my-year-select"
                  value={year}
                  onChange={(newYear) => {
                    const now = value.clone().year(newYear);
                    onChange(now);
                  }}
                >
                  {options}
                </Select>
              </Col>
              <Col>
                <Select
                  size="small"
                  popupMatchSelectWidth={false}
                  value={month}
                  onChange={(newMonth) => {
                    const now = value.clone().month(newMonth);
                    onChange(now);
                  }}
                >
                  {monthOptions}
                </Select>
              </Col>
            </Row>
          </div>
        );
      }}
    />
  );
};

type CalendarTooltipProps = {
  event: Event;
};

const CalendarTooltip = ({ event }: CalendarTooltipProps) => {
  const timeFormat = isSameDate(event.start, event.end) ? (
    <p>
      {transformToTime(event.start)} - {transformToTime(event.end)}
    </p>
  ) : (
    <>
      <p>
        Start: <DateDisplay date={event.start} displayTime />
      </p>
      <p>
        End: <DateDisplay date={event.end} displayTime />
      </p>
    </>
  );

  return (
    <div className={styles.tooltip}>
      <p>{event.name}</p>
      {timeFormat}
    </div>
  );
};

export default Calendar;
