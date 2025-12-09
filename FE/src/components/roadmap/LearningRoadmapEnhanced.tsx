import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { StageNode, type Stage } from './StageNode';
import { StageDetailModal } from './StageDetailModal';
import { RoadmapPath } from './RoadmapPath';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Trophy, Map, Target, Zap, Star, TrendingUp } from 'lucide-react';

export const LearningRoadmapEnhanced: React.FC = () => {
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [stages, setStages] = useState<Stage[]>([
    {
      id: 1,
      title: 'Hàm Số Cơ Bản',
      description: 'Tìm hiểu khái niệm hàm số, đồ thị và các tính chất cơ bản',
      progress: 100,
      status: 'completed',
      totalLessons: 5,
      completedLessons: 5,
      totalQuestions: 50,
      correctQuestions: 48,
      bossUnlocked: true,
      bossDefeated: true,
      icon: '📈',
      color: 'from-blue-500 to-cyan-600',
      side: 'left',
      xp: 500,
      earnedXP: 500
    },
    {
      id: 2,
      title: 'Logarit',
      description: 'Học về logarit, tính chất và ứng dụng',
      progress: 75,
      status: 'active',
      totalLessons: 5,
      completedLessons: 4,
      totalQuestions: 50,
      correctQuestions: 32,
      bossUnlocked: true,
      bossDefeated: false,
      icon: '🔢',
      color: 'from-purple-500 to-pink-600',
      side: 'right',
      xp: 600,
      earnedXP: 450
    },
    {
      id: 3,
      title: 'Lượng Giác',
      description: 'Khám phá các hàm lượng giác và phương trình',
      progress: 30,
      status: 'active',
      totalLessons: 6,
      completedLessons: 2,
      totalQuestions: 60,
      correctQuestions: 15,
      bossUnlocked: false,
      bossDefeated: false,
      icon: '📐',
      color: 'from-green-500 to-teal-600',
      side: 'left',
      xp: 700,
      earnedXP: 210
    },
    {
      id: 4,
      title: 'Hình Học Không Gian',
      description: 'Học về hình học 3D và tính toán thể tích',
      progress: 0,
      status: 'locked',
      totalLessons: 7,
      completedLessons: 0,
      totalQuestions: 70,
      correctQuestions: 0,
      bossUnlocked: false,
      bossDefeated: false,
      icon: '🔷',
      color: 'from-orange-500 to-red-600',
      side: 'right',
      xp: 800,
      earnedXP: 0
    },
    {
      id: 5,
      title: 'Đạo Hàm & Tích Phân',
      description: 'Làm chủ các phép tính vi tích phân',
      progress: 0,
      status: 'locked',
      totalLessons: 8,
      completedLessons: 0,
      totalQuestions: 80,
      correctQuestions: 0,
      bossUnlocked: false,
      bossDefeated: false,
      icon: '∫',
      color: 'from-pink-500 to-rose-600',
      side: 'left',
      xp: 900,
      earnedXP: 0
    },
    {
      id: 6,
      title: 'Tổng Ôn & Thi Thử',
      description: 'Đánh giá tổng hợp kiến thức toàn bộ khóa học',
      progress: 0,
      status: 'locked',
      totalLessons: 10,
      completedLessons: 0,
      totalQuestions: 100,
      correctQuestions: 0,
      bossUnlocked: false,
      bossDefeated: false,
      icon: '🏆',
      color: 'from-yellow-500 to-orange-600',
      side: 'right',
      xp: 1000,
      earnedXP: 0
    }
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [pathSegments, setPathSegments] = useState<any[]>([]);

  // Calculate path segments for connecting nodes
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const nodes = container.querySelectorAll('[data-stage-id]');
    const segments: any[] = [];

    nodes.forEach((node, index) => {
      if (index < nodes.length - 1) {
        const currentRect = node.getBoundingClientRect();
        const nextRect = nodes[index + 1].getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const currentStage = stages[index];
        const nextStage = stages[index + 1];

        segments.push({
          startX: currentRect.left - containerRect.left + currentRect.width / 2,
          startY: currentRect.bottom - containerRect.top,
          endX: nextRect.left - containerRect.left + nextRect.width / 2,
          endY: nextRect.top - containerRect.top,
          completed: currentStage.status === 'completed',
          active: currentStage.status === 'active' || nextStage.status === 'active'
        });
      }
    });

    setPathSegments(segments);
  }, [stages]);

  const handleStageClick = (stage: Stage) => {
    if (stage.status !== 'locked') {
      setSelectedStage(stage);
    }
  };

  const handleStartLesson = (lessonId: number) => {
    console.log('Starting lesson:', lessonId);
    // Implement lesson start logic
    setSelectedStage(null);
  };

  const handleStartBoss = (stageId: number) => {
    console.log('Starting boss battle for stage:', stageId);
    // Implement boss battle logic
    setSelectedStage(null);
  };

  const totalStages = stages.length;
  const completedStages = stages.filter(s => s.status === 'completed').length;
  const totalXP = stages.reduce((sum, s) => sum + s.earnedXP, 0);
  const maxXP = stages.reduce((sum, s) => sum + s.xp, 0);
  const overallProgress = Math.round((totalXP / maxXP) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <Map className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-3xl mb-2"
        >
          🗺️ Lộ Trình Chinh Phục
        </motion.h2>
        <p className="text-gray-600">Hành trình từ tân binh đến cao thủ</p>
      </div>

      {/* Overall Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl text-gray-900">{overallProgress}%</div>
                  <div className="text-sm text-gray-600">Tiến độ</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl text-gray-900">{completedStages}/{totalStages}</div>
                  <div className="text-sm text-gray-600">Stages</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl text-gray-900">{totalXP.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">XP Earned</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="text-2xl text-gray-900">
                    {stages.filter(s => s.bossDefeated).length}/{stages.filter(s => s.bossUnlocked).length}
                  </div>
                  <div className="text-sm text-gray-600">Boss Battles</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Roadmap Container */}
      <div
        ref={containerRef}
        className="relative min-h-[2000px] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 overflow-hidden"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, #9333ea 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* SVG Paths */}
        {pathSegments.length > 0 && <RoadmapPath segments={pathSegments} />}

        {/* Stage Nodes */}
        <div className="relative z-10 space-y-32">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              data-stage-id={stage.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, type: 'spring' }}
              className={`flex ${stage.side === 'left' ? 'justify-start' : 'justify-end'}`}
            >
              <div className="w-full md:w-1/2">
                <StageNode
                  stage={stage}
                  onClick={handleStageClick}
                  onStartBoss={handleStartBoss}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Finish Flag */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="text-center">
            <div className="text-6xl mb-2">🏁</div>
            <div className="text-gray-700">MỤC TIÊU CUỐI CÙNG</div>
            <div className="text-sm text-gray-500">Hoàn thành toàn bộ lộ trình</div>
          </div>
        </motion.div>
      </div>

      {/* Motivational Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-cyan-500 to-blue-600 border-0 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-12 h-12" />
              <div>
                <h3 className="mb-1">💪 Tiếp tục cố gắng!</h3>
                <p className="text-white/80">
                  Bạn đang ở Stage {stages.find(s => s.status === 'active')?.id || 1}. 
                  Hoàn thành {stages.find(s => s.status === 'active')?.totalLessons - (stages.find(s => s.status === 'active')?.completedLessons || 0)} bài học nữa để mở khóa Stage tiếp theo!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stage Detail Modal */}
      <StageDetailModal
        stage={selectedStage}
        onClose={() => setSelectedStage(null)}
        onStartLesson={handleStartLesson}
        onStartBoss={handleStartBoss}
      />
    </div>
  );
};
