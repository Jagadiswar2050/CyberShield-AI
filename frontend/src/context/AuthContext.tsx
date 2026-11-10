import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, fullName: string, pass: string) => Promise<void>;
  logout: () => void;
  isSuperAdmin: boolean;
  isReviewer: boolean;
  creatorWebsite: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('cybershield_token'));
  const creatorWebsite = 'https://www.audit3a.com/';

  useEffect(() => {
    if (token) {
      // Validate token with backend /api/v1/auth/me
      fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Invalid token');
      })
      .then(data => {
        setUser({
          id: data.id,
          email: data.email,
          full_name: data.full_name,
          role: data.role,
          is_active: data.is_active
        });
      })
      .catch(() => {
        logout();
      });
    }
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    const data = await res.json();
    localStorage.setItem('cybershield_token', data.access_token);
    setToken(data.access_token);
    setUser({
      id: data.user_id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      is_active: true
    });
  };

  const register = async (email: string, fullName: string, pass: string) => {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, full_name: fullName, password: pass })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    const data = await res.json();
    localStorage.setItem('cybershield_token', data.access_token);
    setToken(data.access_token);
    setUser({
      id: data.user_id,
      email: data.email,
      full_name: data.full_name,
      role: data.role,
      is_active: true
    });
  };

  const logout = () => {
    localStorage.removeItem('cybershield_token');
    setToken(null);
    setUser(null);
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isReviewer = user?.role === 'reviewer' || isSuperAdmin;

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isSuperAdmin,
      isReviewer,
      creatorWebsite
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

