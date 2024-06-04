import { Team } from '../../types';
import { TeamNameDisplayById } from './TeamNameDisplayById.tsx';

interface TeamNameDisplayProps {
  team?: Team | string;
}

export const TeamNameDisplay = ({ team }: TeamNameDisplayProps) => {
  if (!team) return null;

  if (typeof team === 'string') {
    return <TeamNameDisplayById id={team} />;
  }

  return team.name;
};

export default TeamNameDisplay;
