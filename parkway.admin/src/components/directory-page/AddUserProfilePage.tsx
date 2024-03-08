import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import UserProfileForm from './UserProfileForm.tsx';
import { AddBaseApiEntityPage } from '../base-data-table-page';

const AddUserProfilePage = () => {
  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <Link to="/profiles">Directory</Link>
          },
          {
            title: 'Add Profile'
          }
        ]}
      />
      <AddBaseApiEntityPage
        queryKey="profiles"
        baseApiType="usersApi"
        addForm={UserProfileForm}
        mainPage="/profiles"
      />
    </>
  );
};

export default AddUserProfilePage;
