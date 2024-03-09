import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GivingPage from './components/giving-page/GivingPage.tsx';
import DirectoryPage from './components/directory-page/DirectoryPage.tsx';
import HomePage from './components/home-page/HomePage.tsx';
import { AuthProvider } from './hooks/useAuth.tsx';
import { ProtectedRoute } from './components/protected-route/ProtectedRoute.tsx';
import LoginPage from './components/login-page/LoginPage.tsx';
import SignupPage from './components/signup-page/SignupPage.tsx';
import TeamsPage from './components/teams-page/TeamsPage.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AddTeamPage from './components/teams-page/AddTeamPage.tsx';
import EditTeamPage from './components/teams-page/EditTeamPage.tsx';
import AddUserProfilePage from './components/directory-page/AddUserProfilePage.tsx';
import EditUserProfilePage from './components/directory-page/EditUserProfilePage.tsx';
import MyProfilePage from './components/user-profile-page/MyProfilePage.tsx';
import NotFoundPage from './components/not-found-page/NotFoundPage.tsx';
import AccountsPage from './components/accounts-page/AccountsPage.tsx';
import AddAccountPage from './components/accounts-page/AddAccountPage.tsx';
import EditAccountPage from './components/accounts-page/EditAccountPage.tsx';
import ContributionsPage from './components/contributions-page/ContributionsPage.tsx';
import AddContributionPage from './components/contributions-page/AddContributionPage.tsx';
import EditContributionPage from './components/contributions-page/EditContributionPage.tsx';
import AddVendorPage from './components/vendors-page/AddVendorPage.tsx';
import EditVendorPage from './components/vendors-page/EditVendorPage.tsx';
import VendorsPage from './components/vendors-page/VendorsPage.tsx';

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
