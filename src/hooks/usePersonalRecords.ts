import { useState, useEffect } from 'react';
import type { PersonalRecord } from '../types';
import { personalRecordService } from '../services/achievementService';

export const usePersonalRecords = (exerciseId?: number) => {
  const [records, setRecords] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await personalRecordService.getAll(exerciseId);
      setRecords(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar records pessoais');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [exerciseId]);

  return {
    records,
    loading,
    error,
    refetch: fetchRecords,
  };
};

export const useExerciseHistory = (exerciseId: number) => {
  const [history, setHistory] = useState<PersonalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await personalRecordService.getExerciseHistory(exerciseId);
      setHistory(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar histórico');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (exerciseId) {
      fetchHistory();
    }
  }, [exerciseId]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
  };
};
