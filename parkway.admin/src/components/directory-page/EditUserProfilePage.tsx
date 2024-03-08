import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import UserProfileForm from './UserProfileForm.tsx';
import { EditBaseApiEntityPage } from '../base-data-table-page';

const EditUserProfilePage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/profiles">Directory</Link>
          },
          {
            title: 'Edit Profile'
          }
        ]}
      />
      <EditBaseApiEntityPage
        queryKey="profiles"
        baseApiType="usersApi"
        editForm={UserProfileForm}
        mainPage="/profiles"
      />
    </>
  );
};

export default EditUserProfilePage;
