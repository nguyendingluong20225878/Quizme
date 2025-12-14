/**
 * Dashboard Page Component
 * Main app page after authentication and onboarding
 */

import { useState, useEffect } from 'react';
import { Challenge5MinContainer } from '../components/challenge/Challenge5MinContainer';
import ExamRoomContainer from '../components/exam/ExamRoomContainer';
import { TestsHub } from '../components/TestsHub';
import { LearningRoadmapEnhanced } from '../components/roadmap/LearningRoadmapEnhanced';
import { DashboardOptimized } from '../components/DashboardOptimized';
import { AITeacherPracticeContainer } from '../components/aiTeacher/AITeacherPracticeContainer';
import { GoldenTimeFlashcardContainer } from '../components/goldenTime/GoldenTimeFlashcardContainer';
import { StudyStreak } from '../components/StudyStreak';
import { Achievements } from '../components/Achievements';
import { GoldenTimeScreen } from '../components/GoldenTimeScreen';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { Mascot } from '../components/Mascot';
import { ProfilePage } from '../components/ProfilePage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Target } from 'lucide-react';
import { userService } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

export function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChallenge5Min, setShowChallenge5Min] = useState(false);
  const [showExamRoom, setShowExamRoom] = useState(false);
  const [showAITeacherPractice, setShowAITeacherPractice] = useState(false);
  const [selectedAITopic, setSelectedAITopic] = useState('');
  const [showGoldenTimeFlashcard, setShowGoldenTimeFlashcard] = useState(false);
  
  // Fetch user stats from API
  const [userStats, setUserStats] = useState({
    streak: 0,
    xp: 0,
    level: 1,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch user stats when authenticated
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        setStatsLoading(true);
        
        // Fetch stats and streak in parallel
        const [stats, streak] = await Promise.all([
          userService.getStats(),
          userService.getStreak(),
        ]);
        
        setUserStats({
          streak: streak.currentStreak,
          xp: stats.currentXP,
          level: stats.level,
        });
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  // Show Challenge 5 Min if active
  if (showChallenge5Min) {
    return <Challenge5MinContainer onExit={() => setShowChallenge5Min(false)} />;
  }

  // Show Exam Room if active
  if (showExamRoom) {
    return <ExamRoomContainer onExit={() => setShowExamRoom(false)} />;
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          {/* Top row: Logo + Navigation + User info */}
          <div className="flex items-center justify-between gap-6">
            {/* Left: Logo + Navigation */}
            <div className="flex items-center gap-8 flex-1">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-slate-700">QuizMe</h1>
              </div>

              {/* Navigation Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="h-10 bg-slate-100/50 border border-slate-200 p-1 rounded-lg">
                  <TabsTrigger value="dashboard" className="h-8 px-4 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-sm rounded-md transition-all">
                    Buồng Lái
                  </TabsTrigger>
                  <TabsTrigger value="tests" className="h-8 px-4 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-sm rounded-md transition-all">
                    Phòng Thi
                  </TabsTrigger>
                  <TabsTrigger value="golden" className="h-8 px-4 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-sm rounded-md transition-all">
                    Thời Điểm Vàng
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="h-8 px-4 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-sm rounded-md transition-all">
                    Phân Tích
                  </TabsTrigger>
                  <TabsTrigger value="roadmap" className="h-8 px-4 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-sm rounded-md transition-all">
                    Lộ Trình
                  </TabsTrigger>
                  <TabsTrigger value="achievements" className="h-8 px-4 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-sm rounded-md transition-all">
                    Kho Vũ Khí
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="h-8 px-4 text-slate-600 data-[state=active]:bg-white data-[state=active]:text-cyan-600 data-[state=active]:shadow-sm rounded-md transition-all">
                    Thành Tích
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Right: User Stats + Mascot */}
            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="flex items-center gap-3">
                <StudyStreak streak={userStats.streak} />
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-indigo-50 px-3 py-1.5 rounded-full border border-purple-200">
                  <span className="text-slate-700">
                    Level {user?.level || userStats.level} – {user?.xp || userStats.xp} XP
                  </span>
                </div>
              </div>

              {/* Mascot Avatar */}
              <button
                onClick={() => setActiveTab('profile')}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center text-white hover:scale-105 transition-transform shadow-md relative"
              >
                <span className="text-xl">👋</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="hidden">
            <TabsList></TabsList>
          </div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOptimized 
              onStartChallenge5Min={() => setShowChallenge5Min(true)}
              onStartAITeacherPractice={(topic) => {
                setSelectedAITopic(topic);
                setShowAITeacherPractice(true);
              }}
              onOpenGoldenTime={() => setShowGoldenTimeFlashcard(true)}
            />
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap">
            <LearningRoadmapEnhanced />
          </TabsContent>

          {/* Tests Hub Tab (Phòng Thi + Pha Chế + Thư viện) */}
          <TabsContent value="tests">
            <TestsHub onOpenExamRoom={() => setShowExamRoom(true)} />
          </TabsContent>

          {/* Golden Time Tab */}
          <TabsContent value="golden">
            <GoldenTimeScreen />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Achievements />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <ProfilePage />
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Mascot */}
      <div className="fixed bottom-8 right-8 z-40 animate-float">
        <Mascot position="floating" size="large" emotion="happy" />
      </div>

      {/* Overlays/Modals */}
      {showAITeacherPractice && (
        <div className="fixed inset-0 z-50">
          <AITeacherPracticeContainer
            topic={selectedAITopic}
            onClose={() => setShowAITeacherPractice(false)}
          />
        </div>
      )}

      {showGoldenTimeFlashcard && (
        <div className="fixed inset-0 z-50">
          <GoldenTimeFlashcardContainer
            onClose={() => setShowGoldenTimeFlashcard(false)}
          />
        </div>
      )}
    </div>
  );
}

