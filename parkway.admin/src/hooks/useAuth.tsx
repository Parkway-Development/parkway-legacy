import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | undefined;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<AuthUser>('user', undefined);

  const value = useMemo(() => {
    const login = (user: AuthUser) => {
      setUser(user);
    };

    const logout = () => {
      setUser(undefined);
    };

    return {
      user,
      login,
      logout
    };
  }, [user, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};
