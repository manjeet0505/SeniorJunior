'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext({
  user: null,
  role: null,
  isAuthenticated: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const readUser = () => {
      try {
        const raw = localStorage.getItem('user');
        if (!raw) {
          setUser(null);
          return;
        }
        setUser(JSON.parse(raw));
      } catch {
        setUser(null);
      }
    };

    readUser();

    const onStorage = (e) => {
      if (e.key === 'user' || e.key === 'token') readUser();
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = useMemo(() => {
    const role = user?.role ?? null;
    const isAuthenticated = Boolean(isClient && localStorage.getItem('token'));

    return {
      user,
      role,
      isAuthenticated,
    };
  }, [user, isClient]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
