import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import { TrainingSessionProvider } from './contexts/TrainingSessionContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/LoginPage';
import { GoogleCallbackPage } from './pages/GoogleCallbackPage';
import { DashboardPage } from './pages/DashboardPage';
import { ExercisesPage } from './pages/ExercisesPage';
import { WorkoutsPage } from './pages/WorkoutsPage';
import { WorkoutCreatePage } from './pages/WorkoutCreatePage';
import { WorkoutDetailPage } from './pages/WorkoutDetailPage';
import { WorkoutEditPage } from './pages/WorkoutEditPage';
import { TrainSelectPage } from './pages/TrainSelectPage';
import { ActiveTrainingPage } from './pages/ActiveTrainingPage';
import { SessionHistoryPage } from './pages/SessionHistoryPage';
import { SessionDetailPage } from './pages/SessionDetailPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { AssessmentCreatePage } from './pages/AssessmentCreatePage';
import { AssessmentDetailPage } from './pages/AssessmentDetailPage';
import { AssessmentProgressPage } from './pages/AssessmentProgressPage';
import { AssessmentComparePage } from './pages/AssessmentComparePage';
import { AchievementsPage } from './pages/AchievementsPage';
import { PersonalRecordsPage } from './pages/PersonalRecordsPage';
import { AiBuilderPage } from './pages/AiBuilderPage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
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
                    <Route path="/exercises" element={<ExercisesPage />} />
                    <Route path="/workouts" element={<WorkoutsPage />} />
                    <Route path="/workouts/new" element={<WorkoutCreatePage />} />
                    <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
                    <Route path="/workouts/:id/edit" element={<WorkoutEditPage />} />
                    <Route path="/train" element={<TrainSelectPage />} />
                    <Route path="/train/:id" element={<ActiveTrainingPage />} />
                    <Route path="/sessions" element={<SessionHistoryPage />} />
                    <Route path="/sessions/:id" element={<SessionDetailPage />} />
                    <Route path="/assessments" element={<AssessmentsPage />} />
                    <Route path="/assessments/new" element={<AssessmentCreatePage />} />
                    <Route path="/assessments/compare" element={<AssessmentComparePage />} />
                    <Route path="/assessments/progress" element={<AssessmentProgressPage />} />
                    <Route path="/assessments/:id" element={<AssessmentDetailPage />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                    <Route path="/records" element={<PersonalRecordsPage />} />
                    <Route path="/ai/builder" element={<AiBuilderPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                </Route>
              </Routes>
            </TrainingSessionProvider>
          </AuthProvider>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
