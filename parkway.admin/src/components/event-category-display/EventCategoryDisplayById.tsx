import { useQuery } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { Skeleton } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import EventCategoryDisplay, {
  EventCategoryDisplayProps
} from './EventCategoryDisplay.tsx';

type EventCategoryDisplayByIdProps = Pick<
  EventCategoryDisplayProps,
  'isSmall'
> & {
  id?: string;
};

export const EventCategoryDisplayById = ({
  id,
  isSmall
}: EventCategoryDisplayByIdProps) => {
  const {
    eventCategoriesApi: { getAll }
  } = useApi();
  const { isPending, data: response } = useQuery({
    queryFn: getAll,
    queryKey: buildQueryKey('eventCategories')
  });

  if (!id) return null;

  if (isPending) return <Skeleton.Input active size="small" />;

  if (!response?.data) return <WarningOutlined />;

  const eventCategory = response.data.find((category) => category._id === id);

  return eventCategory ? (
    <EventCategoryDisplay eventCategory={eventCategory} isSmall={isSmall} />
  ) : (
    <WarningOutlined />
  );
};
