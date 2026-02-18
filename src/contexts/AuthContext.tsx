import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';
import { setAccessToken, getAccessToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  handleGoogleCallback: (code: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const TOKEN_STORAGE_KEY = 'st_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const response = await authService.me();
      setUser(response.data.data);
    } catch {
      setAccessToken(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      setAccessToken(storedToken);
      fetchUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  const login = useCallback(async () => {
    try {
      const response = await authService.getGoogleRedirectUrl();
      const url = response.data.data.url;
      window.location.href = url;
    } catch (error) {
      console.error('Failed to get Google OAuth URL:', error);
    }
  }, []);

  const handleGoogleCallback = useCallback(async (code: string) => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const response = await authService.googleCallback(code, redirectUri);
    const { access_token, user: userData } = response.data.data;
    setAccessToken(access_token);
    localStorage.setItem(TOKEN_STORAGE_KEY, access_token);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) {
        await authService.logout();
      }
    } finally {
      setAccessToken(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        handleGoogleCallback,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
