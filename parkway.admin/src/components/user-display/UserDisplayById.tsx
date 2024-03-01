import { useQuery } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { Skeleton } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import UserProfileDisplay from './UserProfileDisplay.tsx';

interface UserDisplayProps {
  id?: string;
}

const UserDisplayById = ({ id }: UserDisplayProps) => {
  const { getProfiles } = useApi();
  const { isPending, data: response } = useQuery({
    queryFn: getProfiles,
    queryKey: buildQueryKey('profiles')
  });

  if (!id) return null;

  if (isPending) return <Skeleton.Input active size="small" />;

  if (!response?.data) return <WarningOutlined />;

  const user = response.data.find((user) => user._id === id);

  return user ? <UserProfileDisplay user={user} /> : <WarningOutlined />;
};

export default UserDisplayById;
