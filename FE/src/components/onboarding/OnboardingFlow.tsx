import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoalSelection } from './GoalSelection';
import { SubjectSelection } from './SubjectSelection';
import { PlacementTest } from './PlacementTest';
import { useAuth } from '../../contexts/AuthContext';

// ✅ THÊM ROUTER
import { useRouter } from 'next/navigation';

type OnboardingStep = 'goal' | 'subject' | 'placement';

export function OnboardingFlow() {
  const { completeOnboarding } = useAuth();
  const router = useRouter(); // ✅ KHỞI TẠO ROUTER

  const [currentStep, setCurrentStep] = useState<OnboardingStep>('goal');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleGoalComplete = (goals: string[]) => {
    setSelectedGoals(goals);
    setCurrentStep('subject');
  };

  const handleSubjectComplete = (subjects: string[]) => {
    setSelectedSubjects(subjects);
    setCurrentStep('placement');
  };

  // ✅ FIX LOGIC TẠI ĐÂY
  const handlePlacementComplete = async (level: number) => {
    // ✅ 1. LƯU THÔNG TIN ONBOARDING
    await completeOnboarding(selectedGoals, selectedSubjects, level);

    // ✅ 2. CỜ BẬT/TẮT AI (SAU NÀY CHỈ CẦN ĐỔI true)
    const HAS_AI = false;

    if (HAS_AI) {
      // 🔮 SAU NÀY BẠN GỌI AI Ở ĐÂY
      // await fetch('/api/ai-recommend', { method: 'POST', body: JSON.stringify({ level }) })
      // router.push('/ai-result');
    } else {
      // ✅ HIỆN TẠI: CHƯA CÓ AI → CHUYỂN TRANG LUÔN
      router.push('/dashboard'); 
      // 👉 bạn có thể đổi thành:
      // router.push('/home');
      // router.push('/learning');
      // router.push('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-yellow-50">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-teal-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {currentStep === 'goal' && 'Bước 1/3'}
              {currentStep === 'subject' && 'Bước 2/3'}
              {currentStep === 'placement' && 'Bước 3/3'}
            </span>
            <span className="text-sm text-teal-600">
              {currentStep === 'goal' && 'Chọn Mục Tiêu'}
              {currentStep === 'subject' && 'Chọn Môn Học'}
              {currentStep === 'placement' && 'Kiểm Tra Đầu Vào'}
            </span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-orange-500"
              initial={{ width: '0%' }}
              animate={{
                width:
                  currentStep === 'goal'
                    ? '33.33%'
                    : currentStep === 'subject'
                    ? '66.66%'
                    : '100%',
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4">
        <AnimatePresence mode="wait">
          {currentStep === 'goal' && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <GoalSelection onComplete={handleGoalComplete} />
            </motion.div>
          )}

          {currentStep === 'subject' && (
            <motion.div
              key="subject"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <SubjectSelection
                onComplete={handleSubjectComplete}
                onBack={() => setCurrentStep('goal')}
              />
            </motion.div>
          )}

          {currentStep === 'placement' && (
            <motion.div
              key="placement"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
            >
              <PlacementTest
                subjects={selectedSubjects}
                onComplete={handlePlacementComplete} // ✅ ĐÃ GẮN LOGIC MỚI
                onBack={() => setCurrentStep('subject')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
