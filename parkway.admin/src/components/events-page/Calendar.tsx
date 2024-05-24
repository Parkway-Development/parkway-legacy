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
import { isSameDate } from '../../utilities';
import { useNavigate } from 'react-router-dom';
import { SyntheticEvent } from 'react';
import { SelectInfo } from 'antd/lib/calendar/generateCalendar';
import CalendarTooltip from './CalendarTooltip.tsx';
import DayViewCalendar from './DayViewCalendar.tsx';
import classNames from 'classnames';

const Calendar = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const date = searchParams.get('date');

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
    navigate(`/events/${event._id}/edit`);
  };

  if (date) {
    const searchDate = new Date(date.replace(/-/g, '/'));
    const items = data?.data?.filter((x) => isSameDate(x.start, searchDate));

    return (
      <DayViewCalendar
        events={items ?? []}
        date={searchDate}
        dateParam={date}
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
    const items = data?.data?.filter((x) => isSameDate(x.start, date.toDate()));

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
      cellRender={cellRenderer}
      onSelect={navigateToDay}
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

export default Calendar;
