import axios from 'axios'

export const httpClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('auth._token.local')}`
  }
})
