import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef
} from 'react';
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
  const [user, setUser] = useLocalStorage<AuthUser>('user', undefined);
  const [token, setToken] = useLocalStorage<string>('token', undefined);
  const isLoggedInRef = useRef<boolean>();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const shouldRedirect = isLoggedInRef.current === undefined;
      isLoggedInRef.current = true;

      if (shouldRedirect) {
        navigate('/');
      }
    } else if (isLoggedInRef.current) {
      isLoggedInRef.current = false;
      navigate('/login');
    }
  }, [token]);

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
      isLoggedIn: user !== undefined && token !== undefined && !isExpired,
      token
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
