import { UserProfile } from '../../types/UserProfile.ts';

interface UserProfileDisplayProps {
  user: UserProfile;
}

const UserProfileDisplay = ({ user }: UserProfileDisplayProps) => {
  return user.firstname + ' ' + user.lastname;
};

export default UserProfileDisplay;
