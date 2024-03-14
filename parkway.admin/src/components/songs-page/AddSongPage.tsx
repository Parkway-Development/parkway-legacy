import SongForm from './SongForm.tsx';
import { AddBaseApiEntityPage } from '../base-data-table-page';

const AddSongPage = () => {
  return (
    <AddBaseApiEntityPage
      queryKey="songs"
      baseApiType="songsApi"
      addForm={SongForm}
      mainPage="/songs"
    />
  );
};

export default AddSongPage;
