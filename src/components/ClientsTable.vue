<script setup>
import { computed, onMounted, ref } from 'vue'

import { useMainStore } from '@/stores/main'
import ModalBox from '@/components/ModalBox.vue'
import CheckboxCell from '@/components/CheckboxCell.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import { useFetch } from '@/composition/useFetch'
import { useEmitter } from '@/composition/useEmitter'

const emitter = useEmitter()

emitter.on('refresh:clients', async () => {
  const { data: { data: customers } } = await useFetch('get', props.endpoint)
  items.value = customers
})

const props = defineProps({
  checkable: Boolean,
  crud: Boolean,
  endpoint: {
    type: String,
    default: '/customers/latest/10'
  }
})

const emit = defineEmits({
  onDelete: null
})

const mainStore = useMainStore()

const lightBorderStyle = computed(() => mainStore.lightBorderStyle)

const lightBgStyle = computed(() => mainStore.lightBgStyle)

const tableTrStyle = computed(() => mainStore.tableTrStyle)

const tableTrOddStyle = computed(() => mainStore.tableTrOddStyle)

const darkMode = computed(() => mainStore.darkMode)

const items = ref([])

const isModalActive = ref(false)

const isModalDangerActive = ref(false)

const perPage = ref(10)

const currentPage = ref(0)

const checkedRows = ref([])

const userId = ref('')

const itemsPaginated = computed(
  () => items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const remove = (arr, cb) => {
  const newArr = []

  arr.forEach(item => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })

  return newArr
}

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client)
  } else {
    checkedRows.value = remove(checkedRows.value, row => row.id === client.id)
  }
}

const parseDate = (_date) => {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

  const d = new Date(_date)
  const year = d.getFullYear()
  const month = months[d.getMonth()]
  const date = d.getDate()
  const day = days[d.getDay()]
  const hours = d.getHours()
  const minutes = d.getMinutes()
  const seconds = d.getSeconds()

  return `${hours}:${minutes}:${seconds} WIB - ${day}, ${date} ${month} ${year}`
}

const prepareDeleteUser = (id) => {
  userId.value = id
  isModalDangerActive.value = true
}

const onConfirm = (mode) => {
  if (mode === 'delete') {
    emit('onDelete', userId)
    userId.value = ''
  }
}

onMounted(async () => {
  const { data: { data: customers } } = await useFetch('get', props.endpoint)
  items.value = customers
})
</script>

<template>
  <modal-box
    v-model="isModalActive"
    title="Sample modal"
  >
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
  </modal-box>

  <modal-box
    v-model="isModalDangerActive"
    button="danger"
    button-label="Ya, hapus"
    has-cancel
    large-title="Apakah anda yakin ingin menghapus pelanggan ini?"
    @confirm="() => onConfirm('delete')"
    @cancel="userId = ''"
  >
    <p>Jika pelanggan ini memiliki pesanan belum terselesaikan, <b>anda tidak dapat menghapus pelanggan ini.</b></p>
    <p>Agar lebih aman, anda hanya dapat menghapus pelanggan yang telah mengakhiri pemesanan atau selesai mereservasi meja!</p>
    <p>Menghapus data pelanggan akan berdampak kepada pesanan, otomatis histori pesanan akan ikut terhapus.</p>
  </modal-box>

  <div
    v-if="checkedRows.length"
    class="bg-opacity-50 p-3 dark:bg-gray-800"
    :class="lightBgStyle"
  >
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm dark:bg-gray-700"
      :class="lightBgStyle"
    >
      {{ checkedRow.name }}
    </span>
  </div>

  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th>Nama Pelangggan</th>
        <th>Meja Direservasi</th>
        <th>Pesanan Dibuat</th>
        <th>Waktu Reservasi</th>
        <th>Waktu Selesai</th>
        <th v-if="crud" />
      </tr>
    </thead>
    <tbody>
      <template v-if="itemsPaginated.length">
        <tr
          v-for="(client, index) in itemsPaginated"
          :key="client.id"
          :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
        >
          <checkbox-cell
            v-if="checkable"
            @checked="checked($event, client)"
          />
          <td data-label="Name">
            {{ client.name }}
          </td>
          <td data-label="Table">
            {{ client.tableNumber }}
          </td>
          <td data-label="Orders">
            {{ client.ordersCount }}
          </td>
          <td data-label="ReservationDate">
            {{ parseDate(client.reserveTableAt) }}
          </td>
          <td data-label="LoggedOutAt">
            {{ client.loggedOutAt ? parseDate(client.loggedOutAt) : '-' }}
          </td>
          <td v-if="crud">
            <jb-button
              v-if="client.loggedOutAt"
              color="danger"
              label="Hapus Pelanggan"
              :outline="false"
              small
              @click="prepareDeleteUser(client.id)"
            />
          </td>
        </tr>
      </template>
      <template v-else>
        <tr>
          <td
            :class="[tableTrStyle, 'text-center py-4']"
            colspan="999"
          >
            Belum ada data saat ini...
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <div
    :class="lightBorderStyle"
    class="p-3 lg:px-6 border-t dark:border-gray-800"
  >
    <level>
      <jb-buttons>
        <jb-button
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :outline="darkMode"
          small
          @click="currentPage = page"
        />
      </jb-buttons>
      <small>Page {{ currentPageHuman }} of {{ numPages ? numPages : 1 }}</small>
    </level>
  </div>
</template>
