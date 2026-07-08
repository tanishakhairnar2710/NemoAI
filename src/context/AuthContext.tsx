import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { TOKEN_STORAGE_KEY } from '../constants/storage';
import { authService } from '../services/authService';
import type { User } from '../services/types';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { full_name: string; email: string; password: string; study_goal?: string }) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    authService.me().then(setUser).finally(() => setLoading(false));
  }, [token]);

  const persistSession = useCallback((nextToken: string, nextUser: User) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    persistSession(response.access_token, response.user);
  }, [persistSession]);

  const signup = useCallback(async (payload: { full_name: string; email: string; password: string; study_goal?: string }) => {
    const response = await authService.signup(payload);
    persistSession(response.access_token, response.user);
  }, [persistSession]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, token, loading, login, signup, logout }), [user, token, loading, login, signup, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
