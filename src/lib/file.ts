import { db } from '../db/db'

function download(name: string, data: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** CSV ที่เปิดใน Excel แล้วภาษาไทยไม่เพี้ยน */
export const exportCSV = (name: string, rows: (string | number)[][]) =>
  download(name, '\uFEFF' + rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n'), 'text/csv')

export async function backupAll() {
  const dump: Record<string, unknown> = { version: 1, exportedAt: new Date().toISOString() }
  for (const t of db.tables) dump[t.name] = await t.toArray()
  download(`toolkit-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(dump, null, 2), 'application/json')
}

export async function restoreAll(file: File) {
  const d = JSON.parse(await file.text())
  await db.transaction('rw', db.tables, async () => {
    for (const t of db.tables) {
      await t.clear()
      if (Array.isArray(d[t.name])) await t.bulkAdd(d[t.name])
    }
  })
}
