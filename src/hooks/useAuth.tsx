'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { authService, LoginPayload, RegisterPayload } from '@/services/api';

interface User {
  id: string;
  email: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginPayload) => Promise<boolean>;
  register: (data: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  clearError: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check if user is already logged in (on page load)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Skip this check on the server
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }
        
        const token = authService.getAuthToken();
        
        if (token) {
          setUser({
            id: 'user-1',
            email: 'user@example.com',
          });
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to authenticate user');
        authService.removeAuthToken();
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  // Clear error state
  const clearError = () => setError(null);

  // Register a new user
  const register = async (data: RegisterPayload): Promise<boolean> => {
    setLoading(true);
    clearError();
    
    try {
      const result = await authService.register(data);
      
      if (result.status === 'success' && result.data) {
        authService.saveAuthToken(result.data.token);
        setUser(result.data.user);
        
        return true;
      } else {
        setError(result.error || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginPayload): Promise<boolean> => {
    setLoading(true);
    clearError();
    
    try {
      const result = await authService.login(data);
      
      if (result.status === 'success' && result.data) {
        authService.saveAuthToken(result.data.token);
        
        setUser(result.data.user);
        
        return true;
      } else {
        setError(result.error || 'Login failed');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout the user
  const logout = () => {
    authService.removeAuthToken();
    setUser(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};