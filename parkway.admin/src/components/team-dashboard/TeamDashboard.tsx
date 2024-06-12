import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { useQuery } from '@tanstack/react-query';
import { Alert, Spin } from 'antd';
import { useParams } from 'react-router-dom';

const TeamDashboardPage = () => {
  const params = useParams();
  const id = params.id;
  const {
    teamsApi: { getById },
    formatError
  } = useApi();

  const { data, isLoading, error } = useQuery({
    queryFn: getById(id ?? ''),
    queryKey: buildQueryKey('teams', id)
  });

  if (isLoading) return <Spin />;

  if (error || !data)
    return (
      <Alert
        type="error"
        message={error ? formatError(error) : 'Unable to load team data.'}
      />
    );

  return (
    <>
      <h2>{data.data.name}</h2>
      <p>More stuff coming here later!</p>
    </>
  );
};

export default TeamDashboardPage;
