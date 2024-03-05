import { InternalLoginResponse } from '../../hooks/useAuth.tsx';
import styles from './ProfileVerification.module.css';
import { Alert, Button, Card } from 'antd';
import { ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import useApi from '../../hooks/useApi.ts';
import { useNavigate } from 'react-router-dom';

type ProfileVerificationProps = {
  loginResponse: InternalLoginResponse;
};

const ProfileVerification = ({ loginResponse }: ProfileVerificationProps) => {
  const navigate = useNavigate();
  const { errorMessage, profile, user } = loginResponse;
  const { formatError, joinProfileAndUser } = useApi();
  const {
    isPending: isJoining,
    mutate: performJoin,
    error: joinError
  } = useMutation({
    mutationFn: joinProfileAndUser
  });

  const disableOptions = isJoining;

  let content: ReactNode;

  if (errorMessage || !profile || joinError) {
    let error: string;

    if (errorMessage) error = errorMessage;
    else if (joinError) error = formatError(joinError);
    else error = 'Unexpected error finding profile';

    content = <Alert className={styles.error} message={error} type="error" />;
  } else {
    const handleJoin = () => {
      performJoin(
        { userId: user.id, profileId: profile._id },
        {
          onSuccess: () => {
            navigate('/', { replace: true });
          }
        }
      );
    };

    const {
      firstName,
      middleInitial,
      lastName,
      nickname,
      mobilePhone,
      homePhone,
      streetAddress1,
      streetAddress2,
      city,
      state,
      zip
    } = profile;

    content = (
      <>
        <span>
          Information was already found for your email address. Please confirm
          whether the information below is correct. Edits to the profile can be
          made after verification.
        </span>
        <table className={styles.existingData}>
          <tbody>
            <tr>
              <td>First Name:</td>
              <td>{firstName}</td>
            </tr>
            {middleInitial && (
              <tr>
                <td>Middle Initial:</td>
                <td>{middleInitial}</td>
              </tr>
            )}
            <tr>
              <td>Last Name:</td>
              <td>{lastName}</td>
            </tr>
            {nickname && (
              <tr>
                <td>Nickname:</td>
                <td>{nickname}</td>
              </tr>
            )}
            {mobilePhone && (
              <tr>
                <td>Mobile Phone:</td>
                <td>{mobilePhone}</td>
              </tr>
            )}
            {homePhone && (
              <tr>
                <td>Home Phone:</td>
                <td>{homePhone}</td>
              </tr>
            )}
            {streetAddress1 && (
              <tr>
                <td>Address:</td>
                <td>
                  <div>{streetAddress1}</div>
                  {streetAddress2 && <div>{streetAddress2}</div>}
                  <div>
                    {city}, {state} {zip}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className={styles.footer}>
          <Button
            type="primary"
            onClick={handleJoin}
            loading={isJoining}
            disabled={disableOptions}
          >
            This is me
          </Button>
          <Button type="primary" danger disabled={disableOptions}>
            This is NOT me
          </Button>
        </div>
      </>
    );
  }

  return (
    <div className="entryPage">
      <Card
        title="Profile Verification"
        bordered={false}
        style={{ width: 500 }}
      >
        {content}
      </Card>
    </div>
  );
};

export default ProfileVerification;
