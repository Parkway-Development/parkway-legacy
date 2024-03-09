import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import { Alert, notification, Spin } from 'antd';
import UserProfileForm, {
  UserProfileFormFields
} from '../directory-page/UserProfileForm.tsx';
import { UserProfile } from '../../types/UserProfile.ts';
import { useAuth } from '../../hooks/useAuth.tsx';
import { useState } from 'react';
import UserProfileDisplay from './UserProfileDisplay.tsx';
import { trimStrings } from '../../utilities/stringHelpers.ts';

const MyProfilePage = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const {
    usersApi: { getById, update },
    formatError
  } = useApi();
  const profileId = user?.profileId;

  const { isPending, mutate } = useMutation({
    mutationFn: update
  });

  const {
    isPending: isLoading,
    data: response,
    error
  } = useQuery({
    enabled: profileId !== undefined,
    queryFn: getById(profileId!),
    queryKey: buildQueryKey('profiles', profileId ?? '')
  });

  const [api, contextHolder] = notification.useNotification();

  if (!profileId) {
    return <Alert type="error" message="Invalid proile" />;
  }

  if (error) {
    return <Alert type="error" message={formatError(error)} />;
  }

  if (isLoading || !response?.data) {
    return <Spin />;
  }

  const profile = response.data;

  const isNewUser = profile.firstName === 'NewUser';

  if (!isEditing && !isNewUser) {
    return (
      <>
        <h2>My Profile</h2>
        <UserProfileDisplay
          profile={profile}
          onEdit={() => setIsEditing(true)}
        />
      </>
    );
  }

  const initialValues: UserProfileFormFields = {
    ...profile,
    firstName: isNewUser ? '' : profile.firstName,
    lastName: isNewUser ? '' : profile.lastName
  };

  const finishEditing = () => setIsEditing(false);

  const handleUpdateUserProfile = (fields: UserProfileFormFields) => {
    const payload = trimStrings(fields);

    mutate(
      { ...payload, _id: profileId },
      {
        onSuccess: ({ data }: { data: UserProfile }) => {
          queryClient.setQueryData(buildQueryKey('profiles', data._id), data);
          finishEditing();
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
      <h2>My Profile</h2>
      <UserProfileForm
        onSave={handleUpdateUserProfile}
        isSaving={isPending}
        initialValues={initialValues}
        onCancel={finishEditing}
        isMyProfile
      />
    </>
  );
};

export default MyProfilePage;
