import { UserProfile } from '../../types/UserProfile.ts';
import { Button, Card } from 'antd';
import styles from './UserProfileDisplay.module.css';

type UserProfileDisplay = {
  profile: UserProfile;
  onEdit: () => void;
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => {
  const displayValue = value && value.trim().length > 0 ? value : '-';

  return (
    <div className={styles.infoRow}>
      <span>{label}:</span>
      <span>{displayValue}</span>
    </div>
  );
};

const UserProfileDisplay = ({ profile, onEdit }: UserProfileDisplay) => {
  return (
    <>
      <Button onClick={onEdit} type="primary">
        Edit
      </Button>
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
