<script setup lang="ts">
import type { PublicQuestion } from '@/types/quiz';

/**
 * Компонент запитання.
 * Отримує PublicQuestion — тип БЕЗ correctIndex, тому правильна відповідь
 * фізично недоступна в цьому блоці й не може бути показана користувачу.
 */
defineProps<{
  question: PublicQuestion;
  number: number;
}>();

/** Індекс обраного варіанту (двостороннє звʼязування через v-model). */
const selected = defineModel<number | null>({ required: true });

const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
</script>

<template>
  <fieldset class="space-y-4">
    <legend class="mb-4 text-xl font-semibold leading-snug">
      <span class="text-primary">{{ number }}.</span> {{ question.text }}
    </legend>

    <label
      v-for="(option, i) in question.options"
      :key="i"
      class="flex cursor-pointer items-center gap-4 rounded-box border-2 p-4 transition-colors hover:bg-base-200"
      :class="selected === i ? 'border-primary bg-primary/10' : 'border-base-300'"
    >
      <input v-model="selected" type="radio" class="radio radio-primary" :name="`question-${question.id}`" :value="i" />
      <span class="badge badge-outline">{{ letters[i] ?? i + 1 }}</span>
      <span>{{ option }}</span>
    </label>
  </fieldset>
</template>
