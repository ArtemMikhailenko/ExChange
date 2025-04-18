'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User, LoginPayload, RegisterPayload } from '@/services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (data: LoginPayload) => Promise<boolean>;
  register: (data: RegisterPayload) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  refreshSession: () => Promise<void>;
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
  refreshSession: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Function to fetch session from API
  const fetchSession = async (): Promise<User | null> => {
    try {
      // Skip on server
      if (typeof window === 'undefined') return null;
      
      const token = authService.getAuthToken();
      if (!token) return null;
      
      console.log('Fetching session with token:', token.substring(0, 10) + '...');
      
      // Use the authService getSession method instead of direct fetch
      const result = await authService.getSession();
      
      if (result.status === 'success' && result.data) {
        console.log('Session fetched successfully:', result.data);
        return result.data as User;
      } else {
        console.error('Failed to fetch session:', result.error);
        // If session fetch fails due to invalid token, remove it
        authService.removeAuthToken();
        return null;
      }
    } catch (err) {
      console.error('Error fetching session:', err);
      return null;
    }
  };

  // Function to refresh the session (can be called after login or from components)
  const refreshSession = async (): Promise<void> => {
    setLoading(true);
    try {
      const userData = await fetchSession();
      setUser(userData);
    } catch (err) {
      console.error('Session refresh error:', err);
      setError('Failed to refresh session');
    } finally {
      setLoading(false);
    }
  };

  // Check if user is already logged in (on page load)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Skip this check on the server
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }
        
        // Check if there's a token and fetch session
        const userData = await fetchSession();
        setUser(userData);
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
        
        // Fetch user session with the new token
        await refreshSession();
        
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
        console.log('Login successful, saving token');
        authService.saveAuthToken(result.data.token);
        
        // Fetch user data immediately after login
        await refreshSession();
        
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
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};