import { LimitedUserProfile } from '../../types';
import { UserNameDisplayById } from './UserNameDisplayById.tsx';

interface UserNameDisplayProps {
  user?: LimitedUserProfile | string;
}

export const UserNameDisplay = ({ user }: UserNameDisplayProps) => {
  if (!user) return null;

  if (typeof user === 'string') {
    return <UserNameDisplayById id={user} />;
  }

  return user.firstName + ' ' + user.lastName;
};

export default UserNameDisplay;
