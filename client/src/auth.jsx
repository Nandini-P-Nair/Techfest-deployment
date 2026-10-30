import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api('/api/auth/me').then((d) => setUser(d.user)).catch(() => setUser(null)).finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const d = await api('/api/auth/login', { method: 'POST', body: { email, password } });
    setUser(d.user);
  };
  const register = (name, email, password) =>
    api('/api/auth/register', { method: 'POST', body: { name, email, password } });
  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, ready, login, register, logout }}>{children}</AuthContext.Provider>;
}
