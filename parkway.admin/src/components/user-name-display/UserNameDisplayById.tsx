import { useQuery } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { Skeleton } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import UserNameDisplay from './UserNameDisplay.tsx';

interface UserDisplayProps {
  id?: string;
}

export const UserNameDisplayById = ({ id }: UserDisplayProps) => {
  const {
    usersApi: { getAllLimitedProfile }
  } = useApi();
  const { isPending, data: response } = useQuery({
    queryFn: getAllLimitedProfile,
    queryKey: buildQueryKey('profiles')
  });

  if (!id) return null;

  if (isPending) return <Skeleton.Input active size="small" />;

  if (!response?.data) return <WarningOutlined />;

  const user = response.data.find((user) => user._id === id);

  return user ? <UserNameDisplay user={user} /> : <WarningOutlined />;
};
