import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Clock, CheckCircle, XCircle, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestionResult {
  questionId: number;
  correct: boolean;
  timeSpent: number;
}

interface SprintModeProps {
  onComplete: (results: {
    correctCount: number;
    totalQuestions: number;
    totalTime: number;
    questionResults: QuestionResult[];
  }) => void;
  onExit: () => void;
}

const SprintMode: React.FC<SprintModeProps> = ({ onComplete, onExit }) => {
  // Mock questions (15 questions for Sprint)
  const mockQuestions: Question[] = [
    {
      id: 1,
      question: 'Tính đạo hàm của hàm số y = 3x² + 2x - 5',
      options: ['y\' = 6x + 2', 'y\' = 3x + 2', 'y\' = 6x - 5', 'y\' = x² + 2'],
      correctAnswer: 0,
      topic: 'Toán',
      difficulty: 'easy'
    },
    {
      id: 2,
      question: 'Cho tập hợp A = {1, 2, 3}. Số tập con của A là:',
      options: ['6', '7', '8', '9'],
      correctAnswer: 2,
      topic: 'Toán',
      difficulty: 'easy'
    },
    {
      id: 3,
      question: 'Giá trị của log₂(8) bằng:',
      options: ['2', '3', '4', '8'],
      correctAnswer: 1,
      topic: 'Toán',
      difficulty: 'medium'
    },
    {
      id: 4,
      question: 'Phương trình x² - 5x + 6 = 0 có nghiệm:',
      options: ['x = 1; x = 6', 'x = 2; x = 3', 'x = -2; x = -3', 'x = 1; x = 5'],
      correctAnswer: 1,
      topic: 'Toán',
      difficulty: 'easy'
    },
    {
      id: 5,
      question: 'Trong dao động điều hòa, biên độ dao động là:',
      options: ['Quãng đường vật đi được trong 1 chu kì', 'Li độ cực đại của vật', 'Tốc độ cực đại của vật', 'Gia tốc cực đại của vật'],
      correctAnswer: 1,
      topic: 'Vật Lý',
      difficulty: 'easy'
    },
    {
      id: 6,
      question: 'Công thức tính động năng của vật là:',
      options: ['Wđ = mgh', 'Wđ = ½mv²', 'Wđ = Fs', 'Wđ = ma'],
      correctAnswer: 1,
      topic: 'Vật Lý',
      difficulty: 'easy'
    },
    {
      id: 7,
      question: 'Nguyên tử của nguyên tố X có 17 proton. X thuộc nhóm:',
      options: ['IA', 'VIIA', 'VIA', 'VA'],
      correctAnswer: 1,
      topic: 'Hóa Học',
      difficulty: 'medium'
    },
    {
      id: 8,
      question: 'Tích phân ∫x dx từ 0 đến 2 bằng:',
      options: ['1', '2', '3', '4'],
      correctAnswer: 1,
      topic: 'Toán',
      difficulty: 'medium'
    },
    {
      id: 9,
      question: 'Sin²α + Cos²α bằng:',
      options: ['0', '1', '2', 'α'],
      correctAnswer: 1,
      topic: 'Toán',
      difficulty: 'easy'
    },
    {
      id: 10,
      question: 'Vận tốc ánh sáng trong chân không xấp xỉ:',
      options: ['3×10⁶ m/s', '3×10⁷ m/s', '3×10⁸ m/s', '3×10⁹ m/s'],
      correctAnswer: 2,
      topic: 'Vật Lý',
      difficulty: 'easy'
    },
    {
      id: 11,
      question: 'Giới hạn lim(x→∞) (2x+1)/(x-3) bằng:',
      options: ['0', '1', '2', '∞'],
      correctAnswer: 2,
      topic: 'Toán',
      difficulty: 'medium'
    },
    {
      id: 12,
      question: 'Kim loại kiềm nào sau đây hoạt động mạnh nhất?',
      options: ['Li', 'Na', 'K', 'Cs'],
      correctAnswer: 3,
      topic: 'Hóa Học',
      difficulty: 'medium'
    },
    {
      id: 13,
      question: 'Hàm số y = x³ đồng biến trên khoảng nào?',
      options: ['(-∞, 0)', '(0, +∞)', '(-∞, +∞)', 'Không có'],
      correctAnswer: 2,
      topic: 'Toán',
      difficulty: 'medium'
    },
    {
      id: 14,
      question: 'Chu kì dao động là:',
      options: ['Thời gian để vật thực hiện 1 dao động toàn phần', 'Số dao động thực hiện trong 1 giây', 'Quãng đường vật đi được', 'Li độ cực đại'],
      correctAnswer: 0,
      topic: 'Vật Lý',
      difficulty: 'easy'
    },
    {
      id: 15,
      question: 'Hợp chất nào sau đây là axit?',
      options: ['NaOH', 'HCl', 'NaCl', 'Ca(OH)₂'],
      correctAnswer: 1,
      topic: 'Hóa Học',
      difficulty: 'easy'
    }
  ];

  const [questions] = useState<Question[]>(mockQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [correctCount, setCorrectCount] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer color based on time left
  const getTimerColor = () => {
    if (timeLeft > 9 * 60) return 'text-cyan-400'; // > 9 min
    if (timeLeft > 3 * 60) return 'text-orange-400'; // > 3 min
    return 'text-red-400'; // < 3 min
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const result: QuestionResult = {
      questionId: currentQuestion.id,
      correct: isCorrect,
      timeSpent
    };

    setQuestionResults([...questionResults, result]);
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    }

    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    const totalTime = 15 * 60 - timeLeft;
    onComplete({
      correctCount,
      totalQuestions: questions.length,
      totalTime,
      questionResults
    });
  };

  const handleAutoSubmit = () => {
    // Auto-submit when timer runs out
    const totalTime = 15 * 60;
    onComplete({
      correctCount,
      totalQuestions: questions.length,
      totalTime,
      questionResults
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'hard': return 'bg-red-500/20 text-red-300';
      default: return 'bg-slate-500/20 text-slate-300';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Dễ';
      case 'medium': return 'Trung bình';
      case 'hard': return 'Khó';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950 p-4">
      <div className="max-w-3xl mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white">⚡ Sprint Mode</h2>
              <p className="text-cyan-300 text-sm">
                Câu {currentQuestionIndex + 1}/{questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400">{correctCount}</span>
            </div>
            <div className={`flex items-center gap-2 ${getTimerColor()}`}>
              <Clock className="w-5 h-5" />
              <span className="text-xl">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-8 h-2" />

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-slate-900/50 border-2 border-cyan-500/20">
              <CardContent className="p-6">
                {/* Topic & Difficulty */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-sm">
                    {currentQuestion.topic}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(currentQuestion.difficulty)}`}>
                    {getDifficultyText(currentQuestion.difficulty)}
                  </span>
                </div>

                {/* Question */}
                <h3 className="text-white mb-6 text-lg">
                  {currentQuestion.question}
                </h3>

                {/* Options */}
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const showCorrect = showFeedback && isCorrect;
                    const showWrong = showFeedback && isSelected && !isCorrect;

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={showFeedback}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          showCorrect
                            ? 'bg-green-500/20 border-green-500 text-green-300'
                            : showWrong
                            ? 'bg-red-500/20 border-red-500 text-red-300'
                            : isSelected
                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-cyan-500/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{option}</span>
                          {showCorrect && <CheckCircle className="w-5 h-5 text-green-400" />}
                          {showWrong && <XCircle className="w-5 h-5 text-red-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg mb-4 ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? 'bg-green-500/20 border-2 border-green-500/30'
                        : 'bg-red-500/20 border-2 border-red-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-green-300">✅ Chính xác! Tuyệt vời! 🎉</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-400" />
                          <span className="text-red-300">
                            ❌ Chưa đúng. Đáp án đúng là: {String.fromCharCode(65 + currentQuestion.correctAnswer)}
                          </span>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Action Button */}
                {!showFeedback ? (
                  <Button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xác nhận đáp án
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextQuestion}
                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white"
                  >
                    {currentQuestionIndex < questions.length - 1 ? (
                      <>
                        Câu tiếp theo
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    ) : (
                      'Xem kết quả 🎯'
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Stats */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm">Đúng: {correctCount}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm">Sai: {questionResults.filter(r => !r.correct).length}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm">Còn lại: {questions.length - (currentQuestionIndex + 1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintMode;
