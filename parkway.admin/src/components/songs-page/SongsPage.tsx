import { Song } from '../../types';
import { BaseApiDataTablePage } from '../base-data-table-page';
import { OrderedColumnsType } from '../../hooks/useColumns.tsx';

const songsColumns: OrderedColumnsType<Song> = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    displayOrder: 1
  },
  {
    title: 'Subtitle',
    dataIndex: 'subtitle',
    key: 'subtitle',
    displayOrder: 2
  },
  {
    title: 'Tempo',
    dataIndex: 'tempo',
    key: 'tempo',
    displayOrder: 3
  },
  {
    title: 'Time Signature',
    dataIndex: 'timeSignature',
    key: 'timeSignature',
    displayOrder: 4
  },
  {
    title: 'Artists',
    dataIndex: 'artists',
    key: 'artists',
    displayOrder: 5,
    render: (value: Song['artists']) => value?.join(', ')
  },
  {
    title: 'CCLI License',
    dataIndex: 'ccliLicense',
    key: 'ccliLicense',
    displayOrder: 6
  },
  {
    title: 'Copyrights',
    dataIndex: 'copyrights',
    key: 'copyrights',
    displayOrder: 7,
    render: (value: Song['copyrights']) => value?.join(', ')
  },
  {
    title: 'Arrangements',
    dataIndex: 'arrangements',
    key: 'arrangements',
    displayOrder: 8,
    render: (value: Song['arrangements']) => value.length
  }
];

const SongsPage = () => (
  <BaseApiDataTablePage
    queryKey="songs"
    baseApiType="songsApi"
    columns={songsColumns}
    title="Songs"
    responsiveCardRenderer={(item) => item.title}
  />
);

export default SongsPage;
