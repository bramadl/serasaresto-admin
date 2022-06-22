import { defineStore } from 'pinia'
import * as styles from '@/styles'
import { darkModeKey, styleKey } from '@/config'
import axios from 'axios'

export const useMainStore = defineStore('main', {
  state: () => ({
    /* Styles */
    style: '',
    bodyStyle: '',
    lightBorderStyle: '',
    lightBgStyle: '',
    asideStyle: '',
    asideBrandStyle: '',
    asideMenuCloseLgStyle: '',
    asideMenuLabelStyle: '',
    asideMenuItemStyle: '',
    asideMenuItemActiveStyle: '',
    asideMenuItemInactiveStyle: '',
    asideSubmenuListStyle: '',
    navBarItemLabelStyle: '',
    navBarItemLabelHoverStyle: '',
    navBarItemLabelActiveColorStyle: '',
    navBarMenuListUpperLabelStyle: '',
    tableTrStyle: '',
    tableTrOddStyle: '',
    overlayStyle: '',

    /* User */
    userName: null,
    userEmail: null,
    userAvatar: null,
    userLastLoggedInAt: null,
    userToken: null,

    /* fullScreen - fullscreen form layout (e.g. login page) */
    isFullScreen: true,

    /* Aside */
    isAsideMobileExpanded: false,
    isAsideLgActive: false,

    /* Dark mode */
    darkMode: true,

    /* Field focus with ctrl+k (to register only once) */
    isFieldFocusRegistered: false,

    /* Sample data (commonly used) */
    clients: [],
    history: []
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.userToken)
  },
  actions: {
    setUser (payload) {
      if (!payload) {
        this.userName = null
        this.userEmail = null
        this.userAvatar = null
        this.userLastLoggedInAt = null
      } else {
        this.userName = payload.name
        this.userEmail = payload.email
        this.userAvatar = payload.avatar || 'https://avatars.dicebear.com/api/avataaars/example.svg?options[top][]=shortHair&options[accessoriesChance]=93'
        this.userLastLoggedInAt = payload.lastLoggedInAt
      }
    },

    setUserToken (payload) {
      this.userToken = payload
      localStorage.setItem('auth._token.local', payload)
    },

    setStyle (payload) {
      if (!styles[payload]) {
        return
      }

      this.style = payload

      const style = styles[payload]

      document.body.className = style.body

      if (localStorage[styleKey] !== payload) {
        localStorage.setItem(styleKey, payload)
      }

      for (const key in style) {
        this[`${key}Style`] = style[key]
      }
    },

    asideMobileToggle (payload = null) {
      const isShow = payload !== null ? payload : !this.isAsideMobileExpanded

      document.getElementById('app').classList[isShow ? 'add' : 'remove']('ml-60', 'lg:ml-0')

      document.documentElement.classList[isShow ? 'add' : 'remove']('m-clipped')

      this.isAsideMobileExpanded = isShow
    },

    asideLgToggle (payload = null) {
      this.isAsideLgActive = payload !== null ? payload : !this.isAsideLgActive
    },

    fullScreenToggle (payload) {
      this.isFullScreen = payload

      document.documentElement.classList[payload ? 'add' : 'remove']('full-screen')
    },

    setDarkMode (payload = null) {
      const value = payload !== null ? payload : !this.darkMode

      document.documentElement.classList[value ? 'add' : 'remove']('dark')

      localStorage.setItem(darkModeKey, value ? '1' : '0')

      this.darkMode = value
    },

    fetch (sampleDataKey) {
      axios
        .get(`data-sources/${sampleDataKey}.json`)
        .then(r => {
          if (r.data && r.data.data) {
            this[sampleDataKey] = r.data.data
          }
        })
        .catch(error => {
          alert(error.message)
        })
    },

    fetchUser () {
      axios.get('http://localhost:8000/api/admin/profile', { headers: { Authorization: `Bearer ${this.userToken}` } })
        .then((data) => {
          const { data: { data: user } } = data
          this.setUser(user)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
})
