import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { TrendingUp, TrendingDown, Target, BookOpen, Zap, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Mascot } from './Mascot';

const spiderData = [
  { subject: 'Hàm số', score: 85, fullMark: 100 },
  { subject: 'Logarit', score: 65, fullMark: 100 },
  { subject: 'Lượng giác', score: 90, fullMark: 100 },
  { subject: 'Hình học', score: 75, fullMark: 100 },
  { subject: 'Đạo hàm', score: 80, fullMark: 100 },
  { subject: 'Sóng cơ', score: 70, fullMark: 100 }
];

const errorAnalysisByDifficulty = [
  { difficulty: 'Dễ', correct: 45, incorrect: 5, total: 50, color: '#10b981' },
  { difficulty: 'Trung bình', correct: 35, incorrect: 15, total: 50, color: '#f59e0b' },
  { difficulty: 'Khó', correct: 20, incorrect: 30, total: 50, color: '#ef4444' },
  { difficulty: 'Rất khó', correct: 10, incorrect: 40, total: 50, color: '#dc2626' }
];

const errorAnalysisByType = [
  { type: 'Nhận biết', correct: 48, incorrect: 2, total: 50, color: '#06b6d4', icon: '👁️' },
  { type: 'Thông hiểu', correct: 38, incorrect: 12, total: 50, color: '#8b5cf6', icon: '💡' },
  { type: 'Vận dụng', correct: 25, incorrect: 25, total: 50, color: '#f97316', icon: '⚙️' },
  { type: 'Vận dụng cao', correct: 12, incorrect: 38, total: 50, color: '#ec4899', icon: '🚀' }
];

const progressData = [
  { week: 'T2', score: 65 },
  { week: 'T3', score: 70 },
  { week: 'T4', score: 68 },
  { week: 'T5', score: 75 },
  { week: 'T6', score: 78 },
  { week: 'T7', score: 82 },
  { week: 'CN', score: 85 }
];

const weakTopics = [
  {
    id: 1,
    topic: 'Logarit',
    score: 65,
    trend: 'down',
    wrongQuestions: 7,
    totalQuestions: 20,
    commonErrors: ['Quên tính chất logarit tích', 'Sai dấu khi đổi cơ số'],
    icon: '🔢'
  },
  {
    id: 2,
    topic: 'Sóng cơ',
    score: 70,
    trend: 'stable',
    wrongQuestions: 6,
    totalQuestions: 20,
    commonErrors: ['Nhầm công thức tần số', 'Sai về pha dao động'],
    icon: '〰️'
  },
  {
    id: 3,
    topic: 'Hình học',
    score: 75,
    trend: 'up',
    wrongQuestions: 5,
    totalQuestions: 20,
    commonErrors: ['Tính sai thể tích', 'Nhầm công thức diện tích'],
    icon: '🔺'
  }
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Header with Mascot */}
      <Card className="bg-gradient-to-br from-indigo-400 via-purple-400 to-fuchsia-400 text-white border-0 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-white text-2xl mb-2 flex items-center gap-3">
                <Target className="w-8 h-8" />
                Bảng Phân Tích Chuyên Sâu
              </CardTitle>
              <p className="text-white/90">
                AI Coach phân tích chi tiết để giúp bạn tiến bộ nhanh hơn
              </p>
            </div>
            <Mascot emotion="thinking" size="large" />
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
          <TabsTrigger value="weaknesses">Điểm Yếu</TabsTrigger>
          <TabsTrigger value="progress">Tiến Độ</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Spider Chart + Quantitative Data */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                Biểu Đồ Năng Lực Tổng Hợp
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Tổng quan trực quan + Dữ liệu định lượng chi tiết
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={spiderData}>
                      <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#475569', fontSize: 14 }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                      />
                      <Radar 
                        name="Điểm của bạn" 
                        dataKey="score" 
                        stroke="#a78bfa" 
                        fill="#a78bfa" 
                        fillOpacity={0.5}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Quantitative Data Table - NEW */}
                <div className="space-y-3">
                  <h4 className="text-gray-700">📊 Độ Chính Xác Chi Tiết</h4>
                  {spiderData.map((item, index) => {
                    const isWeak = item.score < 70;
                    return (
                      <motion.div
                        key={item.subject}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                          isWeak ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex-1">
                          <p className="text-gray-900">{item.subject}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32">
                            <Progress value={item.score} className="h-2" />
                          </div>
                          <p className={`text-xl w-16 text-right ${
                            isWeak ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {item.score}%
                          </p>
                          {isWeak && (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Analysis - Redesigned */}
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-orange-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">Phân Tích Lỗi Sai</h3>
                    <p className="text-sm text-gray-600">Bạn mất điểm ở đâu?</p>
                  </div>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Analysis by Question Type */}
              <div>
                <h4 className="text-gray-700 mb-4 flex items-center gap-2">
                  📊 Phân tích theo Dạng Câu Hỏi
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {errorAnalysisByType.map((item, index) => {
                    const accuracy = (item.correct / item.total * 100).toFixed(0);
                    const isWeak = parseInt(accuracy) < 60;
                    
                    return (
                      <motion.div
                        key={item.type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative overflow-hidden rounded-xl border-2 ${
                          isWeak ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        {/* Background gradient */}
                        <div 
                          className="absolute inset-0 opacity-10"
                          style={{ background: `linear-gradient(135deg, ${item.color} 0%, transparent 100%)` }}
                        />
                        
                        <div className="relative z-10 p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{item.icon}</span>
                              <div>
                                <p className="text-gray-900">{item.type}</p>
                                <p className="text-xs text-gray-500">{item.total} câu</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <motion.p 
                                className={`text-3xl ${isWeak ? 'text-red-600' : 'text-green-600'}`}
                                initial={{ scale: 1.5 }}
                                animate={{ scale: 1 }}
                              >
                                {accuracy}%
                              </motion.p>
                            </div>
                          </div>

                          {/* Visual bar */}
                          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <motion.div
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{ backgroundColor: item.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${accuracy}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            />
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-green-600">✓ {item.correct} đúng</span>
                            <span className="text-red-600">✗ {item.incorrect} sai</span>
                          </div>

                          {/* Warning for weak areas */}
                          {isWeak && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 pt-3 border-t border-red-200"
                            >
                              <div className="flex items-center gap-2 text-red-700 text-xs">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Cần cải thiện khẩn cấp!</span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Analysis by Difficulty */}
              <div>
                <h4 className="text-gray-700 mb-4 flex items-center gap-2">
                  🎯 Phân tích theo Độ Khó
                </h4>
                <div className="space-y-3">
                  {errorAnalysisByDifficulty.map((item, index) => {
                    const accuracy = (item.correct / item.total * 100).toFixed(0);
                    
                    return (
                      <motion.div
                        key={item.difficulty}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-gray-300 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          {/* Difficulty Label */}
                          <div className="w-24 flex-shrink-0">
                            <Badge 
                              className="w-full justify-center"
                              style={{ backgroundColor: item.color }}
                            >
                              {item.difficulty}
                            </Badge>
                          </div>

                          {/* Progress Bar */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2 text-sm">
                              <span className="text-gray-600">Độ chính xác</span>
                              <span className="text-gray-900">{accuracy}%</span>
                            </div>
                            <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                              {/* Correct portion */}
                              <motion.div
                                className="absolute inset-y-0 left-0"
                                style={{ backgroundColor: item.color }}
                                initial={{ width: 0 }}
                                animate={{ width: `${accuracy}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                              />
                              {/* Separator line */}
                              <div className="absolute inset-y-0 left-0 right-0 flex">
                                {Array.from({ length: 10 }).map((_, i) => (
                                  <div key={i} className="flex-1 border-r border-white/30" />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="text-center">
                              <p className="text-green-600">{item.correct}</p>
                              <p className="text-xs text-gray-500">đúng</p>
                            </div>
                            <div className="w-px h-8 bg-gray-300" />
                            <div className="text-center">
                              <p className="text-red-600">{item.incorrect}</p>
                              <p className="text-xs text-gray-500">sai</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* AI Insight with Actionable Buttons - REDESIGNED */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-rose-50 via-pink-50 to-fuchsia-50 border-4 border-rose-300 rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <AlertTriangle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-rose-900 mb-3 flex items-center gap-2 text-lg">
                      💡 <strong>AI Coach Phát Hiện</strong>
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-green-100 border-2 border-green-300 rounded-lg p-3">
                        <p className="text-green-800">
                          <strong>✅ Điểm mạnh:</strong> Bạn làm rất tốt câu <strong>Nhận biết</strong> (96%) 
                          và câu <strong>Dễ</strong> (90%) 🎉
                        </p>
                      </div>
                      <div className="bg-red-100 border-2 border-red-300 rounded-lg p-3">
                        <p className="text-red-800">
                          <strong>⚠️ Cần cải thiện:</strong> Câu <strong>Vận dụng cao</strong> (24%) 
                          và câu <strong>Rất khó</strong> (20%) đang rất yếu!
                        </p>
                      </div>

                      {/* ACTIONABLE BUTTONS - NEW */}
                      <div className="bg-white/80 border-2 border-rose-300 rounded-lg p-4 mt-4">
                        <p className="text-gray-800 mb-3">
                          🎯 <strong>Kế hoạch hành động:</strong> Tập trung luyện câu Khó và Vận dụng cao 
                          trong 1 tuần → Điểm tổng có thể tăng 15-20%!
                        </p>
                        
                        {/* Action Buttons */}
                        <div className="grid grid-cols-3 gap-3">
                          <Button 
                            className="bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-500 hover:to-purple-500 text-white border-0 h-auto py-3 flex flex-col items-center gap-1"
                          >
                            <BookOpen className="w-5 h-5" />
                            <span className="text-xs">Ôn Vận Dụng Cao</span>
                          </Button>
                          
                          <Button 
                            className="bg-gradient-to-r from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500 text-white border-0 h-auto py-3 flex flex-col items-center gap-1"
                          >
                            <Target className="w-5 h-5" />
                            <span className="text-xs">Làm đề Rất Khó</span>
                          </Button>
                          
                          <Button 
                            className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white border-0 h-auto py-3 flex flex-col items-center gap-1"
                          >
                            <Zap className="w-5 h-5" />
                            <span className="text-xs">Xem lại Logarit</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weaknesses Tab */}
        <TabsContent value="weaknesses" className="space-y-6 mt-6">
          <div className="grid gap-4">
            {weakTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{topic.icon}</div>
                          <div>
                            <h3 className="text-gray-900 flex items-center gap-2">
                              {topic.topic}
                              {topic.trend === 'down' && (
                                <Badge className="bg-red-500">
                                  <TrendingDown className="w-3 h-3 mr-1" />
                                  Giảm
                                </Badge>
                              )}
                              {topic.trend === 'up' && (
                                <Badge className="bg-green-500">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  Tăng
                                </Badge>
                              )}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {topic.wrongQuestions}/{topic.totalQuestions} câu sai • Điểm trung bình: {topic.score}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl text-orange-600">{topic.score}</div>
                          <Progress value={topic.score} className="w-20 h-2 mt-1" />
                        </div>
                      </div>

                      {/* Common Errors */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-900 mb-2">
                          <strong>❌ Lỗi thường gặp:</strong>
                        </p>
                        <ul className="space-y-1">
                          {topic.commonErrors.map((error, i) => (
                            <li key={i} className="text-red-700 text-sm flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{error}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Buttons - NO "Show Solution" */}
                      <div className="grid md:grid-cols-3 gap-3 pt-2">
                        <Button 
                          className="bg-gradient-to-r from-cyan-400 to-teal-400 hover:opacity-90"
                          size="sm"
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Ôn Lại Kiến Thức
                        </Button>
                        
                        <Button 
                          className="bg-gradient-to-r from-rose-400 to-pink-400 hover:opacity-90"
                          size="sm"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Luyện Dạng Tương Tự
                        </Button>
                        
                        <Button 
                          className="bg-gradient-to-r from-indigo-400 to-purple-400 hover:opacity-90"
                          size="sm"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Thêm vào Thời Điểm Vàng
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* AI Coach Suggestion */}
          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-2 border-cyan-300">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Mascot emotion="excited" size="medium" />
                <div className="flex-1">
                  <h3 className="text-cyan-900 mb-2">💡 AI Coach Gợi Ý</h3>
                  <p className="text-cyan-700 mb-4">
                    Nếu bạn tập trung ôn lại <strong>Logarit</strong> trong 3 ngày tới với 
                    mỗi ngày 15 phút, điểm số dự kiến tăng từ 65 → 80 điểm!
                  </p>
                  <Button className="bg-gradient-to-r from-cyan-400 to-teal-400 hover:opacity-90">
                    <Target className="w-4 h-4 mr-2" />
                    Bắt Đầu Kế Hoạch 3 Ngày
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-6 mt-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                Tiến Độ Tuần Này
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="week" tick={{ fill: '#475569' }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#475569' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#14b8a6" 
                      strokeWidth={3}
                      dot={{ fill: '#14b8a6', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-4 border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-green-900">Tăng trưởng</span>
                  </div>
                  <p className="text-3xl text-green-600">+20 điểm</p>
                  <p className="text-green-700 text-sm">So với tuần trước</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-900">Điểm cao nhất</span>
                  </div>
                  <p className="text-3xl text-blue-600">85</p>
                  <p className="text-blue-700 text-sm">Chủ nhật vừa rồi</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-900">Mục tiêu</span>
                  </div>
                  <p className="text-3xl text-purple-600">90+</p>
                  <p className="text-purple-700 text-sm">Tuần sau (khả thi!)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
