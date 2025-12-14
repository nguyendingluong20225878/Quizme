import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import { LoginPageRoute, RegisterPageRoute, ForgotPasswordPageRoute } from './pages/AuthPages';
import { GoalSelectionPage, SubjectSelectionPage, PlacementTestPage } from './pages/OnboardingPages';
import { DashboardPage } from './pages/DashboardPage';
import { ExamRoomPage } from './pages/ExamRoomPage';
import { Challenge5MinPage } from './pages/Challenge5MinPage';
import { GoldenTimePage } from './pages/GoldenTimePage';
import { RoadmapPage } from './pages/RoadmapPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProfilePageRoute } from './pages/ProfilePageRoute';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { TestLibraryPage } from './pages/TestLibraryPage';
import { ProtectedRoute } from './components/routing/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes - Redirect to dashboard if already logged in */}
          <Route path="/login" element={<LoginPageRoute />} />
          <Route path="/register" element={<RegisterPageRoute />} />
          <Route path="/forgot-password" element={<ForgotPasswordPageRoute />} />

          {/* Onboarding Routes - Require authentication, redirect to dashboard if already onboarded */}
          <Route
            path="/goal-selection"
            element={
              <ProtectedRoute>
                <GoalSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subject-selection"
            element={
              <ProtectedRoute>
                <SubjectSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/placement-test"
            element={
              <ProtectedRoute>
                <PlacementTestPage />
              </ProtectedRoute>
            }
          />

          {/* Main App Routes - Require authentication and onboarding */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Exam Room Routes */}
          <Route
            path="/exam-room"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <ExamRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam-room/sprint"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <ExamRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam-room/marathon"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <ExamRoomPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam-room/ranking"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <ExamRoomPage />
              </ProtectedRoute>
            }
          />

          {/* Challenge 5 Min Route */}
          <Route
            path="/challenge-5min"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <Challenge5MinPage />
              </ProtectedRoute>
            }
          />

          {/* Golden Time Route */}
          <Route
            path="/golden-time"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <GoldenTimePage />
              </ProtectedRoute>
            }
          />

          {/* Learning Roadmap Route */}
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <RoadmapPage />
              </ProtectedRoute>
            }
          />

          {/* Analytics Route */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <ProfilePageRoute />
              </ProtectedRoute>
            }
          />

          {/* Leaderboard Route */}
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />

          {/* Test Library Route */}
          <Route
            path="/test-library"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <TestLibraryPage />
              </ProtectedRoute>
            }
          />

          {/* Default route - redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
