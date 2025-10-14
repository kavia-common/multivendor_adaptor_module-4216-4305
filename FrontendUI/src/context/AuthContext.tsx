import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthResponse } from '../api/types';
import { login as apiLogin, logout as apiLogout, setAuthToken } from '../api/client';

type AuthState = {
  token: string | null;
  roles: string[];
};

type AuthContextType = {
  isAuthenticated: boolean;
  token: string | null;
  roles: string[];
  // PUBLIC_INTERFACE
  login: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  // PUBLIC_INTERFACE
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'mva_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as AuthState;
        setAuthToken(parsed.token);
        return parsed;
      }
    } catch {
      // ignore
    }
    return { token: null, roles: [] };
  });

  useEffect(() => {
    // Keep axios token in sync
    setAuthToken(state.token);
  }, [state.token]);

  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated: !!state.token,
    token: state.token,
    roles: state.roles,
    login: async (username: string, password: string) => {
      try {
        const res: AuthResponse = await apiLogin({ username, password });
        const next: AuthState = { token: res.token, roles: res.roles || [] };
        setState(next);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setAuthToken(res.token);
        return { ok: true };
      } catch (e: any) {
        const msg = e?.error || 'Login failed';
        return { ok: false, message: msg };
      }
    },
    logout: async () => {
      try {
        await apiLogout();
      } catch {
        // even if server fails, clear local
      } finally {
        setState({ token: null, roles: [] });
        localStorage.removeItem(STORAGE_KEY);
        setAuthToken(null);
      }
    }
  }), [state.token, state.roles]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// PUBLIC_INTERFACE
export function useAuth(): AuthContextType {
  /** Access authentication state and actions */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
