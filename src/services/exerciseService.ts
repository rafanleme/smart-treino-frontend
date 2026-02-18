import api from './api';
import type { ApiResponse, PaginatedResponse, Exercise, ExerciseFilters } from '../types';

export const exerciseService = {
  list: (filters?: ExerciseFilters) =>
    api.get<PaginatedResponse<Exercise>>('/exercises', { params: filters }),

  get: (id: number) =>
    api.get<ApiResponse<Exercise>>(`/exercises/${id}`),

  create: (data: Partial<Exercise>) =>
    api.post<ApiResponse<Exercise>>('/exercises', data),

  update: (id: number, data: Partial<Exercise>) =>
    api.put<ApiResponse<Exercise>>(`/exercises/${id}`, data),

  delete: (id: number) =>
    api.delete(`/exercises/${id}`),
};
