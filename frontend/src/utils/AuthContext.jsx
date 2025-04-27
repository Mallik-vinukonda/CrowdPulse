import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getProfile, setAuthToken } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      getProfile().then(setUser).catch(() => setUser(null));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem('token', data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    await apiRegister(name, email, password);
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
