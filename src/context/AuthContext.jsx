// ================================================================
// File: smrita/src/context/AuthContext.jsx
// UPDATED: Now uses real backend API instead of mock/localStorage
// ================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('smrita_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true); // for initial token verification

  // On app load — verify token is still valid
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('smrita_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authAPI.getMe();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('smrita_user', JSON.stringify(data.user));
        }
      } catch {
        // Token invalid/expired — clear everything
        localStorage.removeItem('smrita_token');
        localStorage.removeItem('smrita_user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []);

  // ── LOGIN ─────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    if (data.success) {
      localStorage.setItem('smrita_token', data.token);
      localStorage.setItem('smrita_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    }
    throw new Error(data.message);
  };

  // ── SIGNUP ────────────────────────────────────────
  const signup = async (name, email, password) => {
    const { data } = await authAPI.register({ name, email, password });
    if (data.success) {
      localStorage.setItem('smrita_token', data.token);
      localStorage.setItem('smrita_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    }
    throw new Error(data.message);
  };

  // ── LOGOUT ────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('smrita_token');
    localStorage.removeItem('smrita_user');
    setUser(null);
  };

  // ── UPDATE PROFILE ────────────────────────────────
  const updateProfile = async (profileData) => {
    const { data } = await authAPI.updateProfile(profileData);
    if (data.success) {
      setUser(data.user);
      localStorage.setItem('smrita_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error(data.message);
  };

  // ── CHANGE PASSWORD ───────────────────────────────
  const changePassword = async (currentPassword, newPassword) => {
    const { data } = await authAPI.changePassword({ currentPassword, newPassword });
    if (!data.success) throw new Error(data.message);
    return data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      updateProfile,
      changePassword,
      isLoggedIn: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
