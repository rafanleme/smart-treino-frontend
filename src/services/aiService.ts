import api from './api';
import type { ApiResponse } from '../types';

export interface GenerateWorkoutRequest {
  goal: 'hypertrophy' | 'strength' | 'endurance';
  muscle_groups?: string[];
  duration_minutes?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes?: string;
}

export interface GeneratedWorkoutExercise {
  exercise_id: number;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
  ai_reasoning?: string;
}

export interface GeneratedWorkout {
  name: string;
  description?: string;
  estimated_duration_min?: number;
  ai_notes?: string;
  exercises: GeneratedWorkoutExercise[];
}

export interface ProgressionSuggestion {
  current_load: number | null;
  suggested_load: number;
  reasoning: string;
}

export const aiService = {
  generateWorkout: (data: GenerateWorkoutRequest) =>
    api.post<ApiResponse<GeneratedWorkout>>('/ai/generate-workout', data),

  suggestProgression: (exerciseId: number) =>
    api.post<ApiResponse<ProgressionSuggestion>>('/ai/suggest-progression', {
      exercise_id: exerciseId,
    }),
};
