import { useQuery } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { Skeleton } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import TeamNameDisplay from './TeamNameDisplay.tsx';

interface TeamNameDisplayByIdProps {
  id?: string;
}

export const TeamNameDisplayById = ({ id }: TeamNameDisplayByIdProps) => {
  const {
    teamsApi: { getAll }
  } = useApi();
  const { isPending, data: response } = useQuery({
    queryFn: getAll,
    queryKey: buildQueryKey('teams')
  });

  if (!id) return null;

  if (isPending) return <Skeleton.Input active size="small" />;

  if (!response?.data) return <WarningOutlined />;

  const team = response.data.find((t) => t._id === id);

  return team ? <TeamNameDisplay team={team} /> : <WarningOutlined />;
};
