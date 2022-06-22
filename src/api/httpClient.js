import axios from 'axios'

import { useMainStore } from '@/stores/main'

const mainStore = useMainStore()

export const httpClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    Authorization: `Bearer ${mainStore.userToken}`
  }
})
