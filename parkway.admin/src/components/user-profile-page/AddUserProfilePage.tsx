import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useApi, { buildQueryKey } from '../../hooks/useApi.ts';
import UserProfileForm, { UserProfileFormFields } from './UserProfileForm.tsx';
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
    const payload: Omit<UserProfile, '_id'> = {
      firstname: fields.firstname.trim(),
      lastname: fields.lastname.trim(),
      middleinitial: fields.middleinitial?.trim(),
      nickname: fields.nickname?.trim(),
      dateofbirth: fields.dateofbirth,
      gender: fields.gender,
      email: fields.email?.trim(),
      mobile: fields.mobile?.trim(),
      streetaddress1: fields.streetaddress1?.trim(),
      streetaddress2: fields.streetaddress2?.trim(),
      city: fields.city?.trim(),
      state: fields.state?.trim(),
      zip: fields.zip?.trim(),
      userId: fields.userId,
      member: fields.member,
      status: fields.status,
      applicationrole: fields.applicationrole
    };

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
