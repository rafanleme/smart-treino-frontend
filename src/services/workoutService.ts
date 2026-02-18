import api from './api';
import type { ApiResponse, Workout, WorkoutExercise } from '../types';

export const workoutService = {
  list: () =>
    api.get<ApiResponse<Workout[]>>('/workouts'),

  get: (id: number) =>
    api.get<ApiResponse<Workout>>(`/workouts/${id}`),

  create: (data: { name: string; description?: string; estimated_duration_min?: number }) =>
    api.post<ApiResponse<Workout>>('/workouts', data),

  update: (id: number, data: Partial<Workout>) =>
    api.put<ApiResponse<Workout>>(`/workouts/${id}`, data),

  delete: (id: number) =>
    api.delete(`/workouts/${id}`),

  duplicate: (id: number) =>
    api.post<ApiResponse<Workout>>(`/workouts/${id}/duplicate`),

  // Workout Exercises
  addExercise: (workoutId: number, data: { exercise_id: number; sets?: number; reps?: string; rest_seconds?: number; notes?: string }) =>
    api.post<ApiResponse<WorkoutExercise>>(`/workouts/${workoutId}/exercises`, data),

  updateExercise: (workoutId: number, workoutExerciseId: number, data: { sets?: number; reps?: string; rest_seconds?: number; notes?: string }) =>
    api.put<ApiResponse<WorkoutExercise>>(`/workouts/${workoutId}/exercises/${workoutExerciseId}`, data),

  removeExercise: (workoutId: number, workoutExerciseId: number) =>
    api.delete(`/workouts/${workoutId}/exercises/${workoutExerciseId}`),

  reorderExercises: (workoutId: number, exercises: Array<{ workout_exercise_id: number; order: number }>) =>
    api.put(`/workouts/${workoutId}/reorder`, { exercises }),
};
