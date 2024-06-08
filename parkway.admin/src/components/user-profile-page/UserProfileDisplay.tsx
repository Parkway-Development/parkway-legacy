import { UserProfile } from '../../types';
import { Button, Card } from 'antd';
import styles from './UserProfileDisplay.module.css';
import { InfoRow } from '../base-display-page';

interface UserProfileDisplay {
  profile: UserProfile;
  onEdit?: () => void;
}

const UserProfileDisplay = ({ profile, onEdit }: UserProfileDisplay) => {
  const { address } = profile;
  return (
    <>
      {onEdit && (
        <Button onClick={onEdit} type="primary">
          Edit
        </Button>
      )}
      <Card title="User Info" className={styles.card}>
        <p className={styles.name}>
          {profile.firstName} {profile.lastName}
        </p>
        {profile.email && profile.email.trim().length > 0 ? (
          <p>{profile.email}</p>
        ) : (
          <InfoRow label="Email" />
        )}
        <InfoRow label="Nickname" value={profile.nickname} />
        <InfoRow label="Middle Initial" value={profile.middleInitial} />
        <InfoRow
          label="Date of Birth"
          value={
            profile.dateOfBirth
              ? new Date(profile.dateOfBirth).toLocaleDateString()
              : undefined
          }
        />
      </Card>
      <Card title="Phone Numbers" className={styles.card}>
        <InfoRow label="Mobile" value={profile.mobilePhone} />
        <InfoRow label="Home" value={profile.homePhone} />
      </Card>
      <Card title="Address" className={styles.card}>
        {address ? (
          <>
            <p>{address.streetAddress1}</p>
            {address.streetAddress2 && <p>{address.streetAddress2}</p>}
            <p>
              {address.city}, {address.state} {address.zip}
            </p>
          </>
        ) : (
          'Not on file'
        )}
      </Card>
    </>
  );
};

export default UserProfileDisplay;
