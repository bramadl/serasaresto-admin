import { httpClient } from './httpClient'

export const httpRequest = {
  adminLogin: async (email, password) => {
    let data, error

    try {
      const response = await httpClient.post('/admin/login', {
        email,
        password
      })

      data = response.data
    } catch (err) {
      error = err.response?.data?.message || 'Internal server error.'
    }

    return { data, error }
  },

  getAdminProfile: async () => {
    let data, error

    try {
      const response = await httpClient.get('/admin/profile')

      data = response.data
    } catch (err) {
      error = err.response?.data?.message || 'Internal server error.'
    }

    return { data, error }
  }
}
