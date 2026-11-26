<script setup lang="ts">
import { computed } from 'vue';

interface QuestionStatus {
  index: number;
  answered: boolean;
  current: boolean;
}

const props = defineProps<{
  current: number;
  total: number;
  answered: number;
  statuses: QuestionStatus[];
}>();
const emit = defineEmits<{ (e: 'select', index: number): void }>();

const percent = computed(() => (props.total ? Math.round((props.answered / props.total) * 100) : 0));
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between text-sm">
      <span class="font-medium">Запитання {{ current }} з {{ total }}</span>
      <span class="opacity-70">Відповіли: {{ answered }}/{{ total }}</span>
    </div>

    <progress class="progress progress-primary w-full" :value="percent" max="100" />

    <!-- Швидкий перехід між запитаннями -->
    <div class="flex flex-wrap gap-1">
      <button
        v-for="s in statuses"
        :key="s.index"
        type="button"
        class="btn btn-xs btn-square"
        :class="{
          'btn-primary': s.current,
          'btn-success btn-outline': !s.current && s.answered,
          'btn-ghost': !s.current && !s.answered,
        }"
        :aria-label="`Перейти до запитання ${s.index + 1}`"
        @click="emit('select', s.index)"
      >
        {{ s.index + 1 }}
      </button>
    </div>
  </div>
</template>
