import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
import {
  AddTeamPage,
  TeamsPage,
  EditTeamPage,
  TeamPage
} from './components/teams-page';
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
  VendorPage,
  VendorsPage
} from './components/vendors-page';
import {
  AddAssetPage,
  AssetPage,
  AssetsPage,
  EditAssetPage
} from './components/assets-page';
import {
  AddSongPage,
  EditSongPage,
  SongPage,
  SongsPage
} from './components/songs-page';
import {
  AddEventPage,
  EditEventPage,
  EventPage,
  EventsPage
} from './components/events-page';
import {
  AddEventCategoryPage,
  EditEventCategoryPage,
  EventCategoriesPage,
  EventCategoryPage
} from './components/event-categories-page';
import {
  AddEnumPage,
  EditEnumPage,
  EnumsPage,
  EnumPage
} from './components/enums-page';
import ClaimRoute from './components/claim-route/ClaimRoute.tsx';
import { isAxiosError } from 'axios';
import ResetPasswordPage from './components/reset-password-page';
import ForgotPasswordPage from './components/forgot-password-page';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SpecOpsPage from './components/spec-ops-page';
import TeamDashboardPage from './components/team-dashboard';
import { ApiProvider } from './hooks/useApi.tsx';

const MAX_RETRIES = 6;
const HTTP_STATUS_TO_NOT_RETRY = [400, 401, 403, 404];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (failureCount > MAX_RETRIES) {
          return false;
        }

        return !(
          isAxiosError(error) &&
          HTTP_STATUS_TO_NOT_RETRY.includes(error.response?.status ?? 0)
        );
      }
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ApiProvider>
          <QueryClientProvider client={queryClient}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot" element={<ForgotPasswordPage />} />
              <Route
                path="/reset/:resetToken"
                element={<ResetPasswordPage />}
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <App />
                  </ProtectedRoute>
                }
              >
                <Route path="profiles/me" element={<MyProfilePage />} />
                <Route
                  path="profiles"
                  element={<ClaimRoute claim="userManagement" />}
                >
                  <Route path="add" element={<AddUserProfilePage />} />
                  <Route path=":id" element={<UserProfilePage />} />
                  <Route path=":id/edit" element={<EditUserProfilePage />} />
                  <Route index element={<DirectoryPage />} />
                </Route>
                <Route
                  path="accounts"
                  element={<ClaimRoute claim="accounting" />}
                >
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
                    <Route path=":id" element={<VendorPage />} />
                    <Route path=":id/edit" element={<EditVendorPage />} />
                    <Route index element={<VendorsPage />} />
                  </Route>
                  <Route path="add" element={<AddAccountPage />} />
                  <Route path=":id" element={<AccountPage />} />
                  <Route path=":id/edit" element={<EditAccountPage />} />
                  <Route index element={<AccountsPage />} />
                </Route>
                <Route
                  path="events"
                  element={
                    <ClaimRoute claim="calendarManagement" allowTeamLeads />
                  }
                >
                  <Route path="categories">
                    <Route path="add" element={<AddEventCategoryPage />} />
                    <Route path=":id" element={<EventCategoryPage />} />
                    <Route
                      path=":id/edit"
                      element={<EditEventCategoryPage />}
                    />
                    <Route index element={<EventCategoriesPage />} />
                  </Route>
                  <Route path="add" element={<AddEventPage />} />
                  <Route path=":id" element={<EventPage />} />
                  <Route path=":id/edit" element={<EditEventPage />} />
                  <Route index element={<EventsPage />} />
                </Route>
                <Route
                  path="specops"
                  element={<ClaimRoute claim="isspecops" />}
                >
                  <Route index element={<SpecOpsPage />} />
                </Route>
                <Route path="songs">
                  <Route path="add" element={<AddSongPage />} />
                  <Route path=":id" element={<SongPage />} />
                  <Route path=":id/edit" element={<EditSongPage />} />
                  <Route index element={<SongsPage />} />
                </Route>
                <Route
                  path="platform"
                  element={<ClaimRoute claim="systemSettings" />}
                >
                  <Route path="enums">
                    <Route path="add" element={<AddEnumPage />} />
                    <Route path=":id" element={<EnumPage />} />
                    <Route path=":id/edit" element={<EditEnumPage />} />
                    <Route index element={<EnumsPage />} />
                  </Route>
                </Route>
                <Route path="team">
                  <Route path=":id" element={<TeamDashboardPage />} />
                </Route>
                <Route
                  path="teams"
                  element={<ClaimRoute claim="teamManagement" />}
                >
                  <Route path="add" element={<AddTeamPage />} />
                  <Route path=":id" element={<TeamPage />} />
                  <Route path=":id/edit" element={<EditTeamPage />} />
                  <Route index element={<TeamsPage />} />
                </Route>
                <Route index element={<HomePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
