import { UserProfile } from '../../types';

interface UserProfileDisplayProps {
  user: UserProfile;
}

export const UserNameDisplay = ({ user }: UserProfileDisplayProps) => {
  return user.firstName + ' ' + user.lastName;
};

export default UserNameDisplay;
