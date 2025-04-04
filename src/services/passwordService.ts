// src/services/passwordService.ts

// Import shared API configuration and types
import { apiConfig, ApiResponse } from './api';

interface PasswordResetRequestPayload {
  email: string;
}

interface PasswordResetResponse {
  message: string;
}

export const passwordService = {
  /**
   * Request a password reset link
   * This function will send a request to the server to send a password reset link to the user's email
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<PasswordResetResponse>> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/user/passwordReset`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify({ email }),
      });

      // Parse the response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid server response');
      }

      // Check if the response is successful
      if (!response.ok) {
        return {
          status: 'error',
          error: data.message || data.error || 'Failed to send password reset link'
        };
      }

      return {
        status: 'success',
        data: data
      };
    } catch (error) {
      console.error('Password reset request error:', error);

      // Check for network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return {
          status: 'error',
          error: 'Network error. Please check your connection and try again.'
        };
      }

      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  },

  /**
   * Reset password with token
   * This would be used on the password reset page that the user visits from the email link
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{success: boolean}>> {
    try {
      const response = await fetch(`${apiConfig.baseURL}/user/passwordReset/confirm`, {
        method: 'POST',
        headers: apiConfig.headers,
        body: JSON.stringify({ token, password: newPassword }),
      });

      // Parse the response
      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error('Invalid server response');
      }

      // Check if the response is successful
      if (!response.ok) {
        return {
          status: 'error',
          error: data.message || data.error || 'Failed to reset password'
        };
      }

      return {
        status: 'success',
        data: { success: true }
      };
    } catch (error) {
      console.error('Password reset error:', error);

      // Check for network errors
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        return {
          status: 'error',
          error: 'Network error. Please check your connection and try again.'
        };
      }

      return {
        status: 'error',
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }
};