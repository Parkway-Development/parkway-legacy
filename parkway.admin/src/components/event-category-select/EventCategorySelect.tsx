import {
  BaseEntitySelect,
  ExportedBaseEntitySelectProps
} from '../base-select';
import { EventCategory } from '../../types';

const EventCategorySelect = (props: ExportedBaseEntitySelectProps) => {
  return (
    <BaseEntitySelect
      queryKey="eventCategories"
      baseApiType="eventCategoriesApi"
      renderer={(value: EventCategory) => value.name}
      {...props}
    />
  );
};

export default EventCategorySelect;
