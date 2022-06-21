import {
  mdiDesktopMac,
  mdiFoodForkDrink,
  mdiFaceAgent,
  mdiFileTableBoxMultiple,
  mdiCartVariant
} from '@mdi/js'

export default [
  'Umum',
  [
    {
      to: '/dashboard',
      icon: mdiDesktopMac,
      label: 'Beranda'
    }
  ],
  'Restoran',
  [
    {
      to: '/daftar-pelanggan',
      label: 'Daftar Pelanggan',
      icon: mdiFaceAgent
    },
    {
      to: '/daftar-menu',
      label: 'Daftar Menu',
      icon: mdiFoodForkDrink
    },
    {
      to: '/daftar-meja',
      label: 'Daftar Meja',
      icon: mdiFileTableBoxMultiple
    },
    {
      to: '/daftar-pemesanan',
      label: 'Daftar Pemesanan',
      icon: mdiCartVariant
    }
  ]
]
