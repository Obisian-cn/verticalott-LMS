import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiMethods } from '../lib/api';

type UserRole = 'student' | 'instructor' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await apiMethods.me();
          if (res.success && res.data.user) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (data: any) => {
    try {
      const res = await apiMethods.login(data);
      if (res.success) {
        localStorage.setItem('token', res.data.tokens.accessToken);
        if (res.data.tokens.refreshToken) {
          localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
        }
        setUser(res.data.user);
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const register = async (data: any) => {
    try {
      const res = await apiMethods.register(data);
      if (res.success) {
        localStorage.setItem('token', res.data.tokens.accessToken);
        if (res.data.tokens.refreshToken) {
          localStorage.setItem('refreshToken', res.data.tokens.refreshToken);
        }
        setUser(res.data.user);
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
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
