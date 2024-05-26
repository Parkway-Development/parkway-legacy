import { UserProfile } from '../../types';
import { Button, Card } from 'antd';
import styles from './UserProfileDisplay.module.css';
import { InfoRow } from '../base-display-page';

interface UserProfileDisplay {
  profile: UserProfile;
  onEdit?: () => void;
}

const UserProfileDisplay = ({ profile, onEdit }: UserProfileDisplay) => {
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
        <p>{profile.streetAddress1}</p>
        {profile.streetAddress2 && <p>{profile.streetAddress2}</p>}
        <p>
          {profile.city}, {profile.state} {profile.zip}
        </p>
      </Card>
    </>
  );
};

export default UserProfileDisplay;
