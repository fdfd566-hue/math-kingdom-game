import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { StudentRecord } from '../types';
import { toArabic, formatPercentage } from '../utils/arabicNumbers';
import { sounds } from '../utils/audio';
import { Sparkles, Trophy, RotateCcw, BookOpen, Printer } from 'lucide-react';

interface ResultScreenProps {
  currentStudent: StudentRecord;
  sessionResults: {
    total: number;
    correct: number;
    earnedScore: number;
  };
  onPlayAgain: () => void;
  onGoToLeaderboard: () => void;
  onBackToLessons: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  currentStudent,
  sessionResults,
  onPlayAgain,
  onGoToLeaderboard,
  onBackToLessons,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Large celebratory confetti
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
    });
  }, []);

  const percentage = Math.round((sessionResults.correct / (sessionResults.total || 1)) * 100);

  const getEncouragement = () => {
    if (percentage >= 90) {
      return {
        title: '👑 ملكة الرياضيات المتألقة!',
        msg: 'ما شاء الله تبارك الله! إتقان رائع وعلامة مبهرة يا فخر معلمتكِ أ. فداء التميمي ⭐',
      };
    } else if (percentage >= 70) {
      return {
        title: '⭐ أميرة الرياضيات المتميزة!',
        msg: 'أحسنتِ صنعاً وأثبتِ ذكاءكِ وتفوقكِ! واصلي التألق يا بطلة 🌸',
      };
    } else {
      return {
        title: '💗 نجمة الرياضيات الصاعدة!',
        msg: 'جهد جميل ومحاولة رائعة! مع التدريب والممارسة ستصبحين ملكة الرياضيات 👑',
      };
    }
  };

  const encouragement = getEncouragement();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-200 shadow-xl text-center space-y-4">
        
        {/* Crown Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-pink-400 to-purple-500 text-white flex items-center justify-center text-4xl shadow-lg animate-bounce">
          👑
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-pink-700">
            {encouragement.title}
          </h2>
          <p className="text-sm sm:text-base font-bold text-gray-700 mt-1 max-w-md mx-auto leading-relaxed">
            {encouragement.msg}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-pink-50 p-3.5 rounded-2xl border border-pink-200 text-center">
            <span className="text-xs font-bold text-pink-600 block">الإجابات الصحيحة</span>
            <span className="text-xl sm:text-2xl font-black text-pink-800">
              {toArabic(sessionResults.correct)} / {toArabic(sessionResults.total)}
            </span>
          </div>

          <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 text-center">
            <span className="text-xs font-bold text-purple-600 block">نسبة الإتقان</span>
            <span className="text-xl sm:text-2xl font-black text-purple-800">
              {formatPercentage(sessionResults.correct, sessionResults.total)}
            </span>
          </div>

          <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 text-center">
            <span className="text-xs font-bold text-rose-600 block">مجموع النقاط الكلي</span>
            <span className="text-xl sm:text-2xl font-black text-rose-800">
              {toArabic(currentStudent.totalScore)} ⭐
            </span>
          </div>
        </div>

      </div>

      {/* Printable Certificate Card */}
      <div
        ref={certificateRef}
        className="bg-gradient-to-b from-amber-50/70 via-pink-50/50 to-purple-50/60 p-6 sm:p-8 rounded-3xl border-4 border-amber-300 shadow-lg text-center relative print:border-none print:shadow-none"
      >
        <div className="absolute top-3 left-3 text-2xl opacity-40">🌸</div>
        <div className="absolute top-3 right-3 text-2xl opacity-40">🌸</div>
        <div className="absolute bottom-3 left-3 text-2xl opacity-40">⭐</div>
        <div className="absolute bottom-3 right-3 text-2xl opacity-40">⭐</div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>شهادة تميز وتفوق في مملكة الرياضيات</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>

          <p className="text-xs sm:text-sm text-gray-600 font-semibold">
            يسرنا تكريم بطلة الرياضيات المبدعة:
          </p>

          <h3 className="text-2xl sm:text-3xl font-black text-pink-700 py-1 border-b-2 border-dashed border-pink-300 inline-block px-8">
            🌸 {currentStudent.name} 🌸
          </h3>

          <p className="text-xs sm:text-sm text-gray-700 font-bold max-w-lg mx-auto leading-relaxed">
            لاجتيازها اختبارات وتحديات مادة الرياضيات للصف السادس الابتدائي بنجاح وتفوق بمجموع ({toArabic(currentStudent.totalScore)}) نقطة.
          </p>

          <div className="pt-4 flex items-center justify-between border-t border-amber-200 text-xs sm:text-sm font-bold text-gray-700 px-4">
            <div className="text-right">
              <span>المادة: رياضيات الصف السادس</span>
            </div>
            <div className="text-left text-pink-800">
              <span>معلمة المادة: أ. فداء التميمي 👑</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:hidden">
        <button
          onClick={() => {
            sounds.playClick();
            onPlayAgain();
          }}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>العب مرة أخرى</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onGoToLeaderboard();
          }}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Trophy className="w-5 h-5" />
          <span>لوحة الصدارة 🏆</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onBackToLessons();
          }}
          className="w-full py-3 px-5 rounded-2xl bg-white hover:bg-pink-50 text-pink-700 border-2 border-pink-200 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>اختيار درس محدد</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            handlePrint();
          }}
          className="w-full py-3 px-5 rounded-2xl bg-white hover:bg-amber-50 text-amber-700 border-2 border-amber-200 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة الشهادة 📜</span>
        </button>
      </div>

    </div>
  );
};
