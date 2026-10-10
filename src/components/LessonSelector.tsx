import React from 'react';
import { LESSONS } from '../data/curriculumQuestions';
import { StudentRecord } from '../types';
import { Sparkles, Play, CheckCircle2 } from 'lucide-react';
import { toArabic } from '../utils/arabicNumbers';
import { sounds } from '../utils/audio';

interface LessonSelectorProps {
  currentStudent: StudentRecord | null;
  onSelectLesson: (lessonId: number | 'all') => void;
}

export const LessonSelector: React.FC<LessonSelectorProps> = ({
  currentStudent,
  onSelectLesson,
}) => {
  const chapter1Lessons = LESSONS.filter((l) => l.chapter === 1);
  const chapter2Lessons = LESSONS.filter((l) => l.chapter === 2);

  const completed = currentStudent?.completedLessons || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-pink-200 text-right relative overflow-hidden">
        {/* Decorative sparkles */}
        <div className="absolute top-2 left-4 text-3xl opacity-30 select-none">✨</div>
        <div className="absolute bottom-2 left-16 text-4xl opacity-20 select-none">👑</div>

        <div className="max-w-xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs sm:text-sm font-bold">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>مرحبًا بكِ يا بطلة: {currentStudent?.name || 'أميرة الرياضيات'} 🌸</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black">
            اخترتي مغامرتكِ اليوم في مملكة الرياضيات!
          </h2>

          <p className="text-pink-100 text-sm sm:text-base leading-relaxed">
            المنهج الدراسي المعتمد للصف السادس الابتدائي - إعداد المعلمة: أ. فداء التميمي
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <button
              onClick={() => {
                sounds.playClick();
                onSelectLesson('all');
              }}
              className="px-6 py-3 rounded-2xl bg-white text-pink-700 hover:bg-pink-50 font-black text-base shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-pink-600" />
              <span>ابدئي التحدي الشامل (كل الدروس) ⭐</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chapter 1 */}
      <section className="space-y-3 text-right">
        <div className="flex items-center justify-between border-b-2 border-pink-200 pb-2">
          <h3 className="text-lg sm:text-xl font-black text-pink-800 flex items-center gap-2">
            <span>🌸</span>
            <span>الفصل الأول: الجبر والدوال</span>
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-100 text-pink-700">
            ٤ دروس
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {chapter1Lessons.map((lesson) => {
            const isDone = completed.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectLesson(lesson.id);
                }}
                className="bg-white hover:bg-pink-50/50 p-4 rounded-2xl border-2 border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${lesson.color} text-white flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                    {lesson.icon}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-pink-500">
                        الدرس {toArabic(lesson.id)}
                      </span>
                      {isDone && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                      )}
                    </div>
                    <h4 className="font-black text-slate-800 text-base group-hover:text-pink-700 transition-colors">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-pink-100 group-hover:bg-pink-500 text-pink-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chapter 2 */}
      <section className="space-y-3 text-right pt-2">
        <div className="flex items-center justify-between border-b-2 border-purple-200 pb-2">
          <h3 className="text-lg sm:text-xl font-black text-purple-900 flex items-center gap-2">
            <span>📊</span>
            <span>الفصل الثاني: الإحصاء والتمثيلات البيانية</span>
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
            ٤ دروس
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {chapter2Lessons.map((lesson) => {
            const isDone = completed.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectLesson(lesson.id);
                }}
                className="bg-white hover:bg-purple-50/50 p-4 rounded-2xl border-2 border-purple-100 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${lesson.color} text-white flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                    {lesson.icon}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-purple-600">
                        الدرس {toArabic(lesson.id)}
                      </span>
                      {isDone && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                      )}
                    </div>
                    <h4 className="font-black text-slate-800 text-base group-hover:text-purple-700 transition-colors">
                      {lesson.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-xl bg-purple-100 group-hover:bg-purple-600 text-purple-600 group-hover:text-white flex items-center justify-center transition-colors">
                  <Play className="w-4 h-4 ml-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fast stats footer */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200 flex flex-wrap items-center justify-around gap-4 text-center">
        <div>
          <p className="text-xs text-gray-500 font-bold">النقاط الحالية</p>
          <p className="text-xl font-black text-pink-600">
            {toArabic(currentStudent?.totalScore || 0)} ⭐
          </p>
        </div>
        <div className="h-8 w-px bg-pink-100 hidden sm:block" />
        <div>
          <p className="text-xs text-gray-500 font-bold">الأسئلة المجابة</p>
          <p className="text-xl font-black text-purple-600">
            {toArabic(currentStudent?.questionsAnswered || 0)}
          </p>
        </div>
        <div className="h-8 w-px bg-pink-100 hidden sm:block" />
        <div>
          <p className="text-xs text-gray-500 font-bold">الإجابات الصحيحة</p>
          <p className="text-xl font-black text-emerald-600">
            {toArabic(currentStudent?.correctAnswers || 0)}
          </p>
        </div>
      </div>

    </div>
  );
};
