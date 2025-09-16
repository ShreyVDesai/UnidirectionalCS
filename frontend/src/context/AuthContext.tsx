// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AuthContextType = {
  token: string | null;
  type: 'A' | 'B' | null;
  setAuth: (token: string, type: 'A' | 'B') => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  type: null,
  setAuth: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [type, setType] = useState<'A' | 'B' | null>(
    (localStorage.getItem('type') as 'A' | 'B') || null
  );

  const setAuth = (newToken: string, newType: 'A' | 'B') => {
    setToken(newToken);
    setType(newType);
    localStorage.setItem('token', newToken);
    localStorage.setItem('type', newType);
  };

  const logout = () => {
    setToken(null);
    setType(null);
    localStorage.removeItem('token');
    localStorage.removeItem('type');
  };

  return <AuthContext.Provider value={{ token, type, setAuth, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
