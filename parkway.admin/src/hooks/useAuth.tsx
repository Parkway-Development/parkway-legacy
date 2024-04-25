import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { jwtDecode } from 'jwt-decode';
import { UserProfile } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  profileId?: string;
}

export type InternalLoginResponse = {
  user: AuthUser;
  profile: UserProfile | undefined;
  errorMessage: string | undefined;
  hasValidProfile: boolean;
};

interface AuthContextType {
  isLoggedIn: boolean;
  login: (data: LoginResponse) => InternalLoginResponse;
  logout: () => void;
  storeProfileId: (profileId: string, user: AuthUser) => void;
  token: string | undefined;
  user: AuthUser | undefined;
  hasClaim: (claimKey: AppClaimKeys) => boolean;
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

  const value = useMemo(() => {
    const login = (data: LoginResponse): InternalLoginResponse => {
      const { profile, token, message } = data;

      const tokenData = jwtDecode<TokenPayload>(token);
      const hasValidProfile =
        profile !== undefined && tokenData._id === profile?.user;

      const user: AuthUser = {
        id: tokenData._id,
        email: data.email,
        profileId: hasValidProfile ? profile._id : undefined
      };

      setUser(user);
      setToken(token);

      return {
        user,
        profile: profile && !message ? profile : undefined,
        errorMessage: message,
        hasValidProfile
      };
    };

    const tokenPayload = token ? jwtDecode<TokenPayload>(token) : undefined;

    const hasClaim = (claimKey: AppClaimKeys): boolean => {
      if (!tokenPayload) return false;
      return tokenPayload.claims[claimKey];
    };

    const clearState = () => {
      clearUser();
      clearToken();
    };

    const logout = () => {
      clearState();
      window.location.href = '/login';
    };

    const expiration = token ? jwtDecode(token).exp ?? 0 : 0;
    const currentDate = new Date();
    const isExpired = expiration * 1000 < currentDate.getTime();

    if (token && isExpired) {
      clearState();
    }

    const isLoggedIn =
      user !== undefined &&
      user.profileId !== undefined &&
      token !== undefined &&
      !isExpired;

    return {
      user: isLoggedIn ? user : undefined,
      login,
      logout,
      isLoggedIn,
      storeProfileId: (profileId: string, user: AuthUser) =>
        setUser({ ...user, profileId }),
      hasClaim,
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
  profile?: UserProfile;
  message?: string;
}

type TokenPayload = {
  _id: string;
  claims: {
    systemSettings: boolean;
    memberVetting: boolean;
    userManagement: boolean;
    accounting: boolean;
    budgeting: boolean;
    teamManagement: boolean;
    calendarManagement: boolean;
    prayerManagement: boolean;
    mediaManagement: boolean;
    socialMediaManagement: boolean;
    teams: string[];
  };
};

export type AppClaimKeys = Exclude<keyof TokenPayload['claims'], 'teams'>;
