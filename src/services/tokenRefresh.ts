import api, { setAccessToken, getAccessToken } from './api';

const TOKEN_STORAGE_KEY = 'st_token';

let refreshPromise: Promise<string | null> | null = null;

/**
 * Refresh access token using the /auth/refresh endpoint
 * Prevents multiple simultaneous refresh requests by using a singleton promise
 */
export async function refreshAccessToken(): Promise<string | null> {
  // Return existing refresh promise if one is already in progress
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const currentToken = getAccessToken();
      if (!currentToken) {
        return null;
      }

      // Call refresh endpoint
      const response = await api.post('/auth/refresh');
      const newToken = response.data.data.access_token;

      // Update token in memory and localStorage
      setAccessToken(newToken);
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);

      return newToken;
    } catch (error) {
      // Refresh failed - token is too old or invalid
      return null;
    } finally {
      // Clear promise so next refresh can proceed
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
