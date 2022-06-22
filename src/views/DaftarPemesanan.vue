<script setup>
import { ref } from 'vue'

import HeroBar from '@/components/HeroBar.vue'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'

const titleStack = ref(['Beranda', 'Daftar Pemesanan'])
</script>

<template>
  <title-bar :title-stack="titleStack" />

  <hero-bar>Daftar Pemesanan</hero-bar>

  <main-section>
    Daftar Pemesanan
  </main-section>
</template>
