import { utils, writeFile } from 'xlsx'

export function usePrint (data, fileTitle = 'export') {
  const filename = `${fileTitle}.xlsx`
  const ws = utils.json_to_sheet(data)
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, fileTitle)
  writeFile(wb, filename)
}
