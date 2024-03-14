import SongForm from './SongForm.tsx';
import { EditBaseApiEntityPage } from '../base-data-table-page';

const EditSongPage = () => {
  return (
    <EditBaseApiEntityPage
      queryKey="songs"
      baseApiType="songsApi"
      editForm={SongForm}
      mainPage="/songs"
    />
  );
};

export default EditSongPage;
