<script setup lang="ts">
import type { QuestionReview } from '@/types/quiz';

defineProps<{
  item: QuestionReview;
  number: number;
}>();
</script>

<template>
  <li class="rounded-box border-l-4 bg-base-200 p-4" :class="item.isCorrect ? 'border-success' : 'border-error'">
    <div class="mb-1 flex items-start justify-between gap-3">
      <p class="font-medium">{{ number }}. {{ item.text }}</p>
      <span class="badge shrink-0" :class="item.isCorrect ? 'badge-success' : 'badge-error'">
        {{ item.isCorrect ? 'Правильно' : 'Помилка' }}
      </span>
    </div>
    <p class="text-sm">
      Ваша відповідь:
      <span :class="item.isCorrect ? 'text-success' : 'text-error'">{{ item.selectedOption ?? '—' }}</span>
    </p>
    <p v-if="!item.isCorrect" class="text-sm">
      Правильна відповідь: <span class="text-success">{{ item.correctOption }}</span>
    </p>
  </li>
</template>
