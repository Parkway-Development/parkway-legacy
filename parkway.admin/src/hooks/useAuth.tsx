import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

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
    const login = (data: LoginResponse) => {
      const tokenData = jwtDecode<TokenPayload>(data.token);
      const user: AuthUser = {
        id: tokenData._id,
        name: `User Id ${tokenData._id}`,
        email: data.email
      };

      setUser(user);
      setToken(data.token);
      navigate('/', { replace: true });
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
}

interface TokenPayload {
  _id: string;
}
