import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { jwtDecode } from 'jwt-decode';
import { UserProfile } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  profileId?: string;
}

export interface InternalLoginResponse {
  user: AuthUser;
  profile: UserProfile | undefined;
  errorMessage: string | undefined;
  hasValidProfile: boolean;
}

interface AuthContextType {
  isLoggedIn: boolean;
  login: (data: LoginResponse) => InternalLoginResponse;
  logout: () => void;
  storeProfileId: (profileId: string, user: AuthUser) => void;
  token: string | undefined;
  user: AuthUser | undefined;
  hasClaim: (claimKey: AppClaimKeys) => boolean;
  teamsLed: string[];
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

      const keysToCheck: AppClaimKeys[] = [claimKey, 'isspecops'];
      let canAccess = false;

      keysToCheck.forEach((key) => {
        const claimValue = tokenPayload.claims[key];
        if (claimValue === true || claimValue === 'true') {
          canAccess = true;
        }
      });

      return canAccess;
    };

    const teamsLed =
      tokenPayload?.claims?.teamsLed && tokenPayload.claims.teamsLed.length > 0
        ? tokenPayload.claims.teamsLed
        : [];

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
      teamsLed,
      token
    };
  }, [user, setUser, token, clearToken, clearUser, setToken]);

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

interface TokenPayload {
  _id: string;
  claims: {
    isspecops: boolean | string;
    systemSettings: boolean | string;
    memberVetting: boolean | string;
    userManagement: boolean | string;
    accounting: boolean | string;
    attendance: boolean | string;
    budgeting: boolean | string;
    teamManagement: boolean | string;
    calendarManagement: boolean | string;
    prayerManagement: boolean | string;
    mediaManagement: boolean | string;
    socialMediaManagement: boolean | string;
    teams: string[];
    teamsLed: string[];
  };
}

export type AppClaimKeys = Exclude<
  keyof TokenPayload['claims'],
  'teams' | 'teamsLed'
>;
