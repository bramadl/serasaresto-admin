<script setup>
import { ref } from 'vue'

import HeroBar from '@/components/HeroBar.vue'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'

const titleStack = ref(['Beranda', 'Daftar Pelanggan'])
</script>

<template>
  <title-bar :title-stack="titleStack" />

  <hero-bar>Daftar Pelanggan</hero-bar>

  <main-section>
    Daftar Pelanggan
  </main-section>
</template>
