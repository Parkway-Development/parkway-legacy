import {
  BaseEntitySelect,
  ExportedBaseEntitySelectProps
} from '../base-select';
import { Team } from '../../types';
import { useAuth } from '../../hooks/useAuth.tsx';

const TeamSelect = (props: ExportedBaseEntitySelectProps) => {
  const { hasClaim, teamsLed } = useAuth();

  const enabledIds = hasClaim('calendarManagement') ? undefined : teamsLed;

  return (
    <BaseEntitySelect
      queryKey="teams"
      baseApiType="teamsApi"
      renderer={(value: Team) => value.name}
      enabledIds={enabledIds}
      {...props}
    />
  );
};

export default TeamSelect;
