import api from './api';
import type { DashboardStats } from '../types';

export const statsService = {
  async getDashboard(): Promise<DashboardStats> {
    const response = await api.get<{ data: DashboardStats }>('/stats/dashboard');
    return response.data.data;
  },
};
