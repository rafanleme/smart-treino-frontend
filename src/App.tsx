import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntdApp, Spin } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { Suspense, lazy } from 'react';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import { TrainingSessionProvider } from './contexts/TrainingSessionContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { LoginPage } from './pages/LoginPage';
import { GoogleCallbackPage } from './pages/GoogleCallbackPage';
import { DashboardPage } from './pages/DashboardPage';

// Lazy load pages for code splitting
const ExercisesPage = lazy(() => import('./pages/ExercisesPage').then(m => ({ default: m.ExercisesPage })));
const WorkoutsPage = lazy(() => import('./pages/WorkoutsPage').then(m => ({ default: m.WorkoutsPage })));
const WorkoutCreatePage = lazy(() => import('./pages/WorkoutCreatePage').then(m => ({ default: m.WorkoutCreatePage })));
const WorkoutDetailPage = lazy(() => import('./pages/WorkoutDetailPage').then(m => ({ default: m.WorkoutDetailPage })));
const WorkoutEditPage = lazy(() => import('./pages/WorkoutEditPage').then(m => ({ default: m.WorkoutEditPage })));
const TrainSelectPage = lazy(() => import('./pages/TrainSelectPage').then(m => ({ default: m.TrainSelectPage })));
const ActiveTrainingPage = lazy(() => import('./pages/ActiveTrainingPage').then(m => ({ default: m.ActiveTrainingPage })));
const SessionHistoryPage = lazy(() => import('./pages/SessionHistoryPage').then(m => ({ default: m.SessionHistoryPage })));
const SessionDetailPage = lazy(() => import('./pages/SessionDetailPage').then(m => ({ default: m.SessionDetailPage })));
const AssessmentsPage = lazy(() => import('./pages/AssessmentsPage').then(m => ({ default: m.AssessmentsPage })));
const AssessmentCreatePage = lazy(() => import('./pages/AssessmentCreatePage').then(m => ({ default: m.AssessmentCreatePage })));
const AssessmentDetailPage = lazy(() => import('./pages/AssessmentDetailPage').then(m => ({ default: m.AssessmentDetailPage })));
const AssessmentProgressPage = lazy(() => import('./pages/AssessmentProgressPage').then(m => ({ default: m.AssessmentProgressPage })));
const AssessmentComparePage = lazy(() => import('./pages/AssessmentComparePage').then(m => ({ default: m.AssessmentComparePage })));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage').then(m => ({ default: m.AchievementsPage })));
const PersonalRecordsPage = lazy(() => import('./pages/PersonalRecordsPage').then(m => ({ default: m.PersonalRecordsPage })));
const AiBuilderPage = lazy(() => import('./pages/AiBuilderPage').then(m => ({ default: m.AiBuilderPage })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));

// Loading fallback component
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <Spin size="large" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider theme={theme} locale={ptBR}>
        <AntdApp>
          <BrowserRouter>
            <AuthProvider>
              <TrainingSessionProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/auth/callback" element={<GoogleCallbackPage />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/exercises" element={<Suspense fallback={<PageLoader />}><ExercisesPage /></Suspense>} />
                    <Route path="/workouts" element={<Suspense fallback={<PageLoader />}><WorkoutsPage /></Suspense>} />
                    <Route path="/workouts/new" element={<Suspense fallback={<PageLoader />}><WorkoutCreatePage /></Suspense>} />
                    <Route path="/workouts/:id" element={<Suspense fallback={<PageLoader />}><WorkoutDetailPage /></Suspense>} />
                    <Route path="/workouts/:id/edit" element={<Suspense fallback={<PageLoader />}><WorkoutEditPage /></Suspense>} />
                    <Route path="/train" element={<Suspense fallback={<PageLoader />}><TrainSelectPage /></Suspense>} />
                    <Route path="/train/:id" element={<Suspense fallback={<PageLoader />}><ActiveTrainingPage /></Suspense>} />
                    <Route path="/sessions" element={<Suspense fallback={<PageLoader />}><SessionHistoryPage /></Suspense>} />
                    <Route path="/sessions/:id" element={<Suspense fallback={<PageLoader />}><SessionDetailPage /></Suspense>} />
                    <Route path="/assessments" element={<Suspense fallback={<PageLoader />}><AssessmentsPage /></Suspense>} />
                    <Route path="/assessments/new" element={<Suspense fallback={<PageLoader />}><AssessmentCreatePage /></Suspense>} />
                    <Route path="/assessments/compare" element={<Suspense fallback={<PageLoader />}><AssessmentComparePage /></Suspense>} />
                    <Route path="/assessments/progress" element={<Suspense fallback={<PageLoader />}><AssessmentProgressPage /></Suspense>} />
                    <Route path="/assessments/:id" element={<Suspense fallback={<PageLoader />}><AssessmentDetailPage /></Suspense>} />
                    <Route path="/achievements" element={<Suspense fallback={<PageLoader />}><AchievementsPage /></Suspense>} />
                    <Route path="/records" element={<Suspense fallback={<PageLoader />}><PersonalRecordsPage /></Suspense>} />
                    <Route path="/ai/builder" element={<Suspense fallback={<PageLoader />}><AiBuilderPage /></Suspense>} />
                    <Route path="/profile" element={<Suspense fallback={<PageLoader />}><ProfilePage /></Suspense>} />
                  </Route>
                </Route>
              </Routes>
              </TrainingSessionProvider>
            </AuthProvider>
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </ErrorBoundary>
  );
}

export default App;
