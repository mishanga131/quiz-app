<script setup lang="ts">
import { onMounted } from 'vue';
import { useQuiz } from '@/composables/useQuiz';
import { useTheme } from '@/composables/useTheme';
import AppHeader from '@/components/common/AppHeader.vue';
import BaseCard from '@/components/common/BaseCard.vue';
import ErrorAlert from '@/components/common/ErrorAlert.vue';
import LoadingSkeleton from '@/components/common/LoadingSkeleton.vue';
import QuizStart from '@/components/quiz/QuizStart.vue';
import QuizProgress from '@/components/quiz/QuizProgress.vue';
import QuizQuestion from '@/components/quiz/QuizQuestion.vue';
import QuizNavigation from '@/components/quiz/QuizNavigation.vue';
import QuizResult from '@/components/quiz/QuizResult.vue';

const quiz = useQuiz();
const { theme, toggle: toggleTheme } = useTheme();

// Деструктуризація ref-ів, щоб у шаблоні вони автоматично розгорталися
const {
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
} = quiz;

onMounted(quiz.load);
</script>

<template>
  <div class="min-h-screen bg-base-200 text-base-content">
    <AppHeader :theme="theme" @toggle-theme="toggleTheme" />

    <main class="mx-auto w-full max-w-3xl px-4 py-8">
      <!-- Стан завантаження -->
      <LoadingSkeleton v-if="isLoading" />

      <!-- Помилка мережі / сервера -->
      <ErrorAlert v-else-if="error" :message="error" @retry="quiz.load" />

      <!-- Стартовий екран -->
      <QuizStart
        v-else-if="state.stage === 'start'"
        :title="state.title"
        :description="state.description"
        :question-count="total"
        @start="quiz.start"
      />

      <!-- Екран запитання -->
      <BaseCard v-else-if="state.stage === 'question' && currentQuestion">
        <template #header>
          <QuizProgress
            :current="state.currentIndex + 1"
            :total="total"
            :answered="answeredCount"
            :statuses="questionStatuses"
            @select="quiz.goTo"
          />
        </template>

        <QuizQuestion
          :key="currentQuestion.id"
          v-model="currentAnswer"
          :question="currentQuestion"
          :number="state.currentIndex + 1"
        />

        <template #actions>
          <QuizNavigation
            :is-first="isFirst"
            :is-last="isLast"
            :has-answer="currentAnswer !== null"
            :can-finish="allAnswered"
            :remaining="total - answeredCount"
            @prev="quiz.prev"
            @next="quiz.next"
            @finish="quiz.finish"
          />
        </template>
      </BaseCard>

      <!-- Підсумковий екран -->
      <QuizResult v-else-if="state.stage === 'result'" :result="result" @restart="quiz.restart" />
    </main>

    <footer class="pb-6 text-center text-xs opacity-60">
      Лабораторна робота №1 · Варіант 1 · Vue 3 + TypeScript + Tailwind CSS + DaisyUI
    </footer>
  </div>
</template>
