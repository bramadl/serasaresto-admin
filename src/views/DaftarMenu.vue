<script setup>
import { reactive, ref } from 'vue'

import { useFetch } from '@/composition/useFetch'
import { usePrint } from '@/composition/usePrint'
import CardComponent from '@/components/CardComponent.vue'
import HeroBar from '@/components/HeroBar.vue'
import JbButton from '@/components/JbButton.vue'
import ListOfMenus from '@/components/Tables/ListOfMenus.vue'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'
import ModalBox from '@/components/ModalBox.vue'
import FilePicker from '@/components/FilePicker.vue'
import Field from '@/components/Field.vue'
import Control from '@/components/Control.vue'
import CheckRadioPicker from '@/components/CheckRadioPicker.vue'

const titleStack = ref(['Beranda', 'Daftar Menu'])
const isModalActive = ref(false)
const uploadedImage = ref(null)

const menuTypes = [
  { id: 1, label: 'food' },
  { id: 2, label: 'drink' }
]

const activeMenu = reactive({
  id: 0,
  name: '',
  description: '',
  price: 0,
  type: menuTypes[0],
  inStock: 'inStock'
})

const resetActiveMenu = () => {
  activeMenu.id = 0
  activeMenu.name = ''
  activeMenu.thumbnail = ''
  activeMenu.description = ''
  activeMenu.price = 0
  activeMenu.type = ''
  activeMenu.inStock = 'inStock'
}

// eslint-disable-next-line no-unused-vars
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

const onCreateMenu = () => {
  //
}

const handleOnPrint = async () => {
  const { data } = await useFetch('get', '/menus/all')
  usePrint(data.data, 'daftar-menu')
}
</script>

<template>
  <title-bar :title-stack="titleStack" />

  <hero-bar>
    Daftar Menu

    <template #tool>
      <jb-button
        color="success"
        label="Tambah Menu"
        @click="isModalActive = true"
      />
    </template>
  </hero-bar>

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

  <modal-box
    v-model="isModalActive"
    title="Tambah Menu"
    button-label="Simpan"
    @confirm="onCreateMenu"
    @cancel="resetActiveMenu"
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
</template>
