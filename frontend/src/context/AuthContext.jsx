import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved local credentials
    const savedUser = localStorage.getItem('inkloom_user');
    const savedToken = localStorage.getItem('inkloom_token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    } else {
      // Auto-initialize default demo user for seamless test drive
      const defaultUser = {
        id: '672de1a2b3c4d5e6f7a8b9c0',
        name: 'Sarah Chen (Lead Brand Governor)',
        email: 'compliance.officer@inkloom.ai',
        role: 'compliance_officer',
        organization: 'Inkloom Global Technologies',
      };
      const defaultToken = 'demo-token';
      localStorage.setItem('inkloom_user', JSON.stringify(defaultUser));
      localStorage.setItem('inkloom_token', defaultToken);
      localStorage.setItem('inkloom_user_role', defaultUser.role);
      setUser(defaultUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // First try backend API login
      const res = await authAPI.login({ email, password });
      if (res.data?.success) {
        const { token, user: userData } = res.data;
        localStorage.setItem('inkloom_token', token);
        localStorage.setItem('inkloom_user', JSON.stringify(userData));
        localStorage.setItem('inkloom_user_role', userData.role);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (apiErr) {
      // Try Firebase SDK if API fails or for hybrid login
      try {
        if (auth) {
          const userCred = await signInWithEmailAndPassword(auth, email, password);
          const userData = {
            id: userCred.user.uid,
            name: userCred.user.displayName || email.split('@')[0],
            email: userCred.user.email,
            role: 'brand_manager',
            organization: 'Enterprise Workspace',
          };
          const token = await userCred.user.getIdToken();
          localStorage.setItem('inkloom_token', token);
          localStorage.setItem('inkloom_user', JSON.stringify(userData));
          localStorage.setItem('inkloom_user_role', userData.role);
          setUser(userData);
          return { success: true, user: userData };
        }
      } catch (fbErr) {
        throw new Error(apiErr.response?.data?.message || fbErr.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'brand_manager', organization = '') => {
    setLoading(true);
    try {
      const res = await authAPI.register({ name, email, password, role, organization });
      if (res.data?.success) {
        const { token, user: userData } = res.data;
        localStorage.setItem('inkloom_token', token);
        localStorage.setItem('inkloom_user', JSON.stringify(userData));
        localStorage.setItem('inkloom_user_role', userData.role);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role = 'compliance_officer') => {
    setLoading(true);
    try {
      const res = await authAPI.demoLogin(role);
      if (res.data?.success) {
        const { token, user: userData } = res.data;
        localStorage.setItem('inkloom_token', token);
        localStorage.setItem('inkloom_user', JSON.stringify(userData));
        localStorage.setItem('inkloom_user_role', userData.role);
        setUser(userData);
        return { success: true, user: userData };
      }
    } catch (err) {
      // Fallback offline demo login
      const isCompliance = role === 'compliance_officer';
      const fallbackUser = {
        id: isCompliance ? 'demo-compliance-id' : 'demo-manager-id',
        name: isCompliance ? 'Sarah Chen (Lead Brand Governor)' : 'Marcus Vance (Creative Lead)',
        email: isCompliance ? 'compliance.officer@inkloom.ai' : 'marcus.vance@inkloom.ai',
        role: role,
        organization: 'Inkloom Global Technologies',
      };
      localStorage.setItem('inkloom_token', 'demo-token');
      localStorage.setItem('inkloom_user', JSON.stringify(fallbackUser));
      localStorage.setItem('inkloom_user_role', fallbackUser.role);
      setUser(fallbackUser);
      return { success: true, user: fallbackUser };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    if (auth) {
      await sendPasswordResetEmail(auth, email);
    }
    return { success: true, message: 'Password reset link dispatched.' };
  };

  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        // ignore
      }
    }
    localStorage.removeItem('inkloom_token');
    localStorage.removeItem('inkloom_user');
    localStorage.removeItem('inkloom_user_role');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        demoLogin,
        forgotPassword,
        logout,
        isAuthenticated: !!user,
        isComplianceOfficer: user?.role === 'compliance_officer' || user?.role === 'admin',
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
