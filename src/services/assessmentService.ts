import api from './api';
import type { ApiResponse, PhysicalAssessment, AssessmentComparison, ProgressDataPoint } from '../types';

export const assessmentService = {
  list: () =>
    api.get<ApiResponse<PhysicalAssessment[]>>('/assessments'),

  get: (id: number) =>
    api.get<ApiResponse<PhysicalAssessment>>(`/assessments/${id}`),

  create: (data: Partial<PhysicalAssessment>) =>
    api.post<ApiResponse<PhysicalAssessment>>('/assessments', data),

  update: (id: number, data: Partial<PhysicalAssessment>) =>
    api.put<ApiResponse<PhysicalAssessment>>(`/assessments/${id}`, data),

  delete: (id: number) =>
    api.delete(`/assessments/${id}`),

  compare: (fromId: number, toId: number) =>
    api.get<ApiResponse<AssessmentComparison>>('/assessments-compare', { params: { from: fromId, to: toId } }),

  progress: (field: string, dateFrom?: string, dateTo?: string) =>
    api.get<ApiResponse<ProgressDataPoint[]>>('/assessments-progress', {
      params: { field, date_from: dateFrom, date_to: dateTo }
    }),
};
