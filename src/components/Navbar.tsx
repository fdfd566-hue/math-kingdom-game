import React, { useState } from 'react';
import { Volume2, VolumeX, User, Trophy, BookOpen, Shield, LogOut } from 'lucide-react';
import { StudentRecord } from '../types';
import { sounds } from '../utils/audio';
import { toArabic } from '../utils/arabicNumbers';

interface NavbarProps {
  currentStudent: StudentRecord | null;
  activeTab: 'game' | 'leaderboard' | 'teacher' | 'lesson-select';
  onChangeTab: (tab: 'game' | 'leaderboard' | 'teacher' | 'lesson-select') => void;
  onChangeName: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStudent,
  activeTab,
  onChangeTab,
  onChangeName,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(sounds.enabled);

  const handleToggleSound = () => {
    const next = sounds.toggleSound();
    setSoundEnabled(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-pink-200 shadow-sm transition-all">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5">
        
        {/* Kingdom Logo & Title */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <button
            onClick={() => {
              sounds.playClick();
              onChangeTab('game');
            }}
            className="flex items-center gap-2 text-right group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-purple-500 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
              👑
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-black text-lg sm:text-xl text-pink-700 leading-tight">
                <span>🌸 مملكة الرياضيات 🌸</span>
              </div>
              <p className="text-[11px] font-bold text-purple-700">
                إعداد المعلمة: أ. فداء التميمي
              </p>
            </div>
          </button>

          {/* Mobile Sound & Change Name shortcut */}
          <div className="flex items-center gap-1 sm:hidden">
            <button
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 transition-all cursor-pointer"
              title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>
            {currentStudent && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onChangeName();
                }}
                className="p-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-all cursor-pointer"
                title="تغيير الاسم"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-pink-100/60 p-1 rounded-2xl border border-pink-200 max-w-full overflow-x-auto">
          <button
            onClick={() => {
              sounds.playClick();
              onChangeTab('game');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'game' || activeTab === 'lesson-select'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                : 'text-pink-900 hover:bg-white/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>اللعب والدروس</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onChangeTab('leaderboard');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                : 'text-purple-900 hover:bg-white/60'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>لوحة الصدارة 🏆</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onChangeTab('teacher');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'teacher'
                ? 'bg-gradient-to-r from-slate-700 to-purple-800 text-white shadow-md'
                : 'text-slate-700 hover:bg-white/60'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>المعلمة 👩‍🏫</span>
          </button>
        </nav>

        {/* Right side: Student Status & Sound (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          {currentStudent && (
            <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-purple-50 px-3 py-1.5 rounded-2xl border border-pink-200">
              <div className="w-7 h-7 rounded-full bg-pink-400 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <User className="w-4 h-4" />
              </div>
              <div className="text-right leading-tight">
                <p className="text-xs font-black text-pink-900">
                  {currentStudent.name} 👑
                </p>
                <p className="text-[10px] font-bold text-purple-600">
                  {toArabic(currentStudent.totalScore)} نقطة ⭐
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playClick();
                  onChangeName();
                }}
                className="mr-1 text-[11px] font-semibold text-rose-500 hover:text-rose-700 hover:underline cursor-pointer bg-white px-2 py-0.5 rounded-lg border border-pink-200"
                title="تغيير اسم الطالبة"
              >
                تغيير
              </button>
            </div>
          )}

          <button
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 transition-all cursor-pointer"
            title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
          </button>
        </div>

      </div>
    </header>
  );
};
