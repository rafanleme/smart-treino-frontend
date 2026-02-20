import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Track online status
let isOnline = navigator.onLine;
window.addEventListener('online', () => {
  isOnline = true;
  message.success('Conexão restabelecida!');
});
window.addEventListener('offline', () => {
  isOnline = false;
  message.error('Você está offline. Verifique sua conexão.');
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

    // Handle 401 Unauthorized - try to refresh token first
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;

      try {
        // Dynamic import to avoid circular dependency
        const { refreshAccessToken } = await import('./tokenRefresh');
        const newToken = await refreshAccessToken();

        if (newToken) {
          // Update authorization header and retry original request
          config.headers.Authorization = `Bearer ${newToken}`;
          return api(config);
        }
      } catch (refreshError) {
        // Refresh failed, will redirect to login below
      }

      // Refresh failed or returned null - redirect to login
      setAccessToken(null);
      localStorage.removeItem('st_token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Check if offline
    if (!isOnline) {
      message.error('Você está offline');
      return Promise.reject(error);
    }

    // Retry logic for network errors or 5xx errors
    const shouldRetry =
      !error.response || // Network error
      (error.response.status >= 500 && error.response.status < 600); // Server error

    if (shouldRetry && config && !config._retry) {
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < 2) {
        config._retryCount += 1;
        config._retry = true;

        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, config._retryCount), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));

        return api(config);
      }
    }

    // Show user-friendly error messages
    if (error.response) {
      const status = error.response.status;
      const errorMessage = (error.response.data as any)?.message;

      if (status >= 500) {
        message.error('Erro no servidor. Tente novamente em alguns instantes.');
      } else if (status === 404) {
        message.error(errorMessage || 'Recurso não encontrado');
      } else if (status === 403) {
        message.error('Você não tem permissão para esta ação');
      } else if (status !== 422) {
        // 422 is validation error, handled by forms
        message.error(errorMessage || 'Erro ao processar requisição');
      }
    } else if (error.request) {
      message.error('Não foi possível conectar ao servidor');
    }

    return Promise.reject(error);
  }
);

export default api;
