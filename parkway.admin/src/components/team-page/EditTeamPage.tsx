import { Alert, notification, Spin } from 'antd';
import { Team } from '../../types/Team.ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import TeamForm, { TeamFormFields } from './TeamForm.tsx';

const EditTeamPage = () => {
  const params = useParams();
  const id = params.id;

  const queryClient = useQueryClient();
  const { getTeamById, formatError, updateTeam } = useApi();

  const { isPending, mutate } = useMutation({
    mutationFn: updateTeam
  });

  const {
    isPending: isLoading,
    data: response,
    error
  } = useQuery({
    enabled: id !== undefined,
    queryFn: getTeamById(id!),
    queryKey: buildQueryKey('teams', id ?? '')
  });

  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  if (!id) {
    return <Alert type="error" message="Invalid id" />;
  }

  if (error) {
    return <Alert type="error" message={formatError(error)} />;
  }

  if (isLoading || !response?.data) {
    return <Spin />;
  }

  const initialValues: TeamFormFields = {
    ...response.data
  };

  const handleUpdateTeam = (fields: TeamFormFields) => {
    const payload: Omit<Team, '_id'> = {
      name: fields.name.trim(),
      description: fields.description?.trim(),
      leader: fields.leader,
      members: fields.members ?? []
    };

    mutate(
      { ...payload, _id: id },
      {
        onSuccess: ({ data }: { data: Team }) => {
          queryClient.setQueryData(buildQueryKey('teams', data._id), data);
          navigate('/teams');
        },
        onError: (error: Error | null) =>
          api.error({
            message: formatError(error)
          })
      }
    );
  };

  return (
    <>
      {contextHolder}
      <TeamForm
        onFinish={handleUpdateTeam}
        isSaving={isPending}
        initialValues={initialValues}
      />
    </>
  );
};

export default EditTeamPage;
