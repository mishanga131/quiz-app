<script setup lang="ts">
defineProps<{ message: string }>();
const emit = defineEmits<{ (e: 'retry'): void }>();
</script>

<template>
  <div role="alert" class="alert alert-error shadow-lg">
    <span class="text-xl">⚠️</span>
    <div>
      <h3 class="font-bold">Не вдалося завантажити тест</h3>
      <p class="text-sm">{{ message }}</p>
    </div>
    <button type="button" class="btn btn-sm" @click="emit('retry')">Спробувати ще раз</button>
  </div>
</template>
