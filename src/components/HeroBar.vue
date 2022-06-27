<script setup>
import { useMainStore } from '@/stores/main'
import { computed } from 'vue'
import Level from '@/components/Level.vue'

const mainStore = useMainStore()

const lightBorderStyle = computed(() => mainStore.lightBorderStyle)
</script>

<template>
  <section
    :class="lightBorderStyle"
    class="bg-white border-t border-b p-6 dark:bg-gray-900/70 dark:border-gray-900 dark:text-white"
  >
    <level>
      <h1 class="text-3xl font-semibold leading-tight">
        <slot />
      </h1>
      <slot name="tool" />
    </level>
  </section>
</template>
