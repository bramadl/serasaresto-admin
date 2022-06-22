<script setup>
import { ref } from 'vue'

import HeroBar from '@/components/HeroBar.vue'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'

const titleStack = ref(['Beranda', 'Daftar Menu'])
</script>

<template>
  <title-bar :title-stack="titleStack" />

  <hero-bar>Daftar Menu</hero-bar>

  <main-section>
    Daftar Menu
  </main-section>
</template>
