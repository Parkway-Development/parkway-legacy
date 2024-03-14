import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GivingPage from './components/giving-page';
import {
  AddUserProfilePage,
  DirectoryPage,
  EditUserProfilePage
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
  AccountsPage,
  AddAccountPage,
  EditAccountPage
} from './components/accounts-page';
import {
  AddContributionPage,
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
  AssetsPage,
  EditAssetPage
} from './components/assets-page';
import { AddSongPage, EditSongPage, SongsPage } from './components/songs-page';

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
                <Route path=":id/edit" element={<EditUserProfilePage />} />
                <Route index element={<DirectoryPage />} />
              </Route>
              <Route path="accounts">
                <Route path="assets">
                  <Route path="add" element={<AddAssetPage />} />
                  <Route path=":id/edit" element={<EditAssetPage />} />
                  <Route index element={<AssetsPage />} />
                </Route>
                <Route path="contributions">
                  <Route path="add" element={<AddContributionPage />} />
                  <Route path=":id/edit" element={<EditContributionPage />} />
                  <Route index element={<ContributionsPage />} />
                </Route>
                <Route path="vendors">
                  <Route path="add" element={<AddVendorPage />} />
                  <Route path=":id/edit" element={<EditVendorPage />} />
                  <Route index element={<VendorsPage />} />
                </Route>
                <Route path="add" element={<AddAccountPage />} />
                <Route path=":id/edit" element={<EditAccountPage />} />
                <Route index element={<AccountsPage />} />
              </Route>
              <Route path="giving" element={<GivingPage />} />
              <Route path="songs">
                <Route path="add" element={<AddSongPage />} />
                <Route path=":id/edit" element={<EditSongPage />} />
                <Route index element={<SongsPage />} />
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
