import api from './api';
import type { ApiResponse, AuthResponse, User } from '../types';

export const authService = {
  googleCallback: (code: string, redirectUri: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/google', { code, redirect_uri: redirectUri }),

  getGoogleRedirectUrl: () =>
    api.get<ApiResponse<{ url: string }>>('/auth/google/redirect'),

  me: () =>
    api.get<ApiResponse<User>>('/auth/me'),

  refresh: () =>
    api.post<ApiResponse<{ access_token: string; token_type: string; expires_in: number }>>('/auth/refresh'),

  logout: () =>
    api.post('/auth/logout'),

  updateProfile: (data: { name: string }) =>
    api.put<ApiResponse<User>>('/auth/me', data),
};
