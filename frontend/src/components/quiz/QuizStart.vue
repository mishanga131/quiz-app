<script setup lang="ts">
import BaseCard from '@/components/common/BaseCard.vue';

defineProps<{
  title: string;
  description: string;
  questionCount: number;
}>();
const emit = defineEmits<{ (e: 'start'): void }>();
</script>

<template>
  <BaseCard>
    <div class="space-y-3 text-center">
      <div class="badge badge-secondary">Онлайн-тест</div>
      <h1 class="text-3xl font-bold">{{ title }}</h1>
      <p class="opacity-80">{{ description }}</p>
    </div>

    <div class="stats stats-vertical bg-base-200 sm:stats-horizontal">
      <div class="stat place-items-center">
        <div class="stat-title">Запитань</div>
        <div class="stat-value text-primary">{{ questionCount }}</div>
      </div>
      <div class="stat place-items-center">
        <div class="stat-title">Відповідь на запитання</div>
        <div class="stat-value text-secondary">1</div>
        <div class="stat-desc">один правильний варіант</div>
      </div>
    </div>

    <template #actions>
      <button type="button" class="btn btn-primary btn-block" @click="emit('start')">Почати тест</button>
    </template>
  </BaseCard>
</template>
