<script setup>
import { reactive, ref } from 'vue'
import { mdiTableOff } from '@mdi/js'

import { useEmitter } from '@/composition/useEmitter'
import { useFetch } from '@/composition/useFetch'
import { usePrint } from '@/composition/usePrint'
import CardComponent from '@/components/CardComponent.vue'
// import ClientsTable from '@/components/ClientsTable.vue'
import AdminsTable from '@/components/AdminsTable.vue'
import HeroBar from '@/components/HeroBar.vue'
import JbButton from '@/components/JbButton.vue'
import MainSection from '@/components/MainSection.vue'
import Notification from '@/components/Notification.vue'
import TitleBar from '@/components/TitleBar.vue'
import ModalBox from '@/components/ModalBox.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
const emitter = useEmitter()

const titleStack = ref(['Beranda', 'Kelola Admin'])
const isModalActive = ref(false)

const showNotification = ref(false)

const roleTypes = [
  { id: 1, label: 'superadmin' },
  { id: 2, label: 'kasir' }
]

const handleOnPrint = async () => {
  const { data } = await useFetch('get', '/customers/all')
  usePrint(data.data, 'daftar-pelanggan')
}

const activeMenu = reactive({
  id: 0,
  name: '',
  email: '',
  role: roleTypes[0]
})
const onCreateMenu = () => {
  //
}

const resetActiveMenu = () => {
  activeMenu.id = 0
  activeMenu.name = ''
  activeMenu.email = ''
  activeMenu.role = ''
}

const handleOnDelete = async (userId) => {
  await useFetch('delete', `/customers/${userId.value}`)
  emitter.emit('refresh:clients')
  showNotification.value = true
}
</script>

<template>
  <title-bar :title-stack="titleStack" />

  <hero-bar>
    Daftar Admin
    <template #tool>
      <jb-button
        color="success"
        label="Tambah Admin"
        @click="isModalActive = true"
      />
    </template>
  </hero-bar>

  <main-section>
    <notification
      v-if="showNotification"
      color="danger"
      :icon="mdiTableOff"
    >
      <b>Pelanggan berhasil dihapus.</b>
    </notification>

    <card-component
      title="Daftar Admin"
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

      <admins-table
        crud
        endpoint="/admin/all"
        @onDelete="handleOnDelete"
      />
    </card-component>
  </main-section>

  <modal-box
    v-model="isModalActive"
    title="Tambah Admin"
    button-label="Simpan"
    @confirm="onCreateMenu"
    @cancel="resetActiveMenu"
  >
    <field label="Nama Admin">
      <control
        v-model="activeMenu.name"
        type="text"
        placeholder="Nama Admin"
      />
    </field>

    <field label="Email admin">
      <control
        v-model="activeMenu.email"
        type="text"
        placeholder="Email"
      />
    </field>

    <field label="Role">
      <control
        v-model="activeMenu.role"
        placeholder="Tipe admin"
        :options="roleTypes"
      />
    </field>
  </modal-box>
</template>
