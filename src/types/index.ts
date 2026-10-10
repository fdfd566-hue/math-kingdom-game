export type ChapterId = 1 | 2;

export interface LessonInfo {
  id: number;
  chapter: ChapterId;
  chapterTitle: string;
  title: string;
  icon: string;
  description: string;
  color: string;
}

export type VisualType = 'bar-chart' | 'line-chart' | 'dot-plot' | 'factor-tree' | 'power-model' | 'expression-card' | 'table' | 'none';

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface VisualData {
  type: VisualType;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  labels?: string[];
  values?: number[];
  dots?: { value: number; count: number }[];
  tree?: {
    root: number;
    branches: { factor1: number | string; factor2: number | string; subBranches?: any };
  };
  table?: TableData;
  customSvg?: string;
}

export interface Question {
  id: number;
  lessonId: number;
  chapterId: ChapterId;
  difficulty: 'easy' | 'medium' | 'hard';
  questionText: string;
  visualData?: VisualData;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
  /** مصدر السؤال: المنهج الأساسي أو ملف اختبار المعلمة المرفق */
  source?: 'curriculum' | 'test-file';
}

export interface StudentRecord {
  id: string;
  name: string;
  totalScore: number;
  questionsAnswered: number;
  correctAnswers: number;
  lastPlayedAt: string;
  completedLessons?: number[];
  badges?: string[];
}

export interface AnswerLog {
  questionId: number;
  selectedIndex: number;
  isCorrect: boolean;
  timestamp: string;
}

/** أسئلة من ملف الاختبار تعذّرت قراءتها بدقة - تُعرض للمعلمة للمراجعة فقط */
export interface ReviewItem {
  number: string;
  originalText: string;
  options: string;
  reason: string;
}
