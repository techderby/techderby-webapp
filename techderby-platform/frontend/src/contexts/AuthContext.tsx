import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { apiClient } from '../lib/api';
import type { AuthUser, RegisterInput, LoginInput, ProfileUpdateInput } from '../types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  jwt: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput, rememberMe?: boolean) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
  updateProfile: (data: ProfileUpdateInput) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const JWT_KEY = 'td_jwt';
const USER_KEY = 'td_user';

/** Read JWT from either storage (sessionStorage = no remember-me, localStorage = remember-me) */
function readStoredJwt(): string | null {
  return sessionStorage.getItem(JWT_KEY) || localStorage.getItem(JWT_KEY);
}
function readStoredUser(): AuthUser | null {
  try {
    const stored = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [jwt, setJwt] = useState<string | null>(() => readStoredJwt());
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(!!readStoredJwt());

  const persistAuth = useCallback((newJwt: string, newUser: AuthUser, rememberMe = true) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    // Clear from the other storage to avoid stale tokens
    const other = rememberMe ? sessionStorage : localStorage;
    other.removeItem(JWT_KEY);
    other.removeItem(USER_KEY);
    storage.setItem(JWT_KEY, newJwt);
    storage.setItem(USER_KEY, JSON.stringify(newUser));
    setJwt(newJwt);
    setUser(newUser);
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(JWT_KEY);
    sessionStorage.removeItem(USER_KEY);
    setJwt(null);
    setUser(null);
  }, []);

  // Re-fetch user when JWT exists on mount
  useEffect(() => {
    if (!jwt) {
      setIsLoading(false);
      return;
    }
    apiClient
      .getMyProfile()
      .then((res) => {
        const freshUser = res.data as AuthUser;
        setUser(freshUser);
        const storage = localStorage.getItem(JWT_KEY) ? localStorage : sessionStorage;
        storage.setItem(USER_KEY, JSON.stringify(freshUser));
      })
      .catch(() => clearAuth())
      .finally(() => setIsLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for token expiry events from the axios interceptor
  useEffect(() => {
    const handler = () => clearAuth();
    window.addEventListener('td:auth:expired', handler);
    return () => window.removeEventListener('td:auth:expired', handler);
  }, [clearAuth]);

  const login = useCallback(async ({ identifier, password }: LoginInput, rememberMe = false) => {
    const trimmedIdentifier = identifier.trim();
    let res;

    try {
      res = await apiClient.login(trimmedIdentifier, password);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { error?: { message?: string } } } })
        ?.response?.data?.error?.message;
      const lowerIdentifier = trimmedIdentifier.toLowerCase();

      // Username login is case-sensitive in Strapi. Retry with lowercase so users
      // can sign in even if they typed uppercase characters.
      if (message === 'Invalid identifier or password' && lowerIdentifier !== trimmedIdentifier) {
        res = await apiClient.login(lowerIdentifier, password);
      } else {
        throw error;
      }
    }

    // Temporarily persist with base user so JWT is set for the next request
    persistAuth(res.data.jwt, res.data.user as AuthUser, rememberMe);
    // Then fetch the full profile (includes custom fields) and update
    try {
      const profileRes = await apiClient.getMyProfile();
      const freshUser = profileRes.data as AuthUser;
      setUser(freshUser);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(USER_KEY, JSON.stringify(freshUser));
    } catch {
      // Non-fatal: base user fields are still set
    }
  }, [persistAuth]);

  const register = useCallback(async (input: RegisterInput) => {
    const res = await apiClient.register(input);
    persistAuth(res.data.jwt, res.data.user as AuthUser);
  }, [persistAuth]);

  const logout = useCallback(() => clearAuth(), [clearAuth]);

  const updateProfile = useCallback(async (data: ProfileUpdateInput) => {
    if (!user) throw new Error('Not authenticated');
    const res = await apiClient.updateMe(user.id, data);
    // Use the response directly — /api/profile returns full custom fields
    const freshUser = { ...user, ...res.data } as AuthUser;
    setUser(freshUser);
    const storage = localStorage.getItem(JWT_KEY) ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(freshUser));
  }, [user]);

  const refreshUser = useCallback(async () => {
    if (!jwt) return;
    const res = await apiClient.getMyProfile();
    const freshUser = res.data as AuthUser;
    setUser(freshUser);
    const storage = localStorage.getItem(JWT_KEY) ? localStorage : sessionStorage;
    storage.setItem(USER_KEY, JSON.stringify(freshUser));
  }, [jwt]);

  return (
    <AuthContext.Provider
      value={{ user, jwt, isLoading, isAuthenticated: !!jwt && !!user, login, register, logout, updateProfile, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
