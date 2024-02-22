import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import GivingPage from './components/giving-page/GivingPage.tsx';
import DirectoryPage from './components/directory-page/DirectoryPage.tsx';
import ErrorPage from './components/error-page/ErrorPage.tsx';
import HomePage from './components/home-page/HomePage.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'directory',
        element: <DirectoryPage />
      },
      {
        path: 'giving',
        element: <GivingPage />
      },
      {
        index: true,
        element: <HomePage />
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
