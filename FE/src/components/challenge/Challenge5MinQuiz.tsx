import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Clock, CheckCircle, XCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Challenge5MinQuizProps {
  onComplete: (results: QuizResults) => void;
}

export interface QuizResults {
  correctCount: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  answers: {
    questionId: number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
}

// Mock questions - in production, fetch from API
const mockQuestions: Question[] = [
  {
    id: 1,
    question: 'Tính đạo hàm của hàm số y = 3x² + 2x - 5',
    options: ['6x + 2', '3x + 2', '6x - 5', 'x² + 2'],
    correctAnswer: 0,
    topic: 'Toán',
    difficulty: 'easy',
  },
  {
    id: 2,
    question: 'Công thức tính lực hấp dẫn giữa hai vật là:',
    options: ['F = ma', 'F = G(m₁m₂)/r²', 'F = kx', 'F = qE'],
    correctAnswer: 1,
    topic: 'Vật Lý',
    difficulty: 'medium',
  },
  {
    id: 3,
    question: 'Giá trị của log₂(16) bằng:',
    options: ['2', '3', '4', '8'],
    correctAnswer: 2,
    topic: 'Toán',
    difficulty: 'easy',
  },
  {
    id: 4,
    question: 'Phản ứng nào sau đây là phản ứng oxi hóa - khử?',
    options: [
      'NaOH + HCl → NaCl + H₂O',
      'Zn + 2HCl → ZnCl₂ + H₂',
      'AgNO₃ + NaCl → AgCl + NaNO₃',
      'CaCO₃ → CaO + CO₂',
    ],
    correctAnswer: 1,
    topic: 'Hóa Học',
    difficulty: 'medium',
  },
  {
    id: 5,
    question: 'Giới hạn lim(x→0) (sin x)/x bằng:',
    options: ['0', '1', '∞', 'Không tồn tại'],
    correctAnswer: 1,
    topic: 'Toán',
    difficulty: 'hard',
  },
];

export function Challenge5MinQuiz({ onComplete }: Challenge5MinQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes = 300 seconds
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [answers, setAnswers] = useState<QuizResults['answers']>([]);
  const [quizStartTime] = useState(Date.now());

  const currentQuestion = mockQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === mockQuestions.length - 1;
  const correctCount = answers.filter((a) => a.isCorrect).length;

  // Timer countdown
  useEffect(() => {
    if (timeRemaining <= 0) {
      // Time's up - auto submit
      handleComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining > 180) return 'text-teal-600'; // > 3 min
    if (timeRemaining > 60) return 'text-orange-600'; // > 1 min
    return 'text-red-600'; // < 1 min
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowFeedback(true);

    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    setAnswers((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        isCorrect,
        timeSpent,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      handleComplete();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowFeedback(false);
      setQuestionStartTime(Date.now());
    }
  };

  const handleComplete = () => {
    const totalTimeSpent = Math.floor((Date.now() - quizStartTime) / 1000);
    onComplete({
      correctCount,
      totalQuestions: mockQuestions.length,
      timeSpent: totalTimeSpent,
      answers,
    });
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const progressPercentage = ((currentQuestionIndex + 1) / mockQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-yellow-50 p-4 pt-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with Timer */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm border-2 border-teal-200 rounded-xl p-4 mb-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <span className="text-gray-700">Challenge 5 Phút</span>
            </div>
            <div className={`flex items-center gap-2 ${getTimerColor()}`}>
              <Clock className="w-5 h-5" />
              <span className="text-xl">{formatTime(timeRemaining)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Câu {currentQuestionIndex + 1}/{mockQuestions.length}</span>
              <span>{correctCount} đúng</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-orange-200 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm px-3 py-1 bg-teal-100 text-teal-700 rounded-full">
                    {currentQuestion.topic}
                  </span>
                  <span className="text-sm px-3 py-1 bg-orange-100 text-orange-700 rounded-full capitalize">
                    {currentQuestion.difficulty === 'easy' && 'Dễ'}
                    {currentQuestion.difficulty === 'medium' && 'Trung bình'}
                    {currentQuestion.difficulty === 'hard' && 'Khó'}
                  </span>
                </div>
                <h2 className="text-xl text-gray-800">{currentQuestion.question}</h2>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === index;
                    const isCorrectAnswer = index === currentQuestion.correctAnswer;
                    const showCorrect = showFeedback && isCorrectAnswer;
                    const showWrong = showFeedback && isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={index}
                        whileHover={{ scale: isAnswered ? 1 : 1.02 }}
                        whileTap={{ scale: isAnswered ? 1 : 0.98 }}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={isAnswered}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          showCorrect
                            ? 'border-green-400 bg-green-50'
                            : showWrong
                            ? 'border-red-400 bg-red-50'
                            : isSelected
                            ? 'border-orange-400 bg-orange-50'
                            : 'border-gray-300 bg-white hover:border-orange-300 hover:bg-orange-50'
                        } ${isAnswered ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-800">{option}</span>
                          {showCorrect && <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />}
                          {showWrong && <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Feedback */}
                <AnimatePresence>
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Alert
                        className={`border-2 ${
                          isCorrect
                            ? 'border-green-300 bg-green-50'
                            : 'border-red-300 bg-red-50'
                        }`}
                      >
                        <AlertDescription>
                          {isCorrect ? (
                            <div className="flex items-center gap-2 text-green-700">
                              <CheckCircle className="w-5 h-5" />
                              <strong>Chính xác! Tuyệt vời! 🎉</strong>
                            </div>
                          ) : (
                            <div className="text-red-700">
                              <div className="flex items-center gap-2 mb-1">
                                <XCircle className="w-5 h-5" />
                                <strong>Chưa đúng rồi!</strong>
                              </div>
                              <p className="text-sm">
                                Đáp án đúng là: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
                              </p>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>

                      <Button
                        onClick={handleNextQuestion}
                        className="w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                      >
                        {isLastQuestion ? 'Xem Kết Quả 🏆' : 'Câu Tiếp Theo →'}
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          <div className="bg-white/60 backdrop-blur-sm border-2 border-green-200 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600 mb-1">Đúng</p>
            <p className="text-2xl text-green-600">{correctCount}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border-2 border-red-200 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600 mb-1">Sai</p>
            <p className="text-2xl text-red-600">{answers.length - correctCount}</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border-2 border-orange-200 rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600 mb-1">Còn lại</p>
            <p className="text-2xl text-orange-600">{mockQuestions.length - answers.length}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
