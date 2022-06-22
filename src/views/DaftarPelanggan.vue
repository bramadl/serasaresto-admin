<script setup>
import { ref } from 'vue'
import { mdiTableOff } from '@mdi/js'

import { useEmitter } from '@/composition/useEmitter'
import { useFetch } from '@/composition/useFetch'
import { usePrint } from '@/composition/usePrint'
import CardComponent from '@/components/CardComponent.vue'
import ClientsTable from '@/components/ClientsTable.vue'
import HeroBar from '@/components/HeroBar.vue'
import JbButton from '@/components/JbButton.vue'
import MainSection from '@/components/MainSection.vue'
import Notification from '@/components/Notification.vue'
import TitleBar from '@/components/TitleBar.vue'

const emitter = useEmitter()

const titleStack = ref(['Beranda', 'Daftar Pelanggan'])

const showNotification = ref(false)

const handleOnPrint = async () => {
  const { data } = await useFetch('get', '/customers/all')
  usePrint(data.data, 'daftar-pelanggan')
}

const handleOnDelete = async (userId) => {
  await useFetch('delete', `/customers/${userId.value}`)
  emitter.emit('refresh:clients')
  showNotification.value = true
}
</script>

<template>
  <title-bar :title-stack="titleStack" />

  <hero-bar>Daftar Pelanggan</hero-bar>

  <main-section>
    <notification
      v-if="showNotification"
      color="danger"
      :icon="mdiTableOff"
    >
      <b>Pelanggan berhasil dihapus.</b>
    </notification>

    <card-component
      title="Daftar Pelanggan"
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

      <clients-table
        crud
        endpoint="/customers/all"
        @onDelete="handleOnDelete"
      />
    </card-component>
  </main-section>
</template>
