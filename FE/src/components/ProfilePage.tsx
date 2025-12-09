import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  User, Mail, Calendar, Trophy, Flame, Target, TrendingUp, 
  Award, Star, BookOpen, Clock, Edit, Settings 
} from 'lucide-react';
import { motion } from 'motion/react';

const userProfile = {
  name: 'Nguyễn Văn Minh',
  email: 'minh.nguyen@example.com',
  avatar: '',
  joinDate: '15/08/2024',
  level: 8,
  xp: 2450,
  nextLevelXp: 3000,
  streak: 12,
  totalStudyDays: 45,
  totalTests: 127,
  totalQuestions: 3240,
  accuracy: 78,
};

const badges = [
  { id: 1, name: 'Chiến binh 7 ngày', icon: '🔥', unlocked: true, date: '25/10/2024' },
  { id: 2, name: 'Bậc thầy Logarit', icon: '🔢', unlocked: true, date: '20/10/2024' },
  { id: 3, name: 'Tốc độ ánh sáng', icon: '⚡', unlocked: true, date: '18/10/2024' },
  { id: 4, name: 'Người chinh phục', icon: '🏆', unlocked: false },
  { id: 5, name: 'Hoàn hảo', icon: '🎯', unlocked: false },
  { id: 6, name: 'Huyền thoại', icon: '👑', unlocked: false },
];

const stats = [
  { label: 'Tổng số ngày học', value: userProfile.totalStudyDays, icon: Calendar, color: 'from-blue-500 to-cyan-500' },
  { label: 'Chuỗi học tập', value: `${userProfile.streak} ngày`, icon: Flame, color: 'from-orange-500 to-red-500' },
  { label: 'Bài kiểm tra', value: userProfile.totalTests, icon: BookOpen, color: 'from-purple-500 to-pink-500' },
  { label: 'Câu hỏi đã làm', value: userProfile.totalQuestions.toLocaleString(), icon: Target, color: 'from-green-500 to-teal-500' },
  { label: 'Độ chính xác', value: `${userProfile.accuracy}%`, icon: TrendingUp, color: 'from-indigo-500 to-purple-500' },
  { label: 'Huy hiệu', value: `${badges.filter(b => b.unlocked).length}/${badges.length}`, icon: Award, color: 'from-yellow-500 to-orange-500' },
];

export function ProfilePage() {
  const xpProgress = (userProfile.xp / userProfile.nextLevelXp) * 100;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white border-0 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                  <AvatarFallback className="bg-gradient-to-br from-teal-400 to-cyan-500 text-white text-4xl">
                    {userProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-white text-purple-600 hover:bg-white/90"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-white text-3xl mb-2">{userProfile.name}</h2>
                  <div className="flex items-center gap-4 text-white/90 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{userProfile.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Tham gia: {userProfile.joinDate}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="bg-white/20 border-white text-white hover:bg-white/30">
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt
                </Button>
              </div>

              {/* Level Progress */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Star className="w-6 h-6 text-yellow-300" />
                    <div>
                      <p className="text-white text-lg">Level {userProfile.level}</p>
                      <p className="text-white/70 text-sm">{userProfile.xp} / {userProfile.nextLevelXp} XP</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-400 text-yellow-900">
                    {userProfile.nextLevelXp - userProfile.xp} XP nữa lên cấp!
                  </Badge>
                </div>
                <Progress value={xpProgress} className="h-3 bg-white/20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-gray-900 text-2xl">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Badges Section */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Huy Hiệu & Thành Tích
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: badge.unlocked ? 1.05 : 1 }}
              >
                <Card className={`${
                  badge.unlocked 
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300' 
                    : 'bg-gray-100 opacity-60'
                }`}>
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className="text-5xl mb-3"
                      animate={badge.unlocked ? { rotate: [0, 10, -10, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {badge.unlocked ? badge.icon : '🔒'}
                    </motion.div>
                    <h4 className={`mb-1 ${badge.unlocked ? 'text-gray-900' : 'text-gray-600'}`}>
                      {badge.name}
                    </h4>
                    {badge.unlocked ? (
                      <p className="text-xs text-gray-600">Đạt được: {badge.date}</p>
                    ) : (
                      <p className="text-xs text-gray-500">Chưa mở khóa</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study History */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-500" />
            Lịch Sử Học Tập Gần Đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: 'Hôm nay', activity: 'Hoàn thành Sprint 15 phút - Logarit', xp: 50, time: '14:30' },
              { date: 'Hôm qua', activity: 'Đánh bại Boss Hàm Số', xp: 100, time: '16:45' },
              { date: '2 ngày trước', activity: 'Luyện tập 20 câu Sóng cơ', xp: 40, time: '10:20' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200"
              >
                <div className="flex-1">
                  <p className="text-gray-900 mb-1">{item.activity}</p>
                  <p className="text-sm text-gray-600">{item.date} • {item.time}</p>
                </div>
                <Badge className="bg-purple-500">+{item.xp} XP</Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
