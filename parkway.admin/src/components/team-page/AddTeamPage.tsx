import { notification } from 'antd';
import { Team } from '../../types/Team.ts';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import TeamForm, { TeamFormFields } from './TeamForm.tsx';

const AddTeamPage = () => {
  const queryClient = useQueryClient();
  const {
    teamsApi: { create },
    formatError
  } = useApi();
  const { isPending, mutate } = useMutation({
    mutationFn: create
  });
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const handleAddTeam = (fields: TeamFormFields) => {
    const payload: Omit<Team, '_id'> = {
      name: fields.name.trim(),
      description: fields.description?.trim(),
      leader: fields.leader,
      members: fields.members ?? []
    };

    mutate(payload, {
      onSuccess: ({ data }: { data: Team }) => {
        queryClient.setQueryData(buildQueryKey('teams', data._id), data);
        navigate('/teams');
      },
      onError: (error: Error | null) =>
        api.error({
          message: formatError(error)
        })
    });
  };

  return (
    <>
      {contextHolder}
      <TeamForm onFinish={handleAddTeam} isSaving={isPending} />
    </>
  );
};

export default AddTeamPage;
