import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userInfo');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message || 'Login failed' };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message || 'Registration failed' };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.updateProfile(userData);
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return { success: true, user: response.data };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Profile update failed' };
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAdmin,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
