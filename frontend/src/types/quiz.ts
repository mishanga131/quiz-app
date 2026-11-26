/** Запитання у тому вигляді, як воно зберігається в наборі даних. */
export interface Question {
  id: number;
  text: string;
  options: string[];
  /** Індекс правильної відповіді в масиві options. */
  correctIndex: number;
}

/** Набір даних тесту. */
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

/**
 * Публічне представлення запитання для компонента запитання:
 * без правильної відповіді, щоб її не можна було показати користувачу.
 */
export type PublicQuestion = Omit<Question, 'correctIndex'>;

/** Відповіді користувача: id запитання → індекс обраного варіанту. */
export type AnswerMap = Record<number, number>;

/** Підсумок по одному запитанню (для екрана результатів). */
export interface QuestionReview {
  id: number;
  text: string;
  selectedOption: string | null;
  correctOption: string;
  isCorrect: boolean;
}

/** Підсумковий результат тесту. */
export interface QuizResult {
  correct: number;
  total: number;
  percent: number;
  review: QuestionReview[];
}

/** Етапи (екрани) застосунку. */
export type QuizStage = 'start' | 'question' | 'result';
