import api from './api';
import type { ApiResponse, PaginatedResponse, TrainingSession, SessionExercise, SessionSet, PreviousLoad } from '../types';

export const sessionService = {
  list: (filters?: { status?: string; date_from?: string; date_to?: string; per_page?: number; page?: number }) =>
    api.get<PaginatedResponse<TrainingSession>>('/sessions', { params: filters }),

  get: (id: number) =>
    api.get<ApiResponse<TrainingSession>>(`/sessions/${id}`),

  getActive: () =>
    api.get<ApiResponse<TrainingSession>>('/sessions/active'),

  start: (workoutId: number) =>
    api.post<ApiResponse<TrainingSession>>('/sessions', { workout_id: workoutId }),

  update: (id: number, data: { status?: 'completed' | 'abandoned'; notes?: string }) =>
    api.put<ApiResponse<TrainingSession>>(`/sessions/${id}`, data),

  delete: (id: number) =>
    api.delete(`/sessions/${id}`),

  getPreviousLoad: (sessionId: number, exerciseId: number) =>
    api.post<ApiResponse<PreviousLoad | null>>(`/sessions/${sessionId}/previous-load/${exerciseId}`),

  // Session Exercise
  updateExercise: (exerciseId: number, data: { status?: 'pending' | 'in_progress' | 'completed' | 'skipped' }) =>
    api.put<ApiResponse<SessionExercise>>(`/session-exercises/${exerciseId}`, data),

  // Session Sets
  logSet: (exerciseId: number, data: { reps_completed: number; load_kg?: number; rpe?: number; rest_seconds?: number }) =>
    api.post<ApiResponse<SessionSet>>(`/session-exercises/${exerciseId}/sets`, data),

  updateSet: (setId: number, data: { reps_completed?: number; load_kg?: number; rpe?: number; rest_seconds?: number }) =>
    api.put<ApiResponse<SessionSet>>(`/session-sets/${setId}`, data),
};
