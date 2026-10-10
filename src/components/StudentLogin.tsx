import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Star } from 'lucide-react';
import { loginStudent } from '../utils/storage';
import { StudentRecord } from '../types';
import { sounds } from '../utils/audio';

interface StudentLoginProps {
  onLoginSuccess: (student: StudentRecord) => void;
  onOpenTeacher: () => void;
  onOpenLeaderboard: () => void;
}

export const StudentLogin: React.FC<StudentLoginProps> = ({
  onLoginSuccess,
  onOpenTeacher,
  onOpenLeaderboard,
}) => {
  const [studentName, setStudentName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setError('من فضلكِ اكتبي اسمكِ الجميل يا بطلة 🌸');
      return;
    }
    sounds.playCorrect();
    const student = loginStudent(studentName.trim());
    onLoginSuccess(student);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-pink-100 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Decorative floating background elements */}
      <div className="absolute top-6 left-6 text-pink-300 animate-bounce text-2xl select-none pointer-events-none">⭐</div>
      <div className="absolute top-16 right-10 text-purple-300 animate-pulse text-3xl select-none pointer-events-none">🌸</div>
      <div className="absolute bottom-20 left-10 text-rose-300 animate-bounce delay-300 text-3xl select-none pointer-events-none">👑</div>
      <div className="absolute bottom-28 right-8 text-pink-300 animate-pulse text-2xl select-none pointer-events-none">✨</div>

      {/* Top Bar for Teacher & Leaderboard */}
      <header className="w-full max-w-lg flex justify-between items-center z-10 pt-2">
        <button
          onClick={() => {
            sounds.playClick();
            onOpenLeaderboard();
          }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-purple-700 font-bold text-xs sm:text-sm border border-purple-200 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>🏆</span>
          <span>لوحة الصدارة</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenTeacher();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-100/80 hover:bg-pink-100 text-pink-800 font-bold text-xs sm:text-sm border border-pink-200 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>👩‍🏫</span>
          <span>بوابة المعلمة</span>
        </button>
      </header>

      {/* Main Login Card */}
      <main className="w-full max-w-md my-auto z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl shadow-pink-200/60 border-2 border-pink-200 text-center relative">
          
          {/* Top Crown Emblem */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto -mt-16 sm:-mt-20 rounded-full bg-gradient-to-tr from-pink-400 via-rose-400 to-purple-500 p-1.5 shadow-lg flex items-center justify-center transform hover:rotate-6 transition-transform duration-300">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl sm:text-4xl shadow-inner">
              👑
            </div>
          </div>

          {/* Title & Teacher subtitle */}
          <div className="mt-4 mb-6 space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <span>🌸</span>
              <span>مملكة الرياضيات</span>
              <span>🌸</span>
            </h1>
            <p className="text-sm sm:text-base font-bold text-pink-700">
              الصف السادس الابتدائي
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs sm:text-sm font-semibold text-pink-800">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>إعداد المعلمة: أ. فداء التميمي</span>
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            </div>
          </div>

          <div className="bg-purple-50/70 p-3.5 rounded-2xl mb-6 border border-purple-100">
            <p className="text-sm font-bold text-purple-900 flex items-center justify-center gap-1.5">
              <span>مرحبًا بكِ يا أميرة الرياضيات! 👑</span>
            </p>
            <p className="text-xs text-purple-700 mt-1">
              اكتبي اسمكِ لتبدأي مغامرة الرياضيات الممتعة والجميلة
            </p>
          </div>

          {/* Simple Form: Single Name Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-right">
              <label htmlFor="studentName" className="block text-sm font-bold text-gray-700 pr-1">
                اسم الطالبة:
              </label>
              <div className="relative">
                <input
                  id="studentName"
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="اكتبي اسمكِ هنا (مثال: نورة محمد)"
                  maxLength={30}
                  autoFocus
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-pink-300 focus:border-pink-500 focus:ring-4 focus:ring-pink-100 text-right text-base sm:text-lg font-bold text-gray-800 placeholder-pink-300 outline-none transition-all shadow-inner bg-pink-50/30"
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none">
                  <Star className="w-5 h-5 fill-pink-300 text-pink-400" />
                </div>
              </div>
              {error && (
                <p className="text-xs font-bold text-rose-500 pr-1 animate-pulse">
                  {error}
                </p>
              )}
            </div>

            {/* Big Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:via-rose-600 hover:to-purple-700 text-white font-black text-lg sm:text-xl shadow-lg shadow-pink-300/60 hover:shadow-xl hover:shadow-pink-400/70 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ابدئي اللعب</span>
              <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
              <span>🌸</span>
            </button>
          </form>

          {/* Features bullet list */}
          <div className="mt-6 pt-4 border-t border-pink-100 flex items-center justify-around text-xs font-semibold text-gray-500">
            <span className="flex items-center gap-1">
              <span className="text-pink-500">✨</span> ٨ دروس شاملة
            </span>
            <span className="flex items-center gap-1">
              <span className="text-purple-500">🏆</span> لوحة شرف
            </span>
            <span className="flex items-center gap-1">
              <span className="text-rose-500">📜</span> شهادة تفوق
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-3 text-xs font-bold text-pink-700/80 z-10">
        🌸 مملكة الرياضيات - إعداد المعلمة أ. فداء التميمي 🌸
      </footer>
    </div>
  );
};
