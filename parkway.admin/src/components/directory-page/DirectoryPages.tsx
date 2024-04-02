import {
  AddBaseApiEntityPage,
  BaseApiDataTablePage,
  EditBaseApiEntityPage
} from '../base-data-table-page';
import { BaseDisplayPage } from '../base-display-page/BaseDisplayPage.tsx';
import { SharedBasePageProps } from '../base-data-table-page/types.ts';
import UserProfileDisplay from '../user-profile-page/UserProfileDisplay.tsx';
import UserProfileForm from './UserProfileForm.tsx';
import { directoryColumns } from './columns.tsx';
import UserNameDisplay from '../user-name-display/UserNameDisplay.tsx';
import { UserProfile } from '../../types';

const sharedProps: SharedBasePageProps = {
  queryKey: 'profiles',
  baseApiType: 'usersApi',
  mainPage: '/profiles'
};

const DirectoryPage = () => (
  <BaseApiDataTablePage
    {...sharedProps}
    columns={directoryColumns}
    title="Directory"
    addLinkTitle="Add User Profile"
    responsiveCardRenderer={(profile) => <UserNameDisplay user={profile} />}
  />
);

const UserProfilePage = () => (
  <BaseDisplayPage
    {...sharedProps}
    render={(profile: UserProfile) => <UserProfileDisplay profile={profile} />}
  />
);

const AddUserProfilePage = () => (
  <AddBaseApiEntityPage {...sharedProps} addForm={UserProfileForm} />
);

const EditUserProfilePage = () => (
  <EditBaseApiEntityPage {...sharedProps} editForm={UserProfileForm} />
);

export {
  AddUserProfilePage,
  EditUserProfilePage,
  DirectoryPage,
  UserProfilePage
};
