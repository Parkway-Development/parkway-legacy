import { InternalLoginResponse, useAuth } from '../../hooks/useAuth.tsx';
import styles from './ProfileVerification.module.css';
import { Alert, Button, Card, Input, Spin } from 'antd';
import {
  ReactNode,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState
} from 'react';
import { useMutation } from '@tanstack/react-query';
import useApi from '../../hooks/useApi.ts';
import { useNavigate } from 'react-router-dom';
import { addProfileInitialValues } from '../user-profile-page/UserProfileForm.tsx';
import { UserProfile } from '../../types/UserProfile.ts';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

type ProfileVerificationProps = {
  loginResponse: InternalLoginResponse;
};

type InputComparison = {
  placeholder: string;
  field: keyof UserProfile;
  input?: string;
  compareFn: (input?: string) => boolean;
  isValid?: boolean;
};

const stringComparison = (
  input: string | undefined,
  expected: string,
  isPhoneNumber: boolean = false
) => {
  if (expected === input) return true;
  if (!input?.trim().length) return false;

  if (isPhoneNumber) {
    return input.replace(/[^0-9]/g, '') === expected.replace(/[^0-9]/g, '');
  }

  return input.trim().toLowerCase() === expected.trim().toLowerCase();
};

const ProfileVerification = ({ loginResponse }: ProfileVerificationProps) => {
  const navigate = useNavigate();
  const { storeProfileId } = useAuth();
  const { errorMessage, profile, user } = loginResponse;
  const [inputComparisons, setInputComparison] = useState<InputComparison[]>(
    () => {
      if (!profile) return [];

      const result: InputComparison[] = [];

      if (profile.firstName) {
        result.push({
          placeholder: 'First Name',
          field: 'firstName',
          compareFn: (input) => stringComparison(input, profile.firstName)
        });
      }

      if (profile.lastName) {
        result.push({
          placeholder: 'Last Name',
          field: 'lastName',
          compareFn: (input) => stringComparison(input, profile.lastName)
        });
      }

      if (profile.mobilePhone) {
        result.push({
          placeholder: 'Mobile Phone',
          field: 'mobilePhone',
          compareFn: (input) =>
            stringComparison(input, profile.mobilePhone!, true)
        });
      }

      if (profile.homePhone) {
        result.push({
          placeholder: 'Home Phone',
          field: 'homePhone',
          compareFn: (input) =>
            stringComparison(input, profile.homePhone!, true)
        });
      }

      if (profile.streetAddress1) {
        result.push({
          placeholder: 'Address Line 1',
          field: 'streetAddress1',
          compareFn: (input) => stringComparison(input, profile.streetAddress1!)
        });
      }

      if (profile.streetAddress2) {
        result.push({
          placeholder: 'Address Line 2',
          field: 'streetAddress2',
          compareFn: (input) => stringComparison(input, profile.streetAddress2!)
        });
      }

      if (profile.city) {
        result.push({
          placeholder: 'City',
          field: 'city',
          compareFn: (input) => stringComparison(input, profile.city!)
        });
      }

      if (profile.state) {
        result.push({
          placeholder: 'State',
          field: 'state',
          compareFn: (input) => stringComparison(input, profile.state!)
        });
      }

      if (profile.zip) {
        result.push({
          placeholder: 'Zip',
          field: 'zip',
          compareFn: (input) => stringComparison(input, profile.zip!)
        });
      }

      return result;
    }
  );
  const {
    usersApi: { create, joinProfileAndUser },
    formatError
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
    mutationFn: create
  });

  const handleJoin = (profileId: string) => {
    performJoin(
      { userId: user.id, profileId },
      {
        onSuccess: () => {
          storeProfileId(profileId, user);
          navigate('/profiles/me', { replace: true });
        }
      }
    );
  };

  const createNewUserProfile = () => {
    const payload = {
      ...addProfileInitialValues,
      firstName: 'NewUser',
      lastName: user.email,
      email: user.email
    };

    createProfile(payload, {
      onSuccess: ({ data }: { data: UserProfile }) => {
        handleJoin(data._id);
      }
    });
  };

  useEffect(() => {
    if (!profile) {
      createNewUserProfile();
    }
  }, []);

  const handleInputChange = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value;
      const fieldName = e.currentTarget.name;

      setInputComparison((prev) =>
        prev.map((i) =>
          i.field === fieldName
            ? { ...i, input: newValue, isValid: i.compareFn(newValue) }
            : i
        )
      );
    },
    []
  );

  let content: ReactNode;

  const showError =
    (errorMessage && errorMessage !== 'No profile found') ||
    joinError !== null ||
    createProfileError !== null;

  if (showError) {
    let error: string;

    if (errorMessage && errorMessage !== 'No profile found')
      error = errorMessage;
    else if (joinError) error = formatError(joinError);
    else if (createProfileError) error = formatError(createProfileError);
    else error = 'Unexpected error finding profile';

    content = <Alert className={styles.error} message={error} type="error" />;
  } else if (!profile) {
    content = (
      <Card
        className={styles.card}
        title="Complete Registration"
        bordered={false}
        style={{ width: 500 }}
      >
        <div className={styles.createProfile}>
          <Spin size="large" />
          <p>Creating your profile...</p>
        </div>
      </Card>
    );
  } else {
    const validInputs = inputComparisons.reduce(
      (p, current) => (current.isValid ? p + 1 : p),
      0
    );

    const canValidate =
      validInputs === inputComparisons.length && validInputs > 0;

    const handleValidate = () => {
      if (canValidate) {
        handleJoin(profile._id);
      }
    };

    const processing = isJoining || isAdding;

    content = (
      <Card className={styles.verifyMatch}>
        <div className={styles.header}>
          <h2>Hey! We are glad you joined us!</h2>
          <p>
            We found a profile that seems to match your email address. Can you
            tell us a bit more about yourself to see if it is a match?
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Your Input</th>
              <th>Our Data</th>
            </tr>
          </thead>
          <tbody>
            {inputComparisons.map(({ placeholder, input, isValid, field }) => (
              <tr key={field}>
                <td>
                  <Input
                    placeholder={placeholder}
                    value={input}
                    onChange={handleInputChange}
                    name={field}
                    autoComplete="off"
                    readOnly={processing}
                  />
                </td>
                <td className={styles.validColumn}>
                  {isValid ? (
                    <CheckOutlined style={{ color: 'green' }} />
                  ) : (
                    <CloseOutlined style={{ color: 'red' }} />
                  )}
                  <Input
                    readOnly
                    tabIndex={-1}
                    placeholder={
                      isValid ? profile[field]?.toString() : '********'
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                {processing ? (
                  <Spin />
                ) : (
                  <div className={styles.tableFooter}>
                    <Button type="primary" onClick={createNewUserProfile}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleValidate}
                      disabled={!canValidate}
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </Card>
    );
  }

  return <div className={styles.entryPage}>{content}</div>;
};

export default ProfileVerification;
