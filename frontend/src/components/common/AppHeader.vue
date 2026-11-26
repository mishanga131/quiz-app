<script setup lang="ts">
import type { Theme } from '@/composables/useTheme';

defineProps<{ theme: Theme }>();
const emit = defineEmits<{ (e: 'toggle-theme'): void }>();
</script>

<template>
  <header class="navbar border-b border-base-300 bg-base-100 px-4 shadow-sm">
    <div class="mx-auto flex w-full max-w-3xl items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="badge badge-primary badge-lg font-bold">Q</span>
        <span class="text-lg font-semibold">Quiz App</span>
      </div>
      <button
        type="button"
        class="btn btn-ghost btn-sm"
        :aria-label="theme === 'night' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'"
        @click="emit('toggle-theme')"
      >
        {{ theme === 'night' ? '☀️ Світла' : '🌙 Темна' }}
      </button>
    </div>
  </header>
</template>
