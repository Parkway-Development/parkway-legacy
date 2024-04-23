import { Enum } from '../../types';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';

export const enumColumns: OrderedColumnsType<Enum> = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    displayOrder: 1
  },
  {
    title: 'Values',
    dataIndex: 'values',
    key: 'values',
    displayOrder: 2,
    render: (value: Enum['values']) => value.length
  }
];
