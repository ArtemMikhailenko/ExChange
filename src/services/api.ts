// src/services/api.ts
const API_BASE_URL = 'https://apiexchange.ymca.one';

// User interface definition
export interface User {
  id: string;
  email: string;
  username?: string;
  name?: string | null;
  nickname?: string | null;
  confirmed?: string;
  verified?: string;
  telegram?: string | null;
  ref?: string | null;
  ref_balance?: string;
  robot_key?: string | null;
  demo_balance?: string | null;
  bonus_balance?: string | null;
  frozen_balance?: string | null;
  is_blocked?: string | null;
  blocked?: string;
  created?: string;
  sponsor?: string | null;
  oauth?: string | null;
  tokens?: string | null;
  wallets?: string | null;
  phone?: string | null;
}

export interface RegisterPayload {
  email: string;
  password: string;
  password_re_entrered?: string; 
  telegram?: string; 
  referralCode?: string;
  'g-recaptcha-response'?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  'g-recaptcha-response'?: string;
}

export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
  error?: string;
  success?: boolean;
  msg?: string; // Added for API compatibility
  user_data?: User; // Added for session response
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  endpoints: {
    register: '/user/signup',
    login: '/user/login',
    googleAuth: '/user/signin/google',
    verify: '/user/verify',
    resetPassword: '/user/resetPassword',
    session: '/session' // Session endpoint
  }
};

class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

async function handleResponse<T = any>(response: Response): Promise<ApiResponse<T>> {
  const clonedResponse = response.clone();
  
  let data;
  try {
    data = await response.json();
  } catch (e) {
    try {
      data = await clonedResponse.json();
    } catch (innerError) {
      // If both JSON attempts fail, try to get text
      try {
        const text = await clonedResponse.text();
        throw new ApiError(text || 'Unexpected server response', response.status);
      } catch (textError) {
        // If all attempts fail, return a generic error
        throw new ApiError('Failed to process server response', response.status);
      }
    }
  }
  
  // Check if response is successful
  if (!response.ok) {
    throw new ApiError(
      data?.message || data?.error || data?.msg || 'An error occurred', 
      response.status
    );
  }
  
  return {
    status: 'success',
    success: true,
    data: data?.data || data,
    message: data?.message || data?.msg,
    user_data: data?.user_data
  };
}

// API service functions
export const authService = {
  // Register a new user
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    try {
      console.log('Sending registration request to', `${apiConfig.baseURL}${apiConfig.endpoints.register}`);
      
      // Transform payload to match API requirements
      const requestPayload = {
        email: payload.email,
        password: payload.password,
        password_re_entrered: payload.password_re_entrered || payload.password, // Use the same password if not provided
        telegram: payload.telegram || "",
        'g-recaptcha-response': payload['g-recaptcha-response'] || "",
        ref: payload.referralCode || "" // Use referralCode as ref parameter
      };
      
      const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.register}`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(requestPayload),
        credentials: 'include' // For saving cookies
      });
      
      const result = await handleResponse<AuthResponse>(response);
      
      // Standardize the response to include token and user
      if (result.status === 'success') {
        // Extract token from response data
        const token = result.data?.token || '';
        
        // Create user object from user_data if available
        const user = result.user_data || {
          id: result.data?.id || '',
          email: payload.email
        };
        
        // Structure the final response
        result.data = {
          token: token,
          user: user
        };
      }
      
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error instanceof ApiError) {
        return {
          status: 'error',
          success: false,
          error: error.message
        };
      }
      
      // Improved network error handling
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return {
          status: 'error',
          success: false,
          error: 'Network error: Could not connect to the server. Please check your internet connection and try again.'
        };
      }
      
      return {
        status: 'error',
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  },
  
  // User login
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponse>> {
    try {
      console.log('Sending login request to', `${apiConfig.baseURL}${apiConfig.endpoints.login}`);
      
      const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.login}`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(payload),
        credentials: 'include' // Important for saving cookies
      });
      
      const result = await handleResponse<AuthResponse>(response);
      
      // Log the full result for debugging
      console.log('Login API response:', JSON.stringify(result));
      
      // Standardize the response to include token and user
      if (result.status === 'success') {
        // Extract token from response data
        const token = result.data?.token || '';
        
        // Create user object from user_data if available
        const user = result.user_data || {
          id: result.data?.id || '',
          email: payload.email
        };
        
        // Structure the final response
        result.data = {
          token: token,
          user: user
        };
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof ApiError) {
        return {
          status: 'error',
          success: false,
          error: error.message
        };
      }
      
      // Improved network error handling
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return {
          status: 'error',
          success: false,
          error: 'Network error: Could not connect to the server. Please check your internet connection and try again.'
        };
      }
      
      return {
        status: 'error',
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  },
  
  // Get current user session
  async getSession(): Promise<ApiResponse<User>> {
    try {
      const token = this.getAuthToken();
      
      if (!token) {
        console.log('No auth token found, user is not authenticated');
        return {
          status: 'error',
          success: false,
          error: 'No authentication token found'
        };
      }
      
      console.log('Fetching session data from API...');
      
      const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.session}`, {
        method: 'GET',
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      // Handle the response
      const result = await handleResponse<{user_data: User}>(response);
      
      // Extract user data from response
      if (result.status === 'success' && result.user_data) {
        return {
          status: 'success',
          success: true,
          data: result.user_data
        };
      }
      
      return {
        status: 'error',
        success: false,
        error: 'Failed to get user session data'
      };
    } catch (error) {
      console.error('Session error:', error);
      
      if (error instanceof ApiError) {
        return {
          status: 'error',
          success: false,
          error: error.message
        };
      }
      
      return {
        status: 'error',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get session'
      };
    }
  },
  
  // Google authentication
  async googleLogin(): Promise<ApiResponse<{url: string}>> {
    try {
      console.log('Requesting URL for Google login');
      
      const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.googleAuth}`, {
        method: 'GET',
        headers: apiConfig.headers,
        credentials: 'include'
      });
      
      return handleResponse<{url: string}>(response);
    } catch (error) {
      console.error('Google authentication error:', error);
      
      return {
        status: 'error',
        success: false,
        error: error instanceof Error ? error.message : 'Could not start Google authentication'
      };
    }
  },
  
  // Token verification
  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.verify}`, {
        method: 'POST',
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      return response.ok;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },
  
  // Request password reset
  async requestPasswordReset(email: string): Promise<ApiResponse<{message: string}>> {
    try {
      console.log('Sending password reset request for', email);
      
      const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.resetPassword}`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify({ email }),
        credentials: 'include'
      });
      
      return handleResponse<{message: string}>(response);
    } catch (error) {
      console.error('Password reset request error:', error);
      
      if (error instanceof ApiError) {
        return {
          status: 'error',
          success: false,
          error: error.message
        };
      }
      
      return {
        status: 'error',
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send password reset request'
      };
    }
  },
  
  // Save authentication token to localStorage
  saveAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      console.log('Saving auth token to localStorage');
      localStorage.setItem('auth_token', token);
    }
  },
  
  // Get saved token
  getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },
  
  // Remove token (logout)
  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      console.log('Removing auth token from localStorage');
      localStorage.removeItem('auth_token');
    }
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
};