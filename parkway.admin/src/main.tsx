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
import AddTeamPage from './components/team-page/AddTeamPage.tsx';
import EditTeamPage from './components/team-page/EditTeamPage.tsx';
import AddUserProfilePage from './components/user-profile-page/AddUserProfilePage.tsx';
import EditUserProfilePage from './components/user-profile-page/EditUserProfilePage.tsx';
import MyProfilePage from './components/user-profile-page/MyProfilePage.tsx';
import NotFoundPage from './components/not-found-page/NotFoundPage.tsx';
import AccountsPage from './components/accounts-page/AccountsPage.tsx';

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
              <Route path="directory" element={<DirectoryPage />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="profiles/add" element={<AddUserProfilePage />} />
              <Route path="profiles/me" element={<MyProfilePage />} />
              <Route
                path="profiles/:id/edit"
                element={<EditUserProfilePage />}
              />
              <Route path="giving" element={<GivingPage />} />
              <Route path="teams/add" element={<AddTeamPage />} />
              <Route path="teams/:id/edit" element={<EditTeamPage />} />
              <Route path="teams" element={<TeamsPage />} />
              <Route index element={<HomePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
