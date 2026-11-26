<script setup lang="ts">
/** Універсальна картка з іменованими слотами: header, default, actions. */
defineSlots<{
  header?: () => unknown;
  default: () => unknown;
  actions?: () => unknown;
}>();
</script>

<template>
  <section class="card bg-base-100 shadow-xl">
    <div class="card-body gap-6">
      <div v-if="$slots.header">
        <slot name="header" />
      </div>

      <slot />

      <div v-if="$slots.actions" class="card-actions border-t border-base-300 pt-4">
        <slot name="actions" />
      </div>
    </div>
  </section>
</template>
