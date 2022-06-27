<script setup>
import { computed, onMounted, ref } from 'vue'

import { useMainStore } from '@/stores/main'
import { useFetch } from '@/composition/useFetch'
import { useEmitter } from '@/composition/useEmitter'
import { usePriceFormatter } from '@/composition/usePriceFormatter'
import ModalBox from '@/components/ModalBox.vue'
import CheckboxCell from '@/components/CheckboxCell.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'

const emitter = useEmitter()

emitter.on('refresh:orders', async () => {
  const { data: { data: orders } } = await useFetch('get', props.endpoint)
  items.value = orders
})

const props = defineProps({
  checkable: Boolean,
  crud: {
    type: Boolean,
    default: false
  },
  endpoint: {
    type: String,
    default: '/orders/all/orders'
  }
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

// const trimTo = (length, text) => {
//   return String(text).slice(0, length) + '...'
// }

onMounted(async () => {
  const { data: { data: orders } } = await useFetch('get', props.endpoint)
  items.value = orders
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
        <th>Meja Pesanan</th>
        <th>Nama Pelanggan</th>
        <th>Jumlah Item</th>
        <th>Total Pesanan</th>
        <th>Status Pesanan</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="itemsPaginated.length">
        <tr
          v-for="(order, index) in itemsPaginated"
          :key="order.id"
          :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
        >
          <checkbox-cell
            v-if="checkable"
            @checked="checked($event, order)"
          />
          <td data-label="TableNumber">
            {{ order.tableNumber }}
          </td>
          <td data-label="TableToken">
            {{ order.customerName }}
          </td>
          <td data-label="TableToken">
            {{ order.orderItemsLength }} Item
          </td>
          <td data-label="TableToken">
            {{ usePriceFormatter(order.total) }}
          </td>
          <td data-label="TableToken">
            <span
              class="inline-block py-1.5 px-2 text-xs font-semibold text-white rounded"
              :class="order.status === 'DONE' ? 'bg-green-500' : 'bg-yellow-500'"
            >
              {{ order.status }}
            </span>
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
