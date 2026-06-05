import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import api from '../api/client';

type AuthUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string, mfaCode?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });

  const value = useMemo(
    () => ({
      user,
      async login(email: string, password: string, mfaCode?: string) {
        const { data } = await api.post('/auth/login', { email, password, mfaCode });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      },
      logout() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) api.post('/auth/logout', { refreshToken }).catch(() => undefined);
        localStorage.clear();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
