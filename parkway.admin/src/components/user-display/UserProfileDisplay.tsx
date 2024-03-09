import { UserProfile } from '../../types';

interface UserProfileDisplayProps {
  user: UserProfile;
}

const UserProfileDisplay = ({ user }: UserProfileDisplayProps) => {
  return user.firstName + ' ' + user.lastName;
};

export default UserProfileDisplay;
