import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import { Song } from '../../types';
import { songsColumns } from './columns.tsx';
import SongForm from './SongForm.tsx';
import SongDisplay from './SongDisplay.tsx';

const sharedProps: SharedBasePageProps = {
  queryKey: 'songs',
  baseApiType: 'songsApi',
  mainPage: '/songs'
};

const SongsPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={songsColumns}
    title="Songs"
    responsiveCardRenderer={(item) => item.title}
  />
);

const SongPage = () => (
  <BaseDisplayPage
    {...sharedProps}
    render={(item: Song) => <SongDisplay {...item} />}
  />
);

const AddSongPage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={SongForm} />
);

const EditSongPage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={SongForm} />
);

export { AddSongPage, EditSongPage, SongsPage, SongPage };
