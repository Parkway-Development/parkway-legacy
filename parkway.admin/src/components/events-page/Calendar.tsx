import {
  Alert,
  Button,
  Calendar as CalendarControl,
  Col,
  Row,
  Select,
  Spin,
  Tooltip
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQuery } from '@tanstack/react-query';
import styles from './Calendar.module.scss';
import { Event } from '../../types';
import { useNavigate } from 'react-router-dom';
import { SyntheticEvent } from 'react';
import { SelectInfo } from 'antd/lib/calendar/generateCalendar';
import CalendarTooltip from './CalendarTooltip.tsx';
import DayViewCalendar from './DayViewCalendar.tsx';
import classNames from 'classnames';
import 'dayjs/plugin/localeData';
import useDateQueryParam from '../../hooks/useDateQueryParam.ts';
import { isSameDay } from 'date-fns';
import useQueryCache from '../../hooks/useQueryCache.ts';

const Calendar = () => {
  const navigate = useNavigate();
  const date = useDateQueryParam();
  const [calendarDate, setCalendarDate] = useQueryCache<Dayjs>({
    cacheKey: 'cache.calendarMonth',
    initialValue: dayjs()
  });

  const {
    eventsApi: { getAll },
    eventCategoriesApi: { getAll: getAllEventCategories },
    formatError
  } = useApi();
  const { isPending, error, data } = useQuery({
    queryFn: getAll,
    queryKey: buildQueryKey('events')
  });
  const {
    isPending: isPendingCategories,
    error: errorCategories,
    data: eventCategoriesData
  } = useQuery({
    queryFn: getAllEventCategories,
    queryKey: buildQueryKey('eventCategories')
  });

  if (error || errorCategories) {
    return (
      <Alert type="error" message={formatError(error ?? errorCategories)} />
    );
  }

  if (isPending || isPendingCategories) {
    return <Spin />;
  }

  const navigateToItem = (event: Event, e?: SyntheticEvent<HTMLLIElement>) => {
    e?.stopPropagation();
    navigate(`/events/${event._id}`);
  };

  if (date) {
    const items = data?.data?.filter((x) => isSameDay(x.start, date));

    return (
      <DayViewCalendar
        events={items ?? []}
        date={date}
        onClickEvent={navigateToItem}
      />
    );
  }

  const navigateToDay = (dayjs: Dayjs, selectInfo: SelectInfo) => {
    if (selectInfo.source === 'date') {
      navigate(`/events?date=${dayjs.format('YYYY-MM-DD')}`);
    }
  };

  const cellRenderer = (date: Dayjs) => {
    const items = data?.data?.filter((x) => isSameDay(x.start, date.toDate()));

    if (!items.length) return undefined;

    items.sort((a, b) => (a.start < b.start ? -1 : 1));

    return (
      <ul className={styles.events}>
        {items.map((item) => {
          const eventCategory = eventCategoriesData?.data?.find(
            (x) => x._id === item.category
          );
          const backgroundColor = eventCategory
            ? eventCategory.backgroundColor
            : undefined;
          const fontColor = eventCategory ? eventCategory.fontColor : undefined;

          return (
            <Tooltip key={item._id} title={<CalendarTooltip event={item} />}>
              <li
                onClick={(e) => navigateToItem(item, e)}
                className={classNames({
                  [styles.approved]: item.status === 'Active',
                  [styles.tentative]: item.status === 'Tentative',
                  [styles.rejected]: item.status === 'Rejected'
                })}
                style={{ backgroundColor, color: fontColor }}
              >
                {item.name}
              </li>
            </Tooltip>
          );
        })}
      </ul>
    );
  };

  return (
    <CalendarControl
      value={calendarDate}
      cellRender={cellRenderer}
      onSelect={navigateToDay}
      headerRender={({ value }: { value: Dayjs }) => {
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
        const previousMonth = value.add(-1, 'month');
        const nextMonth = value.add(1, 'month');

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
                <Button
                  size="small"
                  onClick={() => setCalendarDate(previousMonth)}
                >
                  Previous
                </Button>
              </Col>
              <Col>
                <Select
                  size="small"
                  popupMatchSelectWidth={false}
                  className="my-year-select"
                  value={year}
                  onChange={(newYear) => {
                    const now = value.clone().year(newYear);
                    setCalendarDate(now);
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
                    setCalendarDate(now);
                  }}
                >
                  {monthOptions}
                </Select>
              </Col>
              <Col>
                <Button size="small" onClick={() => setCalendarDate(nextMonth)}>
                  Next
                </Button>
              </Col>
            </Row>
          </div>
        );
      }}
    />
  );
};

export default Calendar;
