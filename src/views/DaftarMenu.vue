<script setup>
import { ref } from 'vue'

import { useFetch } from '@/composition/useFetch'
import { usePrint } from '@/composition/usePrint'
import CardComponent from '@/components/CardComponent.vue'
import HeroBar from '@/components/HeroBar.vue'
import JbButton from '@/components/JbButton.vue'
import ListOfMenus from '@/components/Tables/ListOfMenus.vue'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'

const titleStack = ref(['Beranda', 'Daftar Menu'])

const handleOnPrint = async () => {
  const { data } = await useFetch('get', '/menus/all')
  usePrint(data.data, 'daftar-menu')
}
</script>

<template>
  <title-bar :title-stack="titleStack" />

  <hero-bar>Daftar Menu</hero-bar>

  <main-section>
    <card-component
      title="Daftar Menu"
      has-table
      :header-icon="false"
    >
      <template #header-tool>
        <jb-button
          label="Cetak Data"
          small
          @click="handleOnPrint"
        />
      </template>

      <ListOfMenus />
    </card-component>
  </main-section>
</template>
