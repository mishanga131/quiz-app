import { computed, reactive, ref, watch } from 'vue';
import { quizService } from '@/services/quizService';
import { ApiError } from '@/api/http';
import type { AnswerMap, PublicQuestion, Question, QuizResult, QuizStage } from '@/types/quiz';

const STORAGE_KEY = 'quiz-app:progress';

interface QuizState {
  title: string;
  description: string;
  questions: Question[];
  answers: AnswerMap;
  currentIndex: number;
  stage: QuizStage;
}

interface SavedProgress {
  answers: AnswerMap;
  currentIndex: number;
  stage: QuizStage;
}

const STAGES: QuizStage[] = ['start', 'question', 'result'];

/**
 * Читає збережений прогрес і перевіряє його відносно поточного набору запитань.
 * Некоректні або застарілі дані відкидаються, щоб не зламати стан інтерфейсу.
 */
function readProgress(questions: Question[]): SavedProgress | null {
  let parsed: unknown;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const p = parsed as Record<string, unknown>;

  const stage = p.stage as QuizStage;
  if (!STAGES.includes(stage)) return null;

  const index = p.currentIndex;
  if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= questions.length) return null;

  if (typeof p.answers !== 'object' || p.answers === null || Array.isArray(p.answers)) return null;
  const rawAnswers = p.answers as Record<string, unknown>;

  // Залишаємо лише відповіді на існуючі запитання з допустимим індексом варіанту
  const answers: AnswerMap = {};
  for (const q of questions) {
    const value = rawAnswers[String(q.id)];
    if (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < q.options.length) {
      answers[q.id] = value;
    }
  }

  // Екран результатів можливий лише якщо відповіді є на всі запитання
  const allAnswered = Object.keys(answers).length === questions.length;
  const safeStage: QuizStage = stage === 'result' && !allAnswered ? 'question' : stage;

  return { answers, currentIndex: index, stage: safeStage };
}

function writeProgress(progress: SavedProgress | null): void {
  try {
    if (progress) localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* сховище недоступне — прогрес просто не зберігається */
  }
}

/**
 * Composable-шар (стан застосунку): реактивний стан тесту,
 * обчислювані властивості та дії. Між компонентами та сервісом.
 */
export function useQuiz() {
  const state = reactive<QuizState>({
    title: '',
    description: '',
    questions: [],
    answers: {},
    currentIndex: 0,
    stage: 'start',
  });
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // ---------- computed ----------
  const total = computed(() => state.questions.length);

  /** Поточне запитання БЕЗ правильної відповіді — саме його отримує компонент запитання. */
  const currentQuestion = computed<PublicQuestion | null>(() => {
    const q = state.questions[state.currentIndex];
    if (!q) return null;
    const { correctIndex: _hidden, ...publicPart } = q;
    return publicPart;
  });

  const answeredCount = computed(() => state.questions.filter((q) => state.answers[q.id] !== undefined).length);
  const allAnswered = computed(() => total.value > 0 && answeredCount.value === total.value);
  const isFirst = computed(() => state.currentIndex === 0);
  const isLast = computed(() => state.currentIndex === total.value - 1);

  /** Відповідь на поточне запитання (для v-model у компоненті запитання). */
  const currentAnswer = computed<number | null>({
    get: () => {
      const q = state.questions[state.currentIndex];
      return q && state.answers[q.id] !== undefined ? state.answers[q.id] : null;
    },
    set: (value) => {
      const q = state.questions[state.currentIndex];
      if (q && value !== null) state.answers[q.id] = value;
    },
  });

  /** Статус кожного запитання для навігаційної панелі. */
  const questionStatuses = computed(() =>
    state.questions.map((q, i) => ({
      index: i,
      answered: state.answers[q.id] !== undefined,
      current: i === state.currentIndex,
    })),
  );

  const result = computed<QuizResult>(() => {
    const review = state.questions.map((q) => {
      const selected = state.answers[q.id];
      return {
        id: q.id,
        text: q.text,
        selectedOption: selected !== undefined ? q.options[selected] : null,
        correctOption: q.options[q.correctIndex],
        isCorrect: selected === q.correctIndex,
      };
    });
    const correct = review.filter((r) => r.isCorrect).length;
    return {
      correct,
      total: total.value,
      percent: total.value ? Math.round((correct / total.value) * 100) : 0,
      review,
    };
  });

  // ---------- watch: збереження прогресу ----------
  watch(
    () => ({ answers: { ...state.answers }, currentIndex: state.currentIndex, stage: state.stage }),
    (progress) => {
      if (state.questions.length === 0) return;
      writeProgress(progress.stage === 'start' ? null : progress);
    },
    { deep: true },
  );

  // ---------- actions ----------
  async function load(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      const quiz = await quizService.getQuiz();
      state.title = quiz.title;
      state.description = quiz.description;
      state.questions = quiz.questions;

      const saved = readProgress(quiz.questions);
      if (saved) {
        state.answers = saved.answers;
        state.currentIndex = saved.currentIndex;
        state.stage = saved.stage;
      }
    } catch (e) {
      error.value = e instanceof ApiError ? e.message : 'Невідома помилка під час завантаження тесту';
    } finally {
      isLoading.value = false;
    }
  }

  function start(): void {
    state.answers = {};
    state.currentIndex = 0;
    state.stage = 'question';
  }

  function goTo(index: number): void {
    if (index >= 0 && index < total.value) state.currentIndex = index;
  }

  const next = () => goTo(state.currentIndex + 1);
  const prev = () => goTo(state.currentIndex - 1);

  function finish(): void {
    if (allAnswered.value) state.stage = 'result';
  }

  function restart(): void {
    state.answers = {};
    state.currentIndex = 0;
    state.stage = 'start';
  }

  return {
    state,
    isLoading,
    error,
    total,
    currentQuestion,
    currentAnswer,
    answeredCount,
    allAnswered,
    isFirst,
    isLast,
    questionStatuses,
    result,
    load,
    start,
    goTo,
    next,
    prev,
    finish,
    restart,
  };
}
