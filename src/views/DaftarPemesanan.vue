<script setup>
import { ref } from 'vue'

import { useFetch } from '@/composition/useFetch'
import { usePrint } from '@/composition/usePrint'
import CardComponent from '@/components/CardComponent.vue'
import HeroBar from '@/components/HeroBar.vue'
import JbButton from '@/components/JbButton.vue'
import ListOfTable from '@/components/Tables/ListOfTable.vue'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'

const titleStack = ref(['Beranda', 'Daftar Pemesanan'])

const handleOnPrint = async () => {
  const { data } = await useFetch('get', '/tables/all')
  usePrint(data.data, 'daftar-meja')
}
</script>

<template>
  <title-bar :title-stack="titleStack" />

  <hero-bar>Daftar Pemesanan</hero-bar>

  <main-section>
    <card-component
      title="Daftar Pemesanan"
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

      <ListOfTable />
    </card-component>
  </main-section>
</template>
