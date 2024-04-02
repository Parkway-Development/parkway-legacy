import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GivingPage from './components/giving-page';
import {
  AddUserProfilePage,
  DirectoryPage,
  EditUserProfilePage,
  UserProfilePage
} from './components/directory-page';
import HomePage from './components/home-page';
import { AuthProvider } from './hooks/useAuth.tsx';
import ProtectedRoute from './components/protected-route';
import LoginPage from './components/login-page';
import SignupPage from './components/signup-page';
import { AddTeamPage, TeamsPage, EditTeamPage } from './components/teams-page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MyProfilePage } from './components/user-profile-page';
import NotFoundPage from './components/not-found-page';
import {
  AddAccountPage,
  EditAccountPage,
  AccountPage,
  AccountsPage
} from './components/accounts-page';
import {
  AddContributionPage,
  ContributionPage,
  ContributionsPage,
  EditContributionPage
} from './components/contributions-page';
import {
  AddVendorPage,
  EditVendorPage,
  VendorsPage
} from './components/vendors-page';
import {
  AddAssetPage,
  AssetPage,
  AssetsPage,
  EditAssetPage
} from './components/assets-page';
import { AddSongPage, EditSongPage, SongsPage } from './components/songs-page';
import {
  AddEventPage,
  EditEventPage,
  EventsPage
} from './components/events-page';
import {
  AddEventCategoryPage,
  EditEventCategoryPage,
  EventCategoriesPage
} from './components/event-categories-page';
import { AddEnumPage, EditEnumPage, EnumsPage } from './components/enums-page';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            >
              <Route path="profiles">
                <Route path="add" element={<AddUserProfilePage />} />
                <Route path="me" element={<MyProfilePage />} />
                <Route path=":id" element={<UserProfilePage />} />
                <Route path=":id/edit" element={<EditUserProfilePage />} />
                <Route index element={<DirectoryPage />} />
              </Route>
              <Route path="accounts">
                <Route path="assets">
                  <Route path="add" element={<AddAssetPage />} />
                  <Route path=":id" element={<AssetPage />} />
                  <Route path=":id/edit" element={<EditAssetPage />} />
                  <Route index element={<AssetsPage />} />
                </Route>
                <Route path="contributions">
                  <Route path="add" element={<AddContributionPage />} />
                  <Route path=":id" element={<ContributionPage />} />
                  <Route path=":id/edit" element={<EditContributionPage />} />
                  <Route index element={<ContributionsPage />} />
                </Route>
                <Route path="vendors">
                  <Route path="add" element={<AddVendorPage />} />
                  <Route path=":id/edit" element={<EditVendorPage />} />
                  <Route index element={<VendorsPage />} />
                </Route>
                <Route path="add" element={<AddAccountPage />} />
                <Route path=":id" element={<AccountPage />} />
                <Route path=":id/edit" element={<EditAccountPage />} />
                <Route index element={<AccountsPage />} />
              </Route>
              <Route path="events">
                <Route path="categories">
                  <Route path="add" element={<AddEventCategoryPage />} />
                  <Route path=":id/edit" element={<EditEventCategoryPage />} />
                  <Route index element={<EventCategoriesPage />} />
                </Route>
                <Route path="add" element={<AddEventPage />} />
                <Route path=":id/edit" element={<EditEventPage />} />
                <Route index element={<EventsPage />} />
              </Route>
              <Route path="giving" element={<GivingPage />} />
              <Route path="songs">
                <Route path="add" element={<AddSongPage />} />
                <Route path=":id/edit" element={<EditSongPage />} />
                <Route index element={<SongsPage />} />
              </Route>
              <Route path="platform">
                <Route path="enums">
                  <Route path="add" element={<AddEnumPage />} />
                  <Route path=":id/edit" element={<EditEnumPage />} />
                  <Route index element={<EnumsPage />} />
                </Route>
              </Route>
              <Route path="teams">
                <Route path="add" element={<AddTeamPage />} />
                <Route path=":id/edit" element={<EditTeamPage />} />
                <Route index element={<TeamsPage />} />
              </Route>
              <Route index element={<HomePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
