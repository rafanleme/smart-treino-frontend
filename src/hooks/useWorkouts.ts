import { useState, useEffect, useCallback } from 'react';
import { App } from 'antd';
import { workoutService } from '../services/workoutService';
import type { Workout } from '../types';

interface UseWorkoutsReturn {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  deleteWorkout: (id: number) => Promise<void>;
  duplicateWorkout: (id: number) => Promise<Workout>;
}

export function useWorkouts(): UseWorkoutsReturn {
  const { message } = App.useApp();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await workoutService.list();
      setWorkouts(response.data.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao carregar treinos';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const deleteWorkout = async (id: number) => {
    try {
      await workoutService.delete(id);
      message.success('Treino excluído com sucesso');
      await fetchWorkouts();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao excluir treino';
      message.error(errorMsg);
      throw err;
    }
  };

  const duplicateWorkout = async (id: number): Promise<Workout> => {
    try {
      const response = await workoutService.duplicate(id);
      message.success('Treino duplicado com sucesso');
      await fetchWorkouts();
      return response.data.data;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao duplicar treino';
      message.error(errorMsg);
      throw err;
    }
  };

  return {
    workouts,
    loading,
    error,
    refresh: fetchWorkouts,
    deleteWorkout,
    duplicateWorkout,
  };
}
