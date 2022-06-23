export function usePriceFormatter (value) {
  const valueToString = String(value).replace(/[^,\d]/g, '').toString()
  const split = valueToString.split(',')
  const modulo = split[0].length % 3
  let rupiah = split[0].substr(0, modulo)
  const ribuan = split[0].substr(modulo).match(/\d{3}/gi)

  if (ribuan) {
    const separator = modulo ? '.' : ''
    rupiah += separator + ribuan.join('.')
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah
  return `Rp ${rupiah}`
}
