import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import { LoginPageRoute, RegisterPageRoute, ForgotPasswordPageRoute } from './pages/AuthPages';
import { GoalSelectionPage, SubjectSelectionPage, PlacementTestPage } from './pages/OnboardingPages';
import { DashboardPage } from './pages/DashboardPage';
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

          {/* Dashboard Route - Require authentication and onboarding */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireOnboarding={true}>
                <DashboardPage />
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
