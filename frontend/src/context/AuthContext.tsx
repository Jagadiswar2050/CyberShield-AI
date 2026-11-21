import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabaseLogin, supabaseRegister } from '../services/supabase';

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
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cybershield_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [token, setToken] = useState<string | null>(localStorage.getItem('cybershield_token'));
  const creatorWebsite = 'https://www.audit3a.com/';

  useEffect(() => {
    // If user is already loaded from localStorage, ensure state is set
    const savedUser = localStorage.getItem('cybershield_user');
    if (savedUser && !user) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {}
    }
  }, [user]);

  const login = async (email: string, pass: string) => {
    try {
      // 1. Authenticate against Supabase Cloud Database
      const loggedUser = await supabaseLogin(email, pass);
      const authToken = `sb_token_${loggedUser.id}`;
      
      localStorage.setItem('cybershield_token', authToken);
      localStorage.setItem('cybershield_user', JSON.stringify(loggedUser));
      setToken(authToken);
      setUser(loggedUser);
    } catch (err: any) {
      // If error is specific (like incorrect password or user not found), bubble it up
      if (err.message && !err.message.includes('Unexpected token')) {
        throw err;
      }

      // Safe fallback attempt for local Python FastAPI backend (if running locally)
      try {
        const res = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass })
        });
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          localStorage.setItem('cybershield_token', data.access_token);
          const localUser: User = {
            id: data.user_id,
            email: data.email,
            full_name: data.full_name,
            role: data.role,
            is_active: true
          };
          localStorage.setItem('cybershield_user', JSON.stringify(localUser));
          setToken(data.access_token);
          setUser(localUser);
          return;
        }
      } catch {}

      throw new Error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async (email: string, fullName: string, pass: string) => {
    try {
      // 1. Create and store user directly in Supabase Cloud Database
      const newUser = await supabaseRegister(email, fullName, pass);
      const authToken = `sb_token_${newUser.id}`;
      
      localStorage.setItem('cybershield_token', authToken);
      localStorage.setItem('cybershield_user', JSON.stringify(newUser));
      setToken(authToken);
      setUser(newUser);
    } catch (err: any) {
      if (err.message && !err.message.includes('Unexpected token')) {
        throw err;
      }

      // Safe fallback attempt for local Python FastAPI backend (if running locally)
      try {
        const res = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, full_name: fullName, password: pass })
        });
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && contentType.includes('application/json')) {
          const data = await res.json();
          localStorage.setItem('cybershield_token', data.access_token);
          const localUser: User = {
            id: data.user_id,
            email: data.email,
            full_name: data.full_name,
            role: data.role,
            is_active: true
          };
          localStorage.setItem('cybershield_user', JSON.stringify(localUser));
          setToken(data.access_token);
          setUser(localUser);
          return;
        }
      } catch {}

      throw new Error(err.message || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('cybershield_token');
    localStorage.removeItem('cybershield_user');
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
