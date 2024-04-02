import { useQuery } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { Skeleton } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

interface AccountNameDisplayByIdProps {
  id: string;
}

export const AccountNameDisplayById = ({ id }: AccountNameDisplayByIdProps) => {
  const {
    accountsApi: { getAll }
  } = useApi();
  const { isPending, data: response } = useQuery({
    queryFn: getAll,
    queryKey: buildQueryKey('accounts')
  });

  if (!id) return null;

  if (isPending) return <Skeleton.Input active size="small" />;

  if (!response?.data) return <WarningOutlined />;

  const account = response.data.find((account) => account._id === id);

  return account ? account.name : <WarningOutlined />;
};
