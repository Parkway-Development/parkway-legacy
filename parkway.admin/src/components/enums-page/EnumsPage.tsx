import { Enum } from '../../types';
import { BaseApiDataTablePage } from '../base-data-table-page';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';

const enumColumns: OrderedColumnsType<Enum> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    displayOrder: 1,
    isPartOfCardTitle: true
  },
  {
    title: 'Values',
    dataIndex: 'values',
    key: 'values',
    displayOrder: 2,
    render: (value: Enum['values']) => value.length
  }
];

const EnumsPage = () => (
  <BaseApiDataTablePage
    queryKey="enums"
    baseApiType="enumsApi"
    columns={enumColumns}
    title="Enums"
    cardTitleRenderFn={(item) => item.name}
  />
);

export default EnumsPage;
