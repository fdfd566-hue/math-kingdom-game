import React, { useEffect, useState } from 'react';
import { getAllStudents } from '../utils/storage';
import { StudentRecord } from '../types';
import { toArabic } from '../utils/arabicNumbers';
import { sounds } from '../utils/audio';
import { Play, Search } from 'lucide-react';

interface LeaderboardProps {
  currentStudent: StudentRecord | null;
  onPlayClick: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  currentStudent,
  onPlayClick,
}) => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = () => {
    const list = getAllStudents();
    // Sort descending by total score, then by questions answered
    const sorted = [...list].sort((a, b) => b.totalScore - a.totalScore || b.questionsAnswered - a.questionsAnswered);
    setStudents(sorted);
  };

  useEffect(() => {
    loadData();

    // Listen for storage changes or broadcast channel
    const handler = () => loadData();
    window.addEventListener('storage', handler);

    let channel: BroadcastChannel | null = null;
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      channel = new BroadcastChannel('math_kingdom_channel');
      channel.onmessage = () => loadData();
    }

    return () => {
      window.removeEventListener('storage', handler);
      if (channel) channel.close();
    };
  }, []);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 text-white flex items-center justify-center font-black text-sm shadow-md">
          🥇
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-300 to-gray-400 text-white flex items-center justify-center font-black text-sm shadow-md">
          🥈
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-black text-sm shadow-md">
          🥉
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-800 flex items-center justify-center font-black text-sm">
        {toArabic(rank)}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-pink-200 text-center relative overflow-hidden">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner mb-3">
          🏆
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-black">
          لوحة الصدارة وشرف الرياضيات
        </h2>
        
        <p className="text-pink-100 text-xs sm:text-sm font-bold mt-1">
          بطلات الصف السادس الابتدائي - إشراف المعلمة: أ. فداء التميمي
        </p>
      </div>

      {/* Top 3 Podium (if at least 3 students exist) */}
      {students.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2 px-2">
          
          {/* 2nd Place */}
          <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-3xl border-2 border-slate-200 shadow-md text-center flex flex-col items-center order-1 transform translate-y-2">
            <span className="text-2xl mb-1">🥈</span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-black text-sm sm:text-base shadow-inner mb-1.5">
              ٢
            </div>
            <h4 className="font-black text-xs sm:text-sm text-slate-800 line-clamp-1">
              {students[1]?.name}
            </h4>
            <p className="text-[11px] sm:text-xs font-bold text-purple-600 mt-0.5">
              {toArabic(students[1]?.totalScore)} ⭐
            </p>
          </div>

          {/* 1st Place (Center & Taller) */}
          <div className="bg-gradient-to-b from-amber-50 to-yellow-100 p-4 sm:p-5 rounded-3xl border-2 border-amber-300 shadow-lg text-center flex flex-col items-center order-2 transform -translate-y-2 relative">
            <div className="absolute -top-3 text-2xl animate-bounce">👑</div>
            <span className="text-3xl mb-1 mt-1">🥇</span>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-400 text-white flex items-center justify-center font-black text-base sm:text-lg shadow-md mb-1.5">
              ١
            </div>
            <h4 className="font-black text-sm sm:text-base text-amber-950 line-clamp-1">
              {students[0]?.name}
            </h4>
            <p className="text-xs sm:text-sm font-black text-amber-800 mt-0.5">
              {toArabic(students[0]?.totalScore)} ⭐
            </p>
          </div>

          {/* 3rd Place */}
          <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-4 rounded-3xl border-2 border-orange-200 shadow-md text-center flex flex-col items-center order-3 transform translate-y-3">
            <span className="text-2xl mb-1">🥉</span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-black text-sm sm:text-base shadow-inner mb-1.5">
              ٣
            </div>
            <h4 className="font-black text-xs sm:text-sm text-slate-800 line-clamp-1">
              {students[2]?.name}
            </h4>
            <p className="text-[11px] sm:text-xs font-bold text-purple-600 mt-0.5">
              {toArabic(students[2]?.totalScore)} ⭐
            </p>
          </div>

        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحثي عن اسم طالبة..."
          className="w-full px-4 py-3 pr-10 rounded-2xl bg-white border-2 border-pink-200 focus:border-pink-500 text-right font-bold text-sm outline-none shadow-sm placeholder-gray-400"
        />
        <Search className="w-4 h-4 text-pink-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Main Leaderboard Table / Cards */}
      <div className="bg-white rounded-3xl border-2 border-pink-200 shadow-lg overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 p-4 bg-pink-100/60 font-black text-xs sm:text-sm text-pink-900 border-b border-pink-200 text-right">
          <div className="col-span-2 text-center">الترتيب</div>
          <div className="col-span-6 pr-2">اسم الطالبة</div>
          <div className="col-span-4 text-left pl-2">مجموع النقاط</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-pink-100">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-bold text-sm">
              لا توجد نتائج مطابقة للاسم
            </div>
          ) : (
            filteredStudents.map((student, idx) => {
              const rank = idx + 1;
              const isCurrent = currentStudent && (student.id === currentStudent.id || student.name === currentStudent.name);

              return (
                <div
                  key={student.id || idx}
                  className={`grid grid-cols-12 gap-2 p-3.5 sm:p-4 items-center text-right transition-colors ${
                    isCurrent
                      ? 'bg-pink-100/80 border-r-4 border-r-pink-500 font-black'
                      : 'hover:bg-pink-50/40'
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-2 flex justify-center">
                    {getRankBadge(rank)}
                  </div>

                  {/* Student Name */}
                  <div className="col-span-6 pr-2 flex items-center gap-2">
                    <span className="font-bold text-sm sm:text-base text-slate-800">
                      {student.name}
                    </span>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-black">
                        أنتِ 🌸
                      </span>
                    )}
                  </div>

                  {/* Points */}
                  <div className="col-span-4 text-left pl-2">
                    <span className="inline-flex items-center gap-1 font-black text-sm sm:text-base text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-100">
                      <span>{toArabic(student.totalScore)}</span>
                      <span>⭐</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Floating CTA */}
      <div className="text-center pt-2">
        <button
          onClick={() => {
            sounds.playClick();
            onPlayClick();
          }}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-black text-base shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>ابدئي اللعب واكسبي النقاط 🌸</span>
        </button>
      </div>

    </div>
  );
};
