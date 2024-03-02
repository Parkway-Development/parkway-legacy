import { Alert, notification, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import UserProfileForm, {
  transformFieldsToPayload,
  UserProfileFormFields
} from './UserProfileForm.tsx';
import { UserProfile } from '../../types/UserProfile.ts';

const EditUserProfilePage = () => {
  const params = useParams();
  const id = params.id;

  const queryClient = useQueryClient();
  const { getUserProfileById, formatError, updateUserProfile } = useApi();

  const { isPending, mutate } = useMutation({
    mutationFn: updateUserProfile
  });

  const {
    isPending: isLoading,
    data: response,
    error
  } = useQuery({
    enabled: id !== undefined,
    queryFn: getUserProfileById(id!),
    queryKey: buildQueryKey('profiles', id ?? '')
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

  const initialValues: UserProfileFormFields = {
    ...response.data
  };

  const handleUpdateTeam = (fields: UserProfileFormFields) => {
    const payload = transformFieldsToPayload(fields);

    mutate(
      { ...payload, _id: id },
      {
        onSuccess: ({ data }: { data: UserProfile }) => {
          queryClient.setQueryData(buildQueryKey('profiles', data._id), data);
          navigate('/directory');
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
      <UserProfileForm
        onFinish={handleUpdateTeam}
        isSaving={isPending}
        initialValues={initialValues}
      />
    </>
  );
};

export default EditUserProfilePage;
