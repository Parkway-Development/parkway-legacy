import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types/UserProfile.ts';

export interface AuthUser {
  id: string;
  email: string;
}

export type InternalLoginResponse = {
  user: AuthUser;
  profile: UserProfile | undefined;
  errorMessage: string | undefined;
};

interface AuthContextType {
  user: AuthUser | undefined;
  login: (data: LoginResponse) => InternalLoginResponse;
  logout: () => void;
  isLoggedIn: boolean;
  token: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser, clearUser] = useLocalStorage<AuthUser>(
    'user',
    undefined
  );

  const [token, setToken, clearToken] = useLocalStorage<string>(
    'token',
    undefined
  );

  const navigate = useNavigate();

  const value = useMemo(() => {
    const login = (data: LoginResponse): InternalLoginResponse => {
      const tokenData = jwtDecode<TokenPayload>(data.token);
      const user: AuthUser = {
        id: tokenData._id,
        email: data.email
      };

      setUser(user);
      setToken(data.token);

      const { profile } = data;

      return {
        user,
        profile: typeof profile !== 'string' ? profile : undefined,
        errorMessage: typeof profile === 'string' ? profile : undefined
      };
    };

    const clearState = () => {
      clearUser();
      clearToken();
    };

    const logout = () => {
      clearState();
      navigate('/login', { replace: true });
    };

    const expiration = token ? jwtDecode(token).exp ?? 0 : 0;
    const currentDate = new Date();
    const isExpired = expiration * 1000 < currentDate.getTime();

    if (token && isExpired) {
      clearState();
    }

    const isLoggedIn = user !== undefined && token !== undefined && !isExpired;

    return {
      user: isLoggedIn ? user : undefined,
      login,
      logout,
      isLoggedIn,
      token: isLoggedIn ? token : undefined
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
  profile?: string | UserProfile;
}

interface TokenPayload {
  _id: string;
}
