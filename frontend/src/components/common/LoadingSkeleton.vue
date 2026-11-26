<template>
  <div class="card bg-base-100 shadow-xl" aria-busy="true" aria-label="Завантаження тесту">
    <div class="card-body gap-4">
      <div class="skeleton h-4 w-1/3" />
      <div class="skeleton h-8 w-3/4" />
      <div v-for="n in 4" :key="n" class="skeleton h-12 w-full" />
      <div class="flex justify-end gap-2">
        <div class="skeleton h-10 w-24" />
        <div class="skeleton h-10 w-24" />
      </div>
    </div>
  </div>
</template>
