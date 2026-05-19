import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { UserProfile } from '../types';

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) as UserProfile : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      token,
      login: (nextToken: string, nextUser: UserProfile) => {
        setToken(nextToken);
        setUser(nextUser);
      },
      logout: () => {
        setToken(null);
        setUser(null);
      }
    }),
    [user, token]
  );

  return React.createElement(AuthContext.Provider, { value }, children);
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
