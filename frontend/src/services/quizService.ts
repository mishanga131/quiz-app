import { ApiError, http } from '@/api/http';
import type { Question, Quiz } from '@/types/quiz';

function isValidQuestion(q: unknown): q is Question {
  if (typeof q !== 'object' || q === null) return false;
  const v = q as Partial<Question>;
  return (
    Number.isInteger(v.id) &&
    typeof v.text === 'string' &&
    v.text.trim().length > 0 &&
    Array.isArray(v.options) &&
    v.options.length >= 2 &&
    v.options.every((o) => typeof o === 'string' && o.trim().length > 0) &&
    Number.isInteger(v.correctIndex) &&
    typeof v.correctIndex === 'number' &&
    v.correctIndex >= 0 &&
    v.correctIndex < v.options.length
  );
}

/**
 * Сервісний шар: знає, ЯКІ запити робити, і перевіряє структуру даних.
 * Компоненти не звертаються до Axios напряму.
 */
export const quizService = {
  async getQuiz(quizId = 'quiz'): Promise<Quiz> {
    const { data } = await http.get<Quiz>(`/${quizId}.json`);
    if (!data || !Array.isArray(data.questions) || !data.questions.every(isValidQuestion)) {
      throw new ApiError('Отримано некоректний формат набору запитань');
    }
    if (data.questions.length === 0) {
      throw new ApiError('Набір запитань порожній');
    }
    const ids = new Set(data.questions.map((q) => q.id));
    if (ids.size !== data.questions.length) {
      throw new ApiError('У наборі є запитання з однаковим id');
    }
    return data;
  },
};
