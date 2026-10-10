import { useState, useEffect } from 'react';
import { getCurrentStudent, logoutStudent } from './utils/storage';
import { StudentRecord, Question } from './types';
import { QUESTIONS } from './data/curriculumQuestions';
import { StudentLogin } from './components/StudentLogin';
import { Navbar } from './components/Navbar';
import { LessonSelector } from './components/LessonSelector';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { Leaderboard } from './components/Leaderboard';
import { TeacherDashboard } from './components/TeacherDashboard';

export default function App() {
  const [currentStudent, setCurrentStudent] = useState<StudentRecord | null>(null);
  const [activeTab, setActiveTab] = useState<'game' | 'leaderboard' | 'teacher' | 'lesson-select'>('lesson-select');
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [sessionResults, setSessionResults] = useState<{
    total: number;
    correct: number;
    earnedScore: number;
  }>({ total: 0, correct: 0, earnedScore: 0 });

  // Load existing student from persistent storage
  useEffect(() => {
    const student = getCurrentStudent();
    if (student) {
      setCurrentStudent(student);
      setActiveTab('lesson-select');
    }
  }, []);

  const handleLoginSuccess = (student: StudentRecord) => {
    setCurrentStudent(student);
    setActiveTab('lesson-select');
    setIsPlaying(false);
    setIsGameOver(false);
  };

  const handleChangeName = () => {
    logoutStudent();
    setCurrentStudent(null);
    setIsPlaying(false);
    setIsGameOver(false);
    setActiveTab('lesson-select');
  };

  const handleStartGameWithLesson = (lessonId: number | 'all') => {
    let selected: Question[] = [];
    if (lessonId === 'all') {
      selected = [...QUESTIONS].sort(() => Math.random() - 0.5);
    } else {
      selected = QUESTIONS.filter((q) => q.lessonId === lessonId);
    }

    if (selected.length === 0) {
      selected = QUESTIONS;
    }

    setGameQuestions(selected);
    setIsPlaying(true);
    setIsGameOver(false);
    setActiveTab('game');
  };

  const handleFinishGame = (results: { total: number; correct: number; earnedScore: number }) => {
    setSessionResults(results);
    setIsPlaying(false);
    setIsGameOver(true);
    // Reload updated student from storage
    const updated = getCurrentStudent();
    if (updated) setCurrentStudent(updated);
  };

  const handlePlayAgain = () => {
    // Replay with current question set or all questions
    if (gameQuestions.length > 0) {
      setIsPlaying(true);
      setIsGameOver(false);
    } else {
      handleStartGameWithLesson('all');
    }
  };

  const handleBackToLessons = () => {
    setIsPlaying(false);
    setIsGameOver(false);
    setActiveTab('lesson-select');
  };

  // If no student is logged in yet, show the single-input login screen
  if (!currentStudent && activeTab !== 'teacher' && activeTab !== 'leaderboard') {
    return (
      <StudentLogin
        onLoginSuccess={handleLoginSuccess}
        onOpenTeacher={() => setActiveTab('teacher')}
        onOpenLeaderboard={() => setActiveTab('leaderboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50/60 to-rose-50 flex flex-col justify-between selection:bg-pink-200">
      
      {/* Sticky Header Navbar */}
      <Navbar
        currentStudent={currentStudent}
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setIsPlaying(false);
          setIsGameOver(false);
          setActiveTab(tab);
        }}
        onChangeName={handleChangeName}
      />

      {/* Main Body View */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8">
        
        {/* Tab: Teacher Dashboard */}
        {activeTab === 'teacher' && <TeacherDashboard />}

        {/* Tab: Leaderboard */}
        {activeTab === 'leaderboard' && (
          <Leaderboard
            currentStudent={currentStudent}
            onPlayClick={() => {
              if (currentStudent) {
                setActiveTab('lesson-select');
              } else {
                setActiveTab('lesson-select');
              }
            }}
          />
        )}

        {/* Tab: Active Game Screen */}
        {activeTab === 'game' && isPlaying && currentStudent && (
          <GameScreen
            questions={gameQuestions}
            currentStudent={currentStudent}
            onFinishGame={handleFinishGame}
            onBackToLessons={handleBackToLessons}
          />
        )}

        {/* Tab: Results Screen */}
        {activeTab === 'game' && isGameOver && currentStudent && (
          <ResultScreen
            currentStudent={currentStudent}
            sessionResults={sessionResults}
            onPlayAgain={handlePlayAgain}
            onGoToLeaderboard={() => setActiveTab('leaderboard')}
            onBackToLessons={handleBackToLessons}
          />
        )}

        {/* Tab: Lesson Selector / Kingdom Map */}
        {activeTab === 'lesson-select' && (
          <LessonSelector
            currentStudent={currentStudent}
            onSelectLesson={handleStartGameWithLesson}
          />
        )}

      </main>

      {/* App Footer */}
      <footer className="w-full bg-white/70 backdrop-blur-xs border-t border-pink-200 py-3 px-4 text-center text-xs font-bold text-pink-800 print:hidden">
        🌸 مملكة الرياضيات - إعداد المعلمة: أ. فداء التميمي - الصف السادس الابتدائي 🌸
      </footer>

    </div>
  );
}
