import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, setToken, removeToken } from '@/lib/api';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const userData = await authApi.me();
      setUser(userData);
      setUserRole(userData.role || 'cliente');
    } catch (error) {
      console.error('Error checking auth:', error);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, nome, telefone) => {
    try {
      const response = await authApi.register({ email, password, nome, telefone });
      if (response.token) {
        setToken(response.token);
        const userData = await authApi.me();
        setUser(userData);
        setUserRole(userData.role || 'cliente');
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      if (response.user) {
        setUser(response.user);
        setUserRole(response.user.role || 'cliente');
      } else {
        const userData = await authApi.me();
        setUser(userData);
        setUserRole(userData.role || 'cliente');
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    authApi.logout();
    setUser(null);
    setUserRole(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, session: null, loading, signUp, signIn, signOut, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
