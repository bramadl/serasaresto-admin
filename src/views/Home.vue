<script setup>
import { onMounted, ref } from 'vue'
import { mdiAccountMultiple, mdiCart, mdiFood } from '@mdi/js'

import { useFetch } from '@/composition/useFetch'
import MainSection from '@/components/MainSection.vue'
import TitleBar from '@/components/TitleBar.vue'
import HeroBar from '@/components/HeroBar.vue'
import CardWidget from '@/components/CardWidget.vue'
import CardComponent from '@/components/CardComponent.vue'
import ClientsTable from '@/components/ClientsTable.vue'
import TitleSubBar from '@/components/TitleSubBar.vue'

const titleStack = ref(['Beranda', 'Dashboard'])

const customerCount = ref(0)
const menuCount = ref(0)
const orderCount = ref(0)

onMounted(async () => {
  const { data: { data } } = await useFetch(
    'get',
    '/admin/dashboard/stats'
  )

  customerCount.value = data.customer_count
  menuCount.value = data.menu_count
  orderCount.value = data.order_count
})
</script>

<template>
  <title-bar :title-stack="titleStack" />

  <hero-bar>Dashboard</hero-bar>

  <main-section>
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
      <card-widget
        color="text-emerald-500"
        :icon="mdiAccountMultiple"
        :number="customerCount"
        label="Pelanggan"
      />
      <card-widget
        color="text-blue-500"
        :icon="mdiFood"
        :number="menuCount"
        label="Menu"
      />
      <card-widget
        color="text-red-500"
        :icon="mdiCart"
        :number="orderCount"
        label="Pesanan"
      />
    </div>

    <title-sub-bar
      :icon="mdiAccountMultiple"
      title="Pelanggan"
    />

    <card-component
      title="10 Daftar Pelanggan Terakhir"
      has-table
      :header-icon="false"
    >
      <clients-table />
    </card-component>
  </main-section>
</template>
