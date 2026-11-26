<script setup lang="ts">
import { computed } from 'vue';
import BaseCard from '@/components/common/BaseCard.vue';
import ResultReviewItem from '@/components/quiz/ResultReviewItem.vue';
import type { QuizResult } from '@/types/quiz';

const props = defineProps<{ result: QuizResult }>();
const emit = defineEmits<{ (e: 'restart'): void }>();

/** Оцінка-коментар залежно від відсотка правильних відповідей. */
const verdict = computed(() => {
  const p = props.result.percent;
  if (p >= 90) return { text: 'Відмінно!', tone: 'text-success' };
  if (p >= 70) return { text: 'Добре', tone: 'text-info' };
  if (p >= 50) return { text: 'Задовільно', tone: 'text-warning' };
  return { text: 'Варто повторити матеріал', tone: 'text-error' };
});

const ringClass = computed(() => verdict.value.tone);
</script>

<template>
  <BaseCard>
    <template #header>
      <h2 class="text-center text-2xl font-bold">Результати тесту</h2>
    </template>

    <div class="flex flex-col items-center gap-3">
      <div
        class="radial-progress"
        :class="ringClass"
        :style="{ '--value': result.percent, '--size': '9rem', '--thickness': '0.7rem' }"
        role="progressbar"
        :aria-valuenow="result.percent"
      >
        <span class="text-2xl font-bold">{{ result.percent }}%</span>
      </div>
      <p class="text-xl font-semibold">{{ result.correct }} із {{ result.total }} правильних відповідей</p>
      <p :class="verdict.tone" class="font-medium">{{ verdict.text }}</p>
    </div>

    <div class="divider">Розбір відповідей</div>

    <ul class="space-y-3">
      <ResultReviewItem v-for="(item, i) in result.review" :key="item.id" :item="item" :number="i + 1" />
    </ul>

    <template #actions>
      <button type="button" class="btn btn-primary btn-block" @click="emit('restart')">Пройти ще раз</button>
    </template>
  </BaseCard>
</template>
