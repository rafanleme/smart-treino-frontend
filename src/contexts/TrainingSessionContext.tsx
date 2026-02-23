import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { App } from 'antd';
import type { TrainingSession } from '../types';
import { sessionService } from '../services/sessionService';
import { useAuth } from '../hooks/useAuth';

const STORAGE_KEY = 'smarttreino_active_session';

interface TrainingSessionContextType {
  activeSession: TrainingSession | null;
  loading: boolean;
  startSession: (workoutId: number) => Promise<TrainingSession | null>;
  endSession: (status: 'completed' | 'abandoned', notes?: string) => Promise<void>;
  refreshSession: () => Promise<void>;
  clearSession: () => void;
  dismissBanner: () => void;
  bannerDismissed: boolean;
}

const TrainingSessionContext = createContext<TrainingSessionContextType | undefined>(undefined);

export function TrainingSessionProvider({ children }: { children: ReactNode }) {
  const { message } = App.useApp();
  const { user, loading: authLoading } = useAuth();
  const [activeSession, setActiveSession] = useState<TrainingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Load active session from API (works cross-device)
  useEffect(() => {
    // GUARD: Don't fetch if auth is still loading or user is not authenticated
    if (authLoading) {
      return; // Wait for auth to complete
    }

    if (!user) {
      // User is not authenticated, skip session recovery
      setLoading(false);
      return;
    }

    const loadActiveSession = async () => {
      try {
        // Try API first (works cross-device)
        const response = await sessionService.getActive();
        const session = response.data.data;

        setActiveSession(session);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session.id));
      } catch (error: any) {
        if (error.response?.status === 404) {
          // No active session on server, clean up
          localStorage.removeItem(STORAGE_KEY);
        } else {
          console.error('Failed to load active session:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadActiveSession();
  }, [authLoading, user]);

  // Persist active session to localStorage
  useEffect(() => {
    if (activeSession) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeSession.id));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activeSession]);

  // Control banner dismissal
  useEffect(() => {
    if (activeSession) {
      const dismissed = sessionStorage.getItem('banner_dismissed');
      if (dismissed) {
        const dismissedId = JSON.parse(dismissed);
        if (dismissedId !== activeSession.id) {
          sessionStorage.removeItem('banner_dismissed');
          setBannerDismissed(false);
        } else {
          setBannerDismissed(true);
        }
      }
    } else {
      sessionStorage.removeItem('banner_dismissed');
      setBannerDismissed(false);
    }
  }, [activeSession?.id]);

  const startSession = async (workoutId: number): Promise<TrainingSession | null> => {
    try {
      const response = await sessionService.start(workoutId);
      const session = response.data.data;
      setActiveSession(session);
      setBannerDismissed(false);
      message.success('Treino iniciado!');
      return session;
    } catch (error: any) {
      // Check if error is due to existing active session
      if (error.response?.status === 400 && error.response?.data?.data?.session) {
        // Re-throw to be handled by TrainSelectPage
        throw error;
      }
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

  const dismissBanner = () => {
    if (activeSession) {
      sessionStorage.setItem('banner_dismissed', JSON.stringify(activeSession.id));
      setBannerDismissed(true);
    }
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
        dismissBanner,
        bannerDismissed,
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
