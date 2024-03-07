import { Alert, Breadcrumb, notification, Spin } from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  const {
    usersApi: { getById, update },
    formatError
  } = useApi();

  const { isPending, mutate } = useMutation({
    mutationFn: update
  });

  const {
    isPending: isLoading,
    data: response,
    error
  } = useQuery({
    enabled: id !== undefined,
    queryFn: getById(id!),
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

  const handleUpdateUserProfile = (fields: UserProfileFormFields) => {
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

      <Breadcrumb
        items={[
          {
            title: <Link to="/directory">Directory</Link>
          },
          {
            title: 'Edit Profile'
          }
        ]}
      />
      <UserProfileForm
        onFinish={handleUpdateUserProfile}
        isSaving={isPending}
        initialValues={initialValues}
        onCancel={() => navigate('/directory')}
        isMyProfile={false}
      />
    </>
  );
};

export default EditUserProfilePage;
