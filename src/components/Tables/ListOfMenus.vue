<script setup>
import { computed, onMounted, ref, reactive } from 'vue'
import { mdiFileEdit, mdiTrashCan } from '@mdi/js'

import { useMainStore } from '@/stores/main'
import { useFetch } from '@/composition/useFetch'
import { useEmitter } from '@/composition/useEmitter'
import { usePriceFormatter } from '@/composition/usePriceFormatter'
import ModalBox from '@/components/ModalBox.vue'
import Level from '@/components/Level.vue'
import JbButtons from '@/components/JbButtons.vue'
import JbButton from '@/components/JbButton.vue'
import Icon from '../Icon.vue'
import Field from '../Field.vue'
import Control from '../Control.vue'
import CheckRadioPicker from '../CheckRadioPicker.vue'
import FilePicker from '../FilePicker.vue'

const props = defineProps({
  checkable: Boolean,
  crud: {
    type: Boolean,
    default: false
  },
  endpoint: {
    type: String,
    default: '/menus/all'
  }
})

const emitter = useEmitter()
const mainStore = useMainStore()

const lightBorderStyle = computed(() => mainStore.lightBorderStyle)
const tableTrStyle = computed(() => mainStore.tableTrStyle)
const tableTrOddStyle = computed(() => mainStore.tableTrOddStyle)
const darkMode = computed(() => mainStore.darkMode)
const numPages = computed(() => Math.ceil(items.value.length / perPage.value))
const currentPageHuman = computed(() => currentPage.value + 1)
const itemsPaginated = computed(() => items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1)))
const pagesList = computed(() => {
  const pagesList = []
  for (let i = 0; i < numPages.value; i++) { pagesList.push(i) }
  return pagesList
})

const items = ref([])
const isModalActive = ref(false)
const isModalDangerActive = ref(false)
const perPage = ref(10)
const currentPage = ref(0)
const uploadedImage = ref(null)

const activeMenu = reactive({
  id: 0,
  name: '',
  description: '',
  price: 0,
  type: '',
  inStock: 'inStock'
})

const menuTypes = [
  { id: 1, label: 'food' },
  { id: 2, label: 'drink' }
]

const trimTo = (length, text) => {
  return String(text).slice(0, length) + '...'
}

const setActiveMenu = (menu) => {
  activeMenu.id = menu.id
  activeMenu.thumbnail = menu.thumbnail
  activeMenu.name = menu.name
  activeMenu.description = menu.description
  activeMenu.price = menu.price
  activeMenu.type = menuTypes.find(type => type.label === menu.type.toLowerCase())
  activeMenu.inStock = menu.inStock ? 'inStock' : 'outOfStock'
}

const resetActiveMenu = () => {
  activeMenu.id = 0
  activeMenu.name = ''
  activeMenu.thumbnail = ''
  activeMenu.description = ''
  activeMenu.price = 0
  activeMenu.type = ''
  activeMenu.inStock = 'inStock'
}

const onHandleMenu = (menuId, type = 'edit') => {
  const menu = items.value.find((item) => item.id === menuId)
  setActiveMenu(menu)

  if (['edit', 'create'].includes(type)) {
    isModalActive.value = true
  } else {
    isModalDangerActive.value = true
  }
}

const onDeleteMenu = () => {
  const menu = mapActiveMenu(activeMenu)
  console.log(menu.id)
}

const onUpdateMenu = () => {
  const menu = mapActiveMenu(activeMenu)
  console.log(menu)
}

const mapActiveMenu = (menu) => {
  return {
    id: menu.id,
    name: menu.name,
    thumbnail: menu.thumbnail,
    description: menu.description,
    price: menu.price,
    type: menu.type.label,
    inStock: menu.inStock === 'inStock'
  }
}

onMounted(async () => {
  const {
    data: { data: menus }
  } = await useFetch('get', props.endpoint)
  items.value = menus
})

emitter.on('refresh:menus', async () => {
  const {
    data: { data: menus }
  } = await useFetch('get', props.endpoint)
  items.value = menus
})
</script>

<template>
  <modal-box
    v-model="isModalActive"
    title="Ubah Menu"
    button-label="Simpan"
    @confirm="onUpdateMenu"
    @cancel="resetActiveMenu"
  >
    <img
      class="w-40 aspect-video object-cover"
      :src="activeMenu.thumbnail"
    >
    <file-picker v-model="uploadedImage" />

    <field label="Nama Menu">
      <control
        v-model="activeMenu.name"
        type="text"
        placeholder="Nama menu"
      />
    </field>

    <field label="Deskripsi Menu">
      <control
        v-model="activeMenu.description"
        type="textarea"
        placeholder="Deskripsi menu"
      />
    </field>

    <field label="Harga Menu">
      <control
        v-model="activeMenu.price"
        type="number"
        placeholder="Harga menu"
      />
    </field>

    <field label="Jenis Menu">
      <control
        v-model="activeMenu.type"
        placeholder="Jenis menu"
        :options="menuTypes"
      />
    </field>

    <field
      label="Checkbox"
      wrap-body
    >
      <check-radio-picker
        v-model="activeMenu.inStock"
        name="sample-radio"
        type="radio"
        :options="{ inStock: 'In Stock', outOfStock: 'Out Of Stock' }"
      />
    </field>
  </modal-box>

  <modal-box
    v-model="isModalDangerActive"
    button="danger"
    button-label="Ya, hapus"
    has-cancel
    large-title="Apakah anda yakin ingin menghapus menu ini?"
    @confirm="onDeleteMenu"
    @cancel="userId = ''"
  >
    <p>
      Jika pelanggan ini memiliki pesanan belum terselesaikan,
      <b>anda tidak dapat menghapus pelanggan ini.</b>
    </p>
    <p>
      Agar lebih aman, anda hanya dapat menghapus pelanggan yang telah
      mengakhiri pemesanan atau selesai mereservasi meja!
    </p>
    <p>
      Menghapus data pelanggan akan berdampak kepada pesanan, otomatis histori
      pesanan akan ikut terhapus.
    </p>
  </modal-box>

  <table>
    <thead>
      <tr>
        <th />
        <th>Nama Menu</th>
        <th>Deskripsi Menu</th>
        <th>Harga Menu</th>
        <th>Jenis Menu</th>
        <th>Status Menu</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <template v-if="itemsPaginated.length">
        <tr
          v-for="(menu, index) in itemsPaginated"
          :key="menu.id"
          :class="[tableTrStyle, index % 2 === 0 ? tableTrOddStyle : '']"
        >
          <td data-label="MenuImage">
            <img
              :alt="menu.name"
              class="w-8 h-8 object-cover"
              :src="menu.thumbnail"
            >
          </td>
          <td data-label="MenuName">
            {{ menu.name }}
          </td>
          <td data-label="MenuDescription">
            {{ trimTo(50, menu.description) }}
          </td>
          <td data-label="MenuPrice">
            {{ usePriceFormatter(menu.price) }}
          </td>
          <td data-label="MenuType">
            {{ menu.type[0].toUpperCase() + menu.type.slice(1).toLowerCase() }}
          </td>
          <td data-label="MenuStatus">
            {{ menu.inStock ? 'In Stock' : 'Out of Stock' }}
          </td>
          <td>
            <button @click="onHandleMenu(menu.id)">
              <icon :path="mdiFileEdit" />
            </button>
            <button @click="onHandleMenu(menu.id, 'delete')">
              <icon :path="mdiTrashCan" />
            </button>
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
