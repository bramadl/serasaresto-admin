import axios from 'axios'

export const httpClient = axios.create({
  baseURL: 'http://localhost:8000/api'
})

httpClient.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('auth._token.local')}`
  return config
}, (error) => {
  return Promise.reject(error)
})
