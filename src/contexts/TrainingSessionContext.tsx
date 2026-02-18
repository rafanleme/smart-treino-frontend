import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { TrainingSession } from '../types';
import { sessionService } from '../services/sessionService';
import { message } from 'antd';

const STORAGE_KEY = 'smarttreino_active_session';

interface TrainingSessionContextType {
  activeSession: TrainingSession | null;
  loading: boolean;
  startSession: (workoutId: number) => Promise<TrainingSession | null>;
  endSession: (status: 'completed' | 'abandoned', notes?: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  clearSession: () => void;
}

const TrainingSessionContext = createContext<TrainingSessionContextType | undefined>(undefined);

export function TrainingSessionProvider({ children }: { children: ReactNode }) {
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null);
  const [loading, setLoading] = useState(true);

  // Load active session from localStorage on mount
  useEffect(() => {
    const loadActiveSession = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const sessionId = JSON.parse(stored);
          const response = await sessionService.get(sessionId);
          const session = response.data.data;

          // Only restore if session is still in progress
          if (session.status === 'in_progress') {
            setActiveSession(session);
          } else {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (error) {
        console.error('Failed to load active session:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadActiveSession();
  }, []);

  // Persist active session to localStorage
  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeSession.id));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeSession]);

  const startSession = async (workoutId: number): Promise<TrainingSession | null> => {
    try {
      const response = await sessionService.start(workoutId);
      const session = response.data.data;
      setActiveSession(session);
      message.success('Treino iniciado!');
      return session;
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao iniciar treino');
      return null;
    }
  };

  const endSession = async (status: 'completed' | 'abandoned', notes?: string) => {
    if (!activeSession) return;

    try {
      await sessionService.update(activeSession.id, { status, notes });
      setActiveSession(null);

      if (status === 'completed') {
        message.success('Treino finalizado!');
      } else {
        message.info('Treino abandonado');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Erro ao finalizar treino');
      throw error;
    }
  };

  const refreshSession = async () => {
    if (!activeSession) return;

    try {
      const response = await sessionService.get(activeSession.id);
      setActiveSession(response.data.data);
    } catch (error) {
      console.error('Failed to refresh session:', error);
    }
  };

  const clearSession = () => {
    setActiveSession(null);
  };

  return (
    <TrainingSessionContext.Provider
      value={{
        activeSession,
        loading,
        startSession,
        endSession,
        refreshSession,
        clearSession,
      }}
    >
      {children}
    </TrainingSessionContext.Provider>
  );
}

export function useTrainingSession() {
  const context = useContext(TrainingSessionContext);
  if (!context) {
    throw new Error('useTrainingSession must be used within TrainingSessionProvider');
  }
  return context;
}
