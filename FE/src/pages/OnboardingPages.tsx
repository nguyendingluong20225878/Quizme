/**
 * Individual Onboarding Pages
 * Mỗi trang onboarding có route riêng
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Target } from 'lucide-react';
import { GoalSelection } from '../components/onboarding/GoalSelection';
import { SubjectSelection } from '../components/onboarding/SubjectSelection';
import { PlacementTest } from '../components/onboarding/PlacementTest';
import { useAuth } from '../contexts/AuthContext';

// Storage keys for onboarding state
const ONBOARDING_GOALS_KEY = 'quizme_onboarding_goals';
const ONBOARDING_SUBJECTS_KEY = 'quizme_onboarding_subjects';

/**
 * Goal Selection Page
 * Route: /goal-selection
 */
export function GoalSelectionPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Redirect nếu chưa đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (user?.onboardingCompleted) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleComplete = (goals: string[]) => {
    localStorage.setItem(ONBOARDING_GOALS_KEY, JSON.stringify(goals));
    navigate('/subject-selection');
  };

  if (!isAuthenticated || user?.onboardingCompleted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-yellow-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-teal-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Bước 1/3</span>
            <span className="text-sm text-teal-600">Chọn Mục Tiêu</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-orange-500"
              initial={{ width: '0%' }}
              animate={{ width: '33.33%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      <div className="pt-24 pb-12 px-4">
        <GoalSelection onComplete={handleComplete} />
      </div>
    </div>
  );
}

/**
 * Subject Selection Page
 * Route: /subject-selection
 */
export function SubjectSelectionPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load goals from storage
  useEffect(() => {
    const storedGoals = localStorage.getItem(ONBOARDING_GOALS_KEY);
    if (storedGoals) {
      try {
        const parsed = JSON.parse(storedGoals);
        setSelectedGoals(parsed);
      } catch (error) {
        console.error('Error parsing stored goals:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Redirect nếu chưa đăng nhập hoặc chưa chọn goals
  useEffect(() => {
    if (isLoading) return; // Đợi load xong
    
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    if (user?.onboardingCompleted) {
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // Check cả state và localStorage để tránh race condition
    const storedGoals = localStorage.getItem(ONBOARDING_GOALS_KEY);
    if (!storedGoals || selectedGoals.length === 0) {
      // Nếu chưa có goals, quay về bước 1
      navigate('/goal-selection', { replace: true });
    }
  }, [isAuthenticated, user, selectedGoals.length, navigate, isLoading]);

  const handleComplete = (subjects: string[]) => {
    localStorage.setItem(ONBOARDING_SUBJECTS_KEY, JSON.stringify(subjects));
    navigate('/placement-test');
  };

  const handleBack = () => {
    navigate('/goal-selection');
  };

  if (isLoading || !isAuthenticated || user?.onboardingCompleted) {
    return null;
  }
  
  // Check localStorage nếu state chưa load
  const storedGoals = localStorage.getItem(ONBOARDING_GOALS_KEY);
  if (!storedGoals && selectedGoals.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-yellow-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-teal-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Bước 2/3</span>
            <span className="text-sm text-teal-600">Chọn Môn Học</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-orange-500"
              initial={{ width: '0%' }}
              animate={{ width: '66.66%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      <div className="pt-24 pb-12 px-4">
        <SubjectSelection onComplete={handleComplete} onBack={handleBack} />
      </div>
    </div>
  );
}

/**
 * Placement Test Page
 * Route: /placement-test
 */
export function PlacementTestPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, completeOnboarding } = useAuth();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  // Load data from storage
  useEffect(() => {
    const storedGoals = localStorage.getItem(ONBOARDING_GOALS_KEY);
    const storedSubjects = localStorage.getItem(ONBOARDING_SUBJECTS_KEY);
    
    if (storedGoals) {
      try {
        setSelectedGoals(JSON.parse(storedGoals));
      } catch (error) {
        console.error('Error parsing stored goals:', error);
      }
    }
    if (storedSubjects) {
      try {
        setSelectedSubjects(JSON.parse(storedSubjects));
      } catch (error) {
        console.error('Error parsing stored subjects:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // ✅ useEffect riêng để watch user.onboardingCompleted và navigate đến dashboard
  useEffect(() => {
    if (isAuthenticated && user?.onboardingCompleted && !isCompleting) {
      navigate('/dashboard', { replace: true });
    }
  }, [user?.onboardingCompleted, isAuthenticated, navigate, isCompleting]);

  // Redirect nếu chưa đăng nhập hoặc chưa hoàn thành các bước trước
  useEffect(() => {
    if (isLoading || isCompleting) return; // Đợi load xong hoặc đang complete
    
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    // Nếu đã complete onboarding, useEffect trên sẽ handle navigate
    if (user?.onboardingCompleted) {
      return;
    }
    
    // Check cả state và localStorage để tránh race condition
    const storedGoals = localStorage.getItem(ONBOARDING_GOALS_KEY);
    const storedSubjects = localStorage.getItem(ONBOARDING_SUBJECTS_KEY);
    
    if (!storedGoals || !storedSubjects || selectedGoals.length === 0 || selectedSubjects.length === 0) {
      // Nếu thiếu data, quay về bước đầu
      navigate('/goal-selection', { replace: true });
    }
  }, [isAuthenticated, user, selectedGoals.length, selectedSubjects.length, navigate, isLoading, isCompleting]);

  const handleComplete = async (level: number) => {
    try {
      setIsCompleting(true); // Set flag để tránh useEffect redirect về goal-selection
      
      // Complete onboarding - update state (local hoặc từ API)
      await completeOnboarding(selectedGoals, selectedSubjects, level);
      
      // Clear temporary storage
      localStorage.removeItem(ONBOARDING_GOALS_KEY);
      localStorage.removeItem(ONBOARDING_SUBJECTS_KEY);
      
      // Đợi React re-render với user state mới
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Navigate trực tiếp đến /dashboard (trang Buồng Lái - DashboardPage)
      // Đợi một chút nữa để đảm bảo user state đã được update trong context
      navigate('/dashboard', { replace: true });
      
      // Reset flag sau khi navigate
      setTimeout(() => {
        setIsCompleting(false);
      }, 100);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Nếu có lỗi, KHÔNG clear localStorage và KHÔNG navigate
      // Giữ nguyên state để user có thể thử lại
      setIsCompleting(false);
    }
  };

  const handleBack = () => {
    navigate('/subject-selection');
  };

  // Nếu đang complete, hiển thị loading thay vì null để tránh flash
  if (isCompleting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Target className="w-10 h-10 text-white" />
          </div>
          <p className="text-teal-700">Đang hoàn thành...</p>
        </div>
      </div>
    );
  }
  
  if (isLoading || !isAuthenticated || user?.onboardingCompleted) {
    return null;
  }
  
  // Check localStorage nếu state chưa load
  const storedGoals = localStorage.getItem(ONBOARDING_GOALS_KEY);
  const storedSubjects = localStorage.getItem(ONBOARDING_SUBJECTS_KEY);
  if ((!storedGoals || !storedSubjects) && (selectedGoals.length === 0 || selectedSubjects.length === 0)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-yellow-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-teal-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Bước 3/3</span>
            <span className="text-sm text-teal-600">Kiểm Tra Đầu Vào</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-orange-500"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      <div className="pt-24 pb-12 px-4">
        <PlacementTest subjects={selectedSubjects} onComplete={handleComplete} onBack={handleBack} />
      </div>
    </div>
  );
}

