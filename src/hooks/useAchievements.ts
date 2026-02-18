import { useState, useEffect } from 'react';
import type { Achievement } from '../types';
import { achievementService } from '../services/achievementService';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await achievementService.getAll();
      setAchievements(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar conquistas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return {
    achievements,
    loading,
    error,
    refetch: fetchAchievements,
  };
};

export const useRecentAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentAchievements = async () => {
    try {
      setLoading(true);
      const data = await achievementService.getRecent();
      setAchievements(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar conquistas recentes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentAchievements();
  }, []);

  return {
    achievements,
    loading,
    error,
    refetch: fetchRecentAchievements,
  };
};
