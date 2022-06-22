import { ref } from 'vue'
import { httpClient } from '@/api/httpClient'

export async function useFetch (method, url, options) {
  const data = ref()
  const error = ref(false)

  try {
    const response = await httpClient[method](url, { ...options })
    data.value = response.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Internal server error.'
  }

  return {
    data: data.value,
    error: error.value
  }
}
