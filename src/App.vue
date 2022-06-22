<script setup>
import { computed, onMounted } from 'vue'

import { useMainStore } from '@/stores/main'
import menu from '@/menu.js'
import NavBar from '@/components/NavBar.vue'
import AsideMenu from '@/components/AsideMenu.vue'
import FooterBar from '@/components/FooterBar.vue'
import Overlay from '@/components/Overlay.vue'

const mainStore = useMainStore()

const isAsideLgActive = computed(() => mainStore.isAsideLgActive)

const overlayClick = () => {
  mainStore.asideLgToggle(false)
}

onMounted(async () => {
  const localToken = localStorage.getItem('auth._token.local')
  if (localToken) {
    mainStore.setUserToken(localToken)
  }

  // mainStore.setUserToken(localToken)
  // mainStore.setUser({
  //   name: 'John Doe',
  //   email: 'john@example.com',
  //   avatar: 'https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93'
  // })
})
</script>

<template>
  <nav-bar />
  <aside-menu :menu="menu" />
  <router-view />
  <footer-bar />
  <overlay
    v-show="isAsideLgActive"
    z-index="z-30"
    @overlay-click="overlayClick"
  />
</template>
