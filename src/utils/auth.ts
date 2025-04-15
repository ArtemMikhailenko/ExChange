// src/utils/auth.ts

// Key for storing the auth token in local storage/cookies
const AUTH_TOKEN_KEY = 'exchange_auth_token';

/**
 * Get the authentication token from storage
 * @returns The stored token or null if not found
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null; // Handle server-side rendering
  }
  
  // First try to get from localStorage
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  
  // If no token in localStorage, try to get from cookie
  if (!token) {
    return getCookieValue(AUTH_TOKEN_KEY);
  }
  
  return token;
}

/**
 * Save the authentication token to storage
 * @param token The token to store
 */
export function saveAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return; // Handle server-side rendering
  }
  
  // Store in both localStorage and cookie for redundancy
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  setCookie(AUTH_TOKEN_KEY, token, 7); // Store cookie for 7 days
}

/**
 * Remove the authentication token from storage
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') {
    return; // Handle server-side rendering
  }
  
  localStorage.removeItem(AUTH_TOKEN_KEY);
  deleteCookie(AUTH_TOKEN_KEY);
}

/**
 * Check if the user is authenticated
 * @returns Boolean indicating if the user has a token
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Helper function to get a cookie value by name
function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    
    // Check if this cookie is the one we're looking for
    if (cookie.substring(0, name.length + 1) === (name + '=')) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }
  
  return null;
}

// Helper function to set a cookie
function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  
  const cookieValue = encodeURIComponent(value) + 
    '; expires=' + expirationDate.toUTCString() + 
    '; path=/' +
    '; SameSite=Lax';
  
  document.cookie = name + '=' + cookieValue;
}

// Helper function to delete a cookie
function deleteCookie(name: string): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  document.cookie = name + '=; Max-Age=-99999999; path=/';
}