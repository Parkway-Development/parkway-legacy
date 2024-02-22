import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.tsx';
import { ReactNode } from 'react';

export const ProtectedRoute = ({
  children
}: {
  children: ReactNode;
}): ReactNode => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
