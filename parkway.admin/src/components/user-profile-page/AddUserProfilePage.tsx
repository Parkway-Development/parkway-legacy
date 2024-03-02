import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import UserProfileForm, {
  transformFieldsToPayload,
  UserProfileFormFields
} from './UserProfileForm.tsx';
import { UserProfile } from '../../types/UserProfile.ts';

const AddUserProfilePage = () => {
  const queryClient = useQueryClient();
  const { createUserProfile, formatError } = useApi();
  const { isPending, mutate } = useMutation({
    mutationFn: createUserProfile
  });
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const handleAddUserProfile = (fields: UserProfileFormFields) => {
    const payload = transformFieldsToPayload(fields);

    mutate(payload, {
      onSuccess: ({ data }: { data: UserProfile }) => {
        queryClient.setQueryData(buildQueryKey('profiles', data._id), data);
        navigate('/directory');
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
      <UserProfileForm onFinish={handleAddUserProfile} isSaving={isPending} />
    </>
  );
};

export default AddUserProfilePage;
