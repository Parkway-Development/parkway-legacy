import { LimitedUserProfile } from '../../types';

interface UserProfileDisplayProps {
  user: LimitedUserProfile;
}

export const UserNameDisplay = ({ user }: UserProfileDisplayProps) => {
  return user.firstName + ' ' + user.lastName;
};

export default UserNameDisplay;
