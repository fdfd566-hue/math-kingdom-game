import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Question, StudentRecord } from '../types';
import { LESSONS } from '../data/curriculumQuestions';
import { VisualChart } from './VisualChart';
import { toArabic } from '../utils/arabicNumbers';
import { sounds } from '../utils/audio';
import { recordAnswerResult } from '../utils/storage';
import { Sparkles, ArrowLeft, ArrowRight, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';

interface GameScreenProps {
  questions: Question[];
  currentStudent: StudentRecord;
  onFinishGame: (sessionResults: { total: number; correct: number; earnedScore: number }) => void;
  onBackToLessons: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  questions,
  currentStudent,
  onFinishGame,
  onBackToLessons,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionCorrectCount, setSessionCorrectCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = questions[currentIndex];
  const currentLesson = LESSONS.find((l) => l.id === currentQuestion?.lessonId);
  const isLastQuestion = currentIndex === questions.length - 1;

  // Option labels in Arabic
  const optionLetters = ['أ', 'ب', 'ج', 'د'];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return; // Prevent changing after answer
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQuestion.correctIndex;
    const pointsToAdd = isCorrect ? 10 : 0;

    if (isCorrect) {
      sounds.playCorrect();
      setSessionScore((prev) => prev + pointsToAdd);
      setSessionCorrectCount((prev) => prev + 1);

      // Trigger celebratory confetti
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ec4899', '#a855f7', '#fb7185', '#38bdf8', '#fbbf24'],
      });
    } else {
      sounds.playWrong();
    }

    // Save to database/storage immediately
    recordAnswerResult(isCorrect, pointsToAdd, currentQuestion.lessonId);
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (isLastQuestion) {
      sounds.playVictory();
      onFinishGame({
        total: questions.length,
        correct: sessionCorrectCount,
        earnedScore: sessionScore,
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    }
  };

  if (!currentQuestion) {
    return null;
  }

  const isCorrectChoice = selectedOption === currentQuestion.correctIndex;

  return (
    <div className="max-w-2xl mx-auto space-y-4 animate-fadeIn pb-12">
      
      {/* Top Header Card: Lesson Info, Question Counter, Score Badge */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border-2 border-pink-200 shadow-md flex items-center justify-between gap-2">
        <button
          onClick={() => {
            sounds.playClick();
            onBackToLessons();
          }}
          className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-800 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl border border-pink-200 transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4 ml-0.5" />
          <span>الدروس</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-pink-500 block">
            {currentLesson?.title || 'مملكة الرياضيات'}
          </span>
          <span className="text-sm font-black text-slate-800">
            السؤال {toArabic(currentIndex + 1)} من {toArabic(questions.length)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3.5 py-1.5 rounded-2xl shadow-sm">
          <span className="text-sm">⭐</span>
          <span className="text-xs sm:text-sm font-black">
            {toArabic(currentStudent.totalScore + sessionScore)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-pink-100 h-2.5 rounded-full overflow-hidden border border-pink-200">
        <div
          className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-pink-200 shadow-lg text-right relative overflow-hidden">
        
        {/* Crown sticker */}
        <div className="absolute top-4 left-4 text-pink-200 text-xl select-none">👑</div>

        {/* Question Text */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center flex-wrap gap-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold text-pink-700">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>السؤال {toArabic(currentIndex + 1)}</span>
            </div>

            {currentQuestion.source === 'test-file' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-700">
                📌 من ملف اختبار المعلمة
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-relaxed">
            {currentQuestion.questionText}
          </h3>
        </div>

        {/* Visual Chart Graphic if available */}
        {currentQuestion.visualData && (
          <div className="my-4">
            <VisualChart data={currentQuestion.visualData} />
          </div>
        )}

        {/* Hint button (if provided) */}
        {currentQuestion.hint && !isAnswered && (
          <div className="mb-4">
            {!showHint ? (
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowHint(true);
                }}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>تلميح للمساعدة 💡</span>
              </button>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs font-bold text-amber-900 animate-fadeIn">
                💡 {currentQuestion.hint}
              </div>
            )}
          </div>
        )}

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {currentQuestion.options.map((option, idx) => {
            let optionStyles = 'bg-pink-50/50 hover:bg-pink-100/70 border-pink-200 text-slate-800 hover:border-pink-300';
            let badgeStyles = 'bg-pink-200 text-pink-800';

            if (isAnswered) {
              if (idx === currentQuestion.correctIndex) {
                // Correct answer (Green highlight)
                optionStyles = 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-md ring-2 ring-emerald-300';
                badgeStyles = 'bg-emerald-500 text-white';
              } else if (idx === selectedOption) {
                // Wrong selected answer (Red highlight)
                optionStyles = 'bg-rose-50 border-rose-400 text-rose-900 shadow-sm ring-2 ring-rose-200';
                badgeStyles = 'bg-rose-500 text-white';
              } else {
                // Other options disabled
                optionStyles = 'bg-gray-50 border-gray-200 text-gray-400 opacity-60';
                badgeStyles = 'bg-gray-200 text-gray-500';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full p-4 rounded-2xl border-2 font-bold text-base sm:text-lg text-right flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer ${optionStyles} ${
                  !isAnswered ? 'hover:-translate-y-0.5 active:translate-y-0' : 'cursor-default'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${badgeStyles}`}>
                    {optionLetters[idx]}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswered && idx === currentQuestion.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Banner after answering */}
        {isAnswered && (
          <div className="mt-6 pt-4 border-t-2 border-pink-100 animate-fadeIn space-y-4">
            {isCorrectChoice ? (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-4 text-right flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white text-2xl flex items-center justify-center shadow-md shrink-0">
                  ⭐
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-emerald-800">
                    أحسنتِ يا بطلة! ⭐
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-emerald-700 mt-0.5">
                    إجابة صحيحة ورائعة، حصلتِ على ١٠ نقاط إضافية! 🌸
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-300 rounded-2xl p-4 text-right flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white text-2xl flex items-center justify-center shadow-md shrink-0">
                  💗
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-rose-800">
                    حاولي مرة أخرى يا نجمة الرياضيات 💗
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-rose-700 mt-0.5">
                    لا بأس يا ذكية، التعلم من الخطأ سر التفوق!
                  </p>
                </div>
              </div>
            )}

            {/* Explanation box */}
            {currentQuestion.explanation && (
              <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-3.5 text-right">
                <span className="text-xs font-black text-purple-900 block mb-1">
                  💡 الشرح والتوضيح:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-purple-800 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Next Question Button (explicitly shown after answering, no auto skip) */}
            <div className="pt-2">
              <button
                onClick={handleNextQuestion}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-black text-lg sm:text-xl shadow-lg shadow-pink-300/60 hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isLastQuestion ? 'عرض النتيجة النهائية 🏆' : 'السؤال التالي'}</span>
                <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
