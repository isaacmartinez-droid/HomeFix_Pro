import { useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import { AuthContext } from './auth';
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('hfp_token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const logout = useCallback(() => {
    localStorage.removeItem('hfp_token'); localStorage.removeItem('hfp_user');
    setUser(null); setToken(null); setError('');
  }, []);
  const refreshUser = useCallback(async () => {
    const data = await authApi.me();
    setUser(data);
    return data;
  }, []);
  useEffect(() => {
    let active = true;
    setError('');
    if (!token) { setLoading(false); return () => { active = false; }; }
    setLoading(true);
    authApi.me().then(data => { if (active) setUser(data); }).catch(err => {
      if (!active) return;
      if (err.status === 401 || err.status === 403) logout();
      else setError('No se pudo conectar con HomeFix. ' + err.message);
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, logout, attempt]);
  useEffect(() => {
    window.addEventListener('hfp:unauthorized', logout);
    return () => window.removeEventListener('hfp:unauthorized', logout);
  }, [logout]);
  const login = (data, authToken) => {
    localStorage.setItem('hfp_token', authToken);
    localStorage.removeItem('hfp_user');
    setUser(data); setToken(authToken); setError('');
  };
  if (error) return <main className="p-8 text-center"><p role="alert">{error}</p><button className="m-4 underline" onClick={() => setAttempt(value => value + 1)}>Reintentar</button><button className="m-4 underline" onClick={logout}>Cerrar sesión</button></main>;
  return <AuthContext.Provider value={{ user, token, login, logout, loading, refreshUser }}>{children}</AuthContext.Provider>;
};
