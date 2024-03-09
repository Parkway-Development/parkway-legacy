import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.tsx';
import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }): ReactNode => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
