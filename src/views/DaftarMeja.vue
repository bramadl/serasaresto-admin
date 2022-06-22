<script setup>
import { ref } from 'vue'

import { useFetch } from '@/composition/useFetch'
import { usePrint } from '@/composition/usePrint'
import CardComponent from '@/components/CardComponent.vue'
import HeroBar from '@/components/HeroBar.vue'
import JbButton from '@/components/JbButton.vue'
import ListOfTable from '@/components/Tables/ListOfTable.vue'
import MainSection from '@/components/MainSection.vue'
import Notification from '@/components/Notification.vue'
import TitleBar from '@/components/TitleBar.vue'

const titleStack = ref(['Beranda', 'Daftar Meja'])

const showNotification = ref(false)
const notificationColor = ref('')
const notificationMessage = ref('')

const handleOnPrint = async () => {
  const { data } = await useFetch('get', '/tables/all')
  usePrint(data.data, 'daftar-meja')
}
</script>

<template>
  <title-bar :title-stack="titleStack" />

  <hero-bar>Daftar Meja</hero-bar>

  <main-section>
    <notification
      v-if="showNotification"
      :color="notificationColor"
      :icon="mdiTableOff"
    >
      <b>{{ notificationMessage }}</b>
    </notification>

    <card-component
      title="Daftar Meja"
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
