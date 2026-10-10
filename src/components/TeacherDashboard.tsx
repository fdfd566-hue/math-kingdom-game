import React, { useState, useEffect } from 'react';
import {
  getAllStudents,
  verifyTeacherPassword,
  saveAllStudents,
  restoreSampleData,
} from '../utils/storage';
import { REVIEW_ITEMS } from '../data/curriculumQuestions';
import { ShareCard } from './ShareCard';
import { StudentRecord } from '../types';
import { toArabic, formatPercentage } from '../utils/arabicNumbers';
import { sounds } from '../utils/audio';
import {
  ShieldCheck,
  Lock,
  Users,
  Award,
  Download,
  Printer,
  Trash2,
  RefreshCw,
  Search,
  PlusCircle,
  Eye,
  EyeOff,
  Star,
  CheckCircle,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');

  const loadData = () => {
    const list = getAllStudents();
    setStudents(list);
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyTeacherPassword(passInput)) {
      sounds.playCorrect();
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      sounds.playWrong();
      setErrorMsg('كلمة المرور غير صحيحة. (كلمة المرور الافتراضية: 1234 أو feda)');
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const list = getAllStudents();
    const newStudent: StudentRecord = {
      id: 'std_' + Date.now(),
      name: newStudentName.trim(),
      totalScore: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      lastPlayedAt: new Date().toISOString(),
      completedLessons: [],
      badges: [],
    };
    const updated = [newStudent, ...list];
    saveAllStudents(updated);
    setStudents(updated);
    setNewStudentName('');
    setShowAddModal(false);
    sounds.playCorrect();
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`هل أنتِ متأكدة من حذف سجل الطالبة "${name}"؟`)) {
      const updated = students.filter((s) => s.id !== id);
      saveAllStudents(updated);
      setStudents(updated);
      sounds.playClick();
    }
  };

  const handleExportCSV = () => {
    sounds.playClick();
    const headers = ['اسم الطالبة', 'مجموع النقاط', 'الأسئلة المجابة', 'الإجابات الصحيحة', 'نسبة الإتقان', 'تاريخ آخر نشاط'];
    const rows = students.map((s) => [
      `"${s.name}"`,
      s.totalScore,
      s.questionsAnswered,
      s.correctAnswers,
      s.questionsAnswered > 0 ? `${Math.round((s.correctAnswers / s.questionsAnswered) * 100)}%` : '0%',
      new Date(s.lastPlayedAt).toLocaleDateString('ar-SA'),
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `تقرير_طالبات_الرياضيات_فداء_التميمي_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRestoreSample = () => {
    if (window.confirm('هل ترغبين في استعادة بيانات الطالبات النموذجية؟')) {
      restoreSampleData();
      loadData();
      sounds.playCorrect();
    }
  };

  // If not logged in, show simple secure password form
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8 animate-fadeIn">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border-2 border-purple-200 shadow-xl text-center space-y-5">
          
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-purple-900">
              بوابة المعلمة: أ. فداء التميمي
            </h2>
            <p className="text-xs sm:text-sm font-bold text-gray-500 mt-1">
              أدخلي كلمة المرور للوصول إلى تقارير الطالبات
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-right">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 pr-1">
                كلمة مرور المعلمة:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder="أدخلي كلمة المرور (1234 أو feda)"
                  autoFocus
                  className="w-full px-4 py-3 rounded-2xl border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-right font-bold text-base outline-none bg-purple-50/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errorMsg && (
                <p className="text-xs font-bold text-rose-500 pr-1">{errorMsg}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>دخول المعلمة</span>
            </button>
          </form>

          <p className="text-[11px] text-gray-400 font-semibold pt-2">
            💡 كلمة المرور الافتراضية للمعلمة: <code className="font-mono bg-purple-50 px-1 py-0.5 rounded text-purple-700">1234</code> أو <code className="font-mono bg-purple-50 px-1 py-0.5 rounded text-purple-700">feda</code>
          </p>
        </div>
      </div>
    );
  }

  // Statistics calculation
  const totalStudents = students.length;
  const highestScore = students.reduce((max, s) => Math.max(max, s.totalScore), 0);
  const totalQuestions = students.reduce((acc, s) => acc + s.questionsAnswered, 0);
  const totalCorrect = students.reduce((acc, s) => acc + s.correctAnswers, 0);
  const classAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-purple-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-purple-200 mb-2">
            <span>👩‍🏫 لوحة المتابعة الخاصة بالمعلمة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            إشراف المعلمة: أ. فداء التميمي
          </h2>
          <p className="text-purple-200 text-xs sm:text-sm font-bold mt-1">
            متابعة فورية لدرجات وإنجازات طالبات الصف السادس الابتدائي
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>تصدير Excel (CSV)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-bold shadow transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      {/* بطاقة مشاركة رابط اللعبة مع الطالبات */}
      <ShareCard />

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border-2 border-pink-100 shadow-sm text-center">
          <div className="w-8 h-8 mx-auto rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center mb-1.5">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-500">إجمالي الطالبات</span>
          <p className="text-2xl font-black text-pink-700 mt-0.5">
            {toArabic(totalStudents)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-amber-100 shadow-sm text-center">
          <div className="w-8 h-8 mx-auto rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-1.5">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-500">أعلى درجة</span>
          <p className="text-2xl font-black text-amber-700 mt-0.5">
            {toArabic(highestScore)} ⭐
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-purple-100 shadow-sm text-center">
          <div className="w-8 h-8 mx-auto rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1.5">
            <Star className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-500">الأسئلة المحلولة</span>
          <p className="text-2xl font-black text-purple-700 mt-0.5">
            {toArabic(totalQuestions)}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-100 shadow-sm text-center">
          <div className="w-8 h-8 mx-auto rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1.5">
            <CheckCircle className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gray-500">نسبة دقة الفصل</span>
          <p className="text-2xl font-black text-emerald-700 mt-0.5">
            {toArabic(classAccuracy)}٪
          </p>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث عن طالبة..."
            className="w-full px-4 py-2.5 pr-9 rounded-2xl bg-white border-2 border-purple-200 focus:border-purple-500 text-right font-bold text-xs sm:text-sm outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-purple-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة طالبة</span>
          </button>

          <button
            onClick={handleRestoreSample}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold border border-gray-300 transition-all cursor-pointer"
            title="استعادة نماذج الطالبات"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>بيانات نموذجية</span>
          </button>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-3xl border-2 border-purple-200 shadow-lg overflow-x-auto">
        <table className="w-full text-right text-xs sm:text-sm">
          <thead className="bg-purple-100/70 text-purple-950 font-black border-b border-purple-200">
            <tr>
              <th className="p-3.5">#</th>
              <th className="p-3.5">اسم الطالبة</th>
              <th className="p-3.5 text-center">مجموع النقاط</th>
              <th className="p-3.5 text-center">الأسئلة المجابة</th>
              <th className="p-3.5 text-center">الإجابات الصحيحة</th>
              <th className="p-3.5 text-center">نسبة الإتقان</th>
              <th className="p-3.5 text-center print:hidden">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-100 font-bold text-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 font-bold">
                  لا توجد طالبات مسجلات في القائمة حالياً
                </td>
              </tr>
            ) : (
              filtered.map((student, idx) => {
                const accuracy = formatPercentage(student.correctAnswers, student.questionsAnswered);
                return (
                  <tr key={student.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="p-3.5 text-gray-500">{toArabic(idx + 1)}</td>
                    <td className="p-3.5 font-black text-slate-900 flex items-center gap-1.5">
                      <span>🌸</span>
                      <span>{student.name}</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-100 text-pink-800 font-black text-xs">
                        {toArabic(student.totalScore)} ⭐
                      </span>
                    </td>
                    <td className="p-3.5 text-center">{toArabic(student.questionsAnswered)}</td>
                    <td className="p-3.5 text-center text-emerald-700 font-black">
                      {toArabic(student.correctAnswers)}
                    </td>
                    <td className="p-3.5 text-center font-black text-purple-800">
                      {accuracy}
                    </td>
                    <td className="p-3.5 text-center print:hidden">
                      <button
                        onClick={() => handleDeleteStudent(student.id, student.name)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                        title="حذف الطالبة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* بطاقة مراجعة أسئلة ملف الاختبار */}
      <details className="bg-amber-50/70 rounded-3xl border-2 border-amber-200 shadow-sm overflow-hidden">
        <summary className="cursor-pointer select-none p-4 sm:p-5 flex items-center justify-between gap-3 text-right">
          <div className="flex items-center gap-2">
            <span className="text-xl">📌</span>
            <div>
              <h3 className="font-black text-amber-900 text-sm sm:text-base">
                أسئلة من ملف الاختبار تحتاج إلى مراجعتكِ
              </h3>
              <p className="text-[11px] font-bold text-amber-700">
                {toArabic(REVIEW_ITEMS.length)} أسئلة تعذّرت قراءتها بدقة من الصورة الممسوحة، فلم تُضَف للعبة حتى لا تخمَّن.
              </p>
            </div>
          </div>
          <span className="text-xs font-black text-amber-800 bg-white px-3 py-1 rounded-full border border-amber-300 whitespace-nowrap">
            اضغطي للعرض
          </span>
        </summary>

        <div className="px-4 sm:px-5 pb-5 space-y-3">
          {REVIEW_ITEMS.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 border border-amber-200 text-right space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-white bg-amber-500 px-2.5 py-0.5 rounded-full">
                  {item.number}
                </span>
              </div>
              <p className="text-sm font-black text-slate-800 leading-relaxed">
                {item.originalText}
              </p>
              <p className="text-xs font-bold text-purple-800">
                <span className="text-gray-500">الخيارات: </span>
                {item.options}
              </p>
              <p className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 rounded-xl p-2">
                <span>💡 سبب التأجيل: </span>
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      </details>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 border-2 border-pink-200 shadow-2xl text-right animate-fadeIn">
            <h3 className="text-lg font-black text-pink-800">
              إضافة طالبة جديدة إلى الفصل
            </h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  اسم الطالبة:
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="مثال: هند سعد"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-pink-300 focus:border-pink-500 text-right font-bold text-sm outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black text-sm shadow transition-all cursor-pointer"
                >
                  إضافة
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-all cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
