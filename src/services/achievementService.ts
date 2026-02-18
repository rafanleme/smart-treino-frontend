import api from './api';
import type { Achievement, PersonalRecord, UserStreak } from '../types';

export const achievementService = {
  async getAll(): Promise<Achievement[]> {
    const response = await api.get<{ data: Achievement[] }>('/achievements');
    return response.data.data;
  },

  async getRecent(): Promise<Achievement[]> {
    const response = await api.get<{ data: Achievement[] }>('/achievements/recent');
    return response.data.data;
  },
};

export const personalRecordService = {
  async getAll(exerciseId?: number): Promise<PersonalRecord[]> {
    const params = exerciseId ? { exercise_id: exerciseId } : {};
    const response = await api.get<{ data: PersonalRecord[] }>('/personal-records', { params });
    return response.data.data;
  },

  async getExerciseHistory(exerciseId: number): Promise<PersonalRecord[]> {
    const response = await api.get<{ data: PersonalRecord[] }>(`/personal-records/exercise/${exerciseId}`);
    return response.data.data;
  },
};

export const streakService = {
  async getStreak(): Promise<UserStreak> {
    const response = await api.get<{ data: UserStreak }>('/streaks');
    return response.data.data;
  },
};
