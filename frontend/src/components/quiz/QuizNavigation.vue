<script setup lang="ts">
defineProps<{
  isFirst: boolean;
  isLast: boolean;
  hasAnswer: boolean;
  canFinish: boolean;
  remaining: number;
}>();

const emit = defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
  (e: 'finish'): void;
}>();
</script>

<template>
  <div class="flex w-full flex-wrap items-center justify-between gap-3">
    <button type="button" class="btn btn-ghost" :disabled="isFirst" @click="emit('prev')">← Назад</button>

    <span v-if="!canFinish" class="text-sm opacity-70">Залишилось без відповіді: {{ remaining }}</span>

    <div class="flex gap-2">
      <button v-if="!isLast" type="button" class="btn btn-primary" :disabled="!hasAnswer" @click="emit('next')">
        Далі →
      </button>
      <button
        v-if="isLast || canFinish"
        type="button"
        class="btn btn-success"
        :disabled="!canFinish"
        :title="canFinish ? '' : 'Дайте відповідь на всі запитання'"
        @click="emit('finish')"
      >
        Завершити тест
      </button>
    </div>
  </div>
</template>
