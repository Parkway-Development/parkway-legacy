import {
  BaseEntitySelect,
  ExportedBaseEntitySelectProps
} from '../base-select';
import { Team } from '../../types';

const TeamSelect = (props: ExportedBaseEntitySelectProps) => {
  return (
    <BaseEntitySelect
      queryKey="teams"
      baseApiType="teamsApi"
      renderer={(value: Team) => value.name}
      {...props}
    />
  );
};

export default TeamSelect;
