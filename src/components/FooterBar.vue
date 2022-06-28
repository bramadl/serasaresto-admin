<script setup>
import { computed } from 'vue'
import { useMainStore } from '@/stores/main'
import Level from '@/components/Level.vue'

const mainStore = useMainStore()

const year = computed(() => new Date().getFullYear())

const isFooterBarVisible = computed(() => !mainStore.isFullScreen)
</script>

<template>
  <footer
    v-show="isFooterBarVisible"
    class="bg-white py-2 px-6 dark:bg-gray-900/70"
  >
    <level>
      <div class="text-center md:text-left">
        <b>&copy; {{ year }}, <a
          href="https://instagram.sarahsahdas/"
          target="_blank"
        >Sarah Sahda Shabirah</a>.</b>
      </div>
      <div class="md:py-2">
        <a href="https://justboil.me" />
      </div>
    </level>
  </footer>
</template>
