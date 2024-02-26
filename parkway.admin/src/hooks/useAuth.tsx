import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { jwtDecode } from 'jwt-decode';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | undefined;
  login: (data: LoginResponse) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useLocalStorage<AuthUser>('user', undefined);
  const [token, setToken] = useLocalStorage<string>('token', undefined);

  const value = useMemo(() => {
    const login = (data: LoginResponse) => {
      const tokenData = jwtDecode<TokenPayload>(data.token);
      const user: AuthUser = {
        id: tokenData._id,
        name: `User Id ${tokenData._id}`,
        email: data.email
      };

      setUser(user);
      setToken(data.token);
    };

    const logout = () => {
      setUser(undefined);
      setToken(undefined);
    };

    const expiration = token ? jwtDecode(token).exp ?? 0 : 0;
    const currentDate = new Date();
    const isExpired = expiration * 1000 < currentDate.getTime();

    if (token && isExpired) {
      logout();
    }

    return {
      user,
      login,
      logout,
      isLoggedIn: user !== undefined && token !== undefined && !isExpired
    };
  }, [user, setUser, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext)!;
};

export interface LoginResponse {
  email: string;
  token: string;
}

interface TokenPayload {
  _id: string;
}
