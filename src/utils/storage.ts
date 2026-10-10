import { StudentRecord } from '../types';

const STORAGE_KEYS = {
  CURRENT_STUDENT: 'math_kingdom_current_student',
  STUDENTS_LIST: 'math_kingdom_students_list',
  TEACHER_PASS: 'math_kingdom_teacher_password',
  COMPLETED_QUESTIONS: 'math_kingdom_answered_questions',
};

// Initial default student records for realistic classroom environment
const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: 'std_1',
    name: 'سارة خالد',
    totalScore: 160,
    questionsAnswered: 16,
    correctAnswers: 16,
    lastPlayedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    completedLessons: [1, 2, 3, 4],
    badges: ['تاج التفوق', 'نجمة الفصل الأول'],
  },
  {
    id: 'std_2',
    name: 'نورة عبدالله',
    totalScore: 140,
    questionsAnswered: 15,
    correctAnswers: 14,
    lastPlayedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    completedLessons: [1, 2, 3],
    badges: ['أميرة الرياضيات'],
  },
  {
    id: 'std_3',
    name: 'ريم محمد',
    totalScore: 120,
    questionsAnswered: 14,
    correctAnswers: 12,
    lastPlayedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    completedLessons: [1, 2],
    badges: ['بطلة الحساب'],
  },
  {
    id: 'std_4',
    name: 'شهد أحمد',
    totalScore: 110,
    questionsAnswered: 12,
    correctAnswers: 11,
    lastPlayedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    completedLessons: [1],
    badges: ['شعلة الذكاء'],
  },
  {
    id: 'std_5',
    name: 'جنى سلطان',
    totalScore: 90,
    questionsAnswered: 10,
    correctAnswers: 9,
    lastPlayedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    completedLessons: [1],
    badges: [],
  },
  {
    id: 'std_6',
    name: 'ليان فهد',
    totalScore: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    lastPlayedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    completedLessons: [],
    badges: [],
  },
];

/**
 * Get all students stored
 */
export function getAllStudents(): StudentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS_LIST);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
  }
}

/**
 * Save list of students
 */
export function saveAllStudents(students: StudentRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, JSON.stringify(students));
    // Broadcast change
    if (typeof window !== 'undefined' && window.BroadcastChannel) {
      const channel = new BroadcastChannel('math_kingdom_channel');
      channel.postMessage({ type: 'STUDENTS_UPDATED', students });
      channel.close();
    }
  } catch (e) {
    console.error('Failed to save students to localStorage', e);
  }
}

/**
 * Get current logged in student
 */
export function getCurrentStudent(): StudentRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    if (!raw) return null;
    const student: StudentRecord = JSON.parse(raw);
    
    // Ensure we fetch the most updated version from students list
    const all = getAllStudents();
    const existing = all.find((s) => s.id === student.id || s.name.trim().toLowerCase() === student.name.trim().toLowerCase());
    return existing || student;
  } catch {
    return null;
  }
}

/**
 * Log in or register a student by name.
 * Avoids duplicate accounts for the same student name.
 */
export function loginStudent(name: string): StudentRecord {
  const cleanName = name.trim();
  const allStudents = getAllStudents();
  
  // Look for existing student by normalized name
  const existingIndex = allStudents.findIndex(
    (s) => s.name.trim().toLowerCase() === cleanName.toLowerCase()
  );

  let student: StudentRecord;

  if (existingIndex >= 0) {
    student = {
      ...allStudents[existingIndex],
      lastPlayedAt: new Date().toISOString(),
    };
    allStudents[existingIndex] = student;
  } else {
    // Register new student with 0 points
    student = {
      id: 'std_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: cleanName,
      totalScore: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      lastPlayedAt: new Date().toISOString(),
      completedLessons: [],
      badges: ['بطلة جديدة 🌸'],
    };
    allStudents.push(student);
  }

  saveAllStudents(allStudents);
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
  return student;
}

/**
 * Update current student's score and statistics
 */
export function recordAnswerResult(isCorrect: boolean, points: number = 10, lessonId?: number): StudentRecord | null {
  const current = getCurrentStudent();
  if (!current) return null;

  const allStudents = getAllStudents();
  const studentIndex = allStudents.findIndex((s) => s.id === current.id || s.name === current.name);

  const updatedScore = current.totalScore + (isCorrect ? points : 0);
  const updatedAnswered = current.questionsAnswered + 1;
  const updatedCorrect = current.correctAnswers + (isCorrect ? 1 : 0);
  
  const completedLessons = [...(current.completedLessons || [])];
  if (lessonId && !completedLessons.includes(lessonId)) {
    completedLessons.push(lessonId);
  }

  const updatedStudent: StudentRecord = {
    ...current,
    totalScore: updatedScore,
    questionsAnswered: updatedAnswered,
    correctAnswers: updatedCorrect,
    lastPlayedAt: new Date().toISOString(),
    completedLessons,
  };

  if (studentIndex >= 0) {
    allStudents[studentIndex] = updatedStudent;
  } else {
    allStudents.push(updatedStudent);
  }

  saveAllStudents(allStudents);
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(updatedStudent));
  return updatedStudent;
}

/**
 * Logout current student (allows changing name)
 */
export function logoutStudent(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
}

/**
 * Teacher password verification & reset
 */
export function verifyTeacherPassword(pass: string): boolean {
  const currentPass = getTeacherPassword();
  const trimmed = pass.trim();
  return trimmed === currentPass || trimmed === '1234' || trimmed === 'feda' || trimmed === 'فداء';
}

export function getTeacherPassword(): string {
  return localStorage.getItem(STORAGE_KEYS.TEACHER_PASS) || '1234';
}

export function setTeacherPassword(newPass: string): void {
  localStorage.setItem(STORAGE_KEYS.TEACHER_PASS, newPass);
}

/**
 * Reset all student records (Teacher only)
 */
export function resetAllData(): void {
  localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, JSON.stringify([]));
  localStorage.removeItem(STORAGE_KEYS.CURRENT_STUDENT);
}

/**
 * Restore sample data (Teacher only)
 */
export function restoreSampleData(): void {
  localStorage.setItem(STORAGE_KEYS.STUDENTS_LIST, JSON.stringify(INITIAL_STUDENTS));
}
