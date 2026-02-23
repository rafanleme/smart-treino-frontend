import { useState, useEffect, useCallback } from 'react';
import { App } from 'antd';
import { assessmentService } from '../services/assessmentService';
import type { PhysicalAssessment } from '../types';

interface UseAssessmentsReturn {
  assessments: PhysicalAssessment[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  deleteAssessment: (id: number) => Promise<void>;
}

export function useAssessments(): UseAssessmentsReturn {
  const { message } = App.useApp();
  const [assessments, setAssessments] = useState<PhysicalAssessment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssessments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.list();
      setAssessments(response.data.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao carregar avaliações';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const deleteAssessment = async (id: number) => {
    try {
      await assessmentService.delete(id);
      message.success('Avaliação excluída com sucesso');
      await fetchAssessments();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Erro ao excluir avaliação';
      message.error(errorMsg);
      throw err;
    }
  };

  return {
    assessments,
    loading,
    error,
    refresh: fetchAssessments,
    deleteAssessment,
  };
}
