import { InternalLoginResponse, useAuth } from '../../hooks/useAuth.tsx';
import styles from './ProfileVerification.module.css';
import { Alert, Card } from 'antd';
import { ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import useApi from '../../hooks/useApi.ts';
import { useNavigate } from 'react-router-dom';
import UserProfileForm, {
  transformFieldsToMyProfilePayload,
  transformFieldsToPayload,
  UserProfileFormFields
} from '../user-profile-page/UserProfileForm.tsx';
import { UserProfile } from '../../types/UserProfile.ts';

type ProfileVerificationProps = {
  loginResponse: InternalLoginResponse;
};

const ProfileVerification = ({ loginResponse }: ProfileVerificationProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { errorMessage, profile, user } = loginResponse;
  const {
    createUserProfile,
    formatError,
    joinProfileAndUser,
    updateUserProfile
  } = useApi();
  const {
    isPending: isJoining,
    mutate: performJoin,
    error: joinError
  } = useMutation({
    mutationFn: joinProfileAndUser
  });

  const {
    isPending: isAdding,
    mutate: createProfile,
    error: createProfileError
  } = useMutation({
    mutationFn: createUserProfile
  });

  const {
    isPending: isUpdating,
    mutate: updateProfile,
    error: updateProfileError
  } = useMutation({
    mutationFn: updateUserProfile
  });

  const disableOptions = isJoining || isAdding || isUpdating;

  let content: ReactNode;

  const showError =
    (errorMessage && errorMessage !== 'No profile found') ||
    joinError !== null ||
    createProfileError !== null ||
    updateProfileError !== null;

  if (showError) {
    let error: string;

    if (errorMessage) error = errorMessage;
    else if (joinError) error = formatError(joinError);
    else if (createProfileError) error = formatError(createProfileError);
    else if (updateProfileError) error = formatError(updateProfileError);
    else error = 'Unexpected error finding profile';

    content = <Alert className={styles.error} message={error} type="error" />;
  } else {
    const handleJoin = (profileId: string) => {
      performJoin(
        { userId: user.id, profileId: profileId },
        {
          onSuccess: () => {
            navigate('/', { replace: true });
          }
        }
      );
    };

    const handleAddUserProfile = (fields: UserProfileFormFields) => {
      const payload = transformFieldsToPayload(fields);

      createProfile(payload, {
        onSuccess: ({ data }: { data: UserProfile }) => {
          handleJoin(data._id);
        }
      });
    };

    const handleUpdateUserProfile = (fields: UserProfileFormFields) => {
      const payload = transformFieldsToPayload(fields);

      updateProfile(
        { ...payload, _id: profile!._id },
        {
          onSuccess: ({ data }: { data: UserProfile }) => {
            handleJoin(data._id);
          }
        }
      );
    };

    const handleSubmit = (values: UserProfileFormFields) => {
      const payload = transformFieldsToMyProfilePayload(values);

      if (!profile) {
        handleAddUserProfile({
          ...payload,
          member: false,
          memberStatus: 'inactive',
          applicationRole: 'none',
          email: user.email
        });
      } else {
        handleUpdateUserProfile({ ...profile, ...payload, email: user.email });
      }
    };

    content = (
      <>
        {profile && (
          <p className={styles.email}>
            Information was already found for your email address. Please enter
            your information below.
          </p>
        )}
        <p className={styles.email}>Email: {user.email}</p>
        <UserProfileForm
          isSaving={disableOptions}
          onFinish={handleSubmit}
          onCancel={() => {
            logout();
            window.location.reload();
          }}
          submitText="Complete Registration"
          cancelText="Cancel"
          isMyProfile
        />
      </>
    );
  }

  return (
    <div className={styles.entryPage}>
      <Card
        className={styles.card}
        title="Complete Registration"
        bordered={false}
        style={{ width: 500 }}
      >
        {content}
      </Card>
    </div>
  );
};

export default ProfileVerification;
