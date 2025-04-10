
const API_BASE_URL = 'https://apiexchange.ymca.one';

export interface RegisterPayload {
  email: string;
  password: string;
  referralCode?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  'g-recaptcha-response'?: string;
}

export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  error?: string;
  success?: boolean; 
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username?: string;
  };
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
    resetPassword: '/user/ressetPassword'
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

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {

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
    success: true, // Added for compatibility with useAuth
    data: data?.data || data,
    message: data?.message || data?.msg
  };
}

// API service functions
export const authService = {
  // Register a new user
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponse>> {
    try {
      console.log('Sending registration request to', `${apiConfig.baseURL}${apiConfig.endpoints.register}`);
      
      const response = await fetch(`${apiConfig.baseURL}${apiConfig.endpoints.register}`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify(payload),
        credentials: 'include' // For saving cookies
      });
      
      return handleResponse<AuthResponse>(response);
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
      
      return handleResponse<AuthResponse>(response);
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
      localStorage.removeItem('auth_token');
    }
  },
  
  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
};