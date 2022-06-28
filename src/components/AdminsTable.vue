<script setup>
import { computed, onMounted, ref } from 'vue'

import { useMainStore } from '@/stores/main'
import ModalBox from '@/components/ModalBox.vue'
// import CheckboxCell from '@/components/CheckboxCell.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import { useFetch } from '@/composition/useFetch'
import { useEmitter } from '@/composition/useEmitter'
import { mdiTrashCan } from '@mdi/js'
import Icon from '@/components/Icon.vue'

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

// const remove = (arr, cb) => {
//   const newArr = []

//   arr.forEach(item => {
//     if (!cb(item)) {
//       newArr.push(item)
//     }
//   })

//   return newArr
// }

// const checked = (isChecked, client) => {
//   if (isChecked) {
//     checkedRows.value.push(client)
//   } else {
//     checkedRows.value = remove(checkedRows.value, row => row.id === client.id)
//   }
// }

// const prepareDeleteUser = (id) => {
//   userId.value = id
//   isModalDangerActive.value = true
// }

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
    v-model="isModalDangerActive"
    button="danger"
    button-label="Ya, hapus"
    has-cancel
    large-title="Hapus?"
    @confirm="() => onConfirm('delete')"
    @cancel="userId = ''"
  >
    <p>Apakah anda yakin ingin menghapus role ini?</p>
    <p>Tindakan ini tidak dapat dibatalkan</p>
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
        <th>Nama</th>
        <th>Email</th>
        <th>Role</th>
        <th>Aksi</th>
        <th v-if="crud" />
      </tr>
    </thead>
    <tbody>
      <template v-if="itemsPaginated.length">
        <tr
          v-for="(admin, index) in itemsPaginated"
          :key="admin.id"
          :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
        >
          <td>
            {{ admin.name }}
          </td>
          <td>
            {{ admin.email }}
          </td>
          <td>
            {{ admin.role }}
          </td>
          <td>
            <icon
              :path="mdiTrashCan"
              @click="isModalDangerActive = true"
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
