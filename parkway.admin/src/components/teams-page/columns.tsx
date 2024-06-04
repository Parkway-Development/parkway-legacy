import { Team } from '../../types';
import { UserNameDisplay } from '../user-name-display';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';

export const teamColumns: OrderedColumnsType<Team> = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 200,
    key: 'name',
    displayOrder: 1
  },
  {
    title: 'Leader',
    width: 200,
    dataIndex: 'leader',
    render: (value: Team['leader']) => <UserNameDisplay user={value} />,
    key: 'leader',
    displayOrder: 2
  },
  {
    title: 'Members',
    width: 50,
    dataIndex: 'members',
    align: 'center',
    render: (value: Team['members']) => value.length,
    key: 'members',
    displayOrder: 3
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    displayOrder: 4
  }
];
