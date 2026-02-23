import { useState, useEffect, useCallback } from 'react';
import { App } from 'antd';
import { exerciseService } from '../services/exerciseService';
import type { Exercise, ExerciseFilters } from '../types';

interface UseExercisesReturn {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  filters: ExerciseFilters;
  setFilters: (filters: ExerciseFilters) => void;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
  deleteExercise: (id: number) => Promise<void>;
}

export function useExercises(initialFilters: ExerciseFilters = {}): UseExercisesReturn {
  const { message } = App.useApp();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExerciseFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await exerciseService.list({ ...filters, page: currentPage });
      setExercises(response.data.data);
      setLastPage(response.data.meta.last_page);
      setPerPage(response.data.meta.per_page);
      setTotal(response.data.meta.total);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao carregar exercícios';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleSetFilters = (newFilters: ExerciseFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const deleteExercise = async (id: number) => {
    try {
      await exerciseService.delete(id);
      message.success('Exercício excluído com sucesso');
      await fetchExercises();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao excluir exercício';
      message.error(errorMsg);
      throw err;
    }
  };

  return {
    exercises,
    loading,
    error,
    currentPage,
    lastPage,
    perPage,
    total,
    filters,
    setFilters: handleSetFilters,
    setPage,
    refresh: fetchExercises,
    deleteExercise,
  };
}
