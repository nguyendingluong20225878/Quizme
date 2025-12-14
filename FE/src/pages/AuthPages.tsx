/**
 * Auth Pages with Navigation
 */

import { useNavigate } from 'react-router-dom';
import { LoginPage } from '../components/auth/LoginPage';
import { RegisterPage } from '../components/auth/RegisterPage';
import { ForgotPasswordPage } from '../components/auth/ForgotPasswordPage';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

/**
 * Login Page
 * Route: /login
 */
export function LoginPageRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Nếu đã đăng nhập, chuyển đến dashboard hoặc onboarding
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.onboardingCompleted) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/goal-selection', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  // Sau khi login thành công, useEffect sẽ tự động redirect
  return (
    <LoginPage
      onSwitchToRegister={handleSwitchToRegister}
      onForgotPassword={handleForgotPassword}
    />
  );
}

/**
 * Register Page
 * Route: /register
 */
export function RegisterPageRoute() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Nếu đã đăng nhập, chuyển đến dashboard hoặc onboarding
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.onboardingCompleted) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/goal-selection', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  // Sau khi register thành công, useEffect sẽ tự động redirect
  return <RegisterPage onSwitchToLogin={handleSwitchToLogin} />;
}

/**
 * Forgot Password Page
 * Route: /forgot-password
 */
export function ForgotPasswordPageRoute() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/login');
  };

  return <ForgotPasswordPage onBack={handleBack} />;
}

