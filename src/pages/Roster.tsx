import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Page, Empty } from '../components/ui'
import { useApp, useRosters } from '../hooks/useRoster'
import { addMembersBulk, createRoster, deleteRoster, membersOf, removeMember, renameRoster, toggleMember } from '../db/repo'
import { exportCSV } from '../lib/file'

export default function Roster() {
  const { rosterId, setRoster } = useApp()
  const rosters = useRosters()
  const members = useLiveQuery(() => (rosterId ? membersOf(rosterId) : Promise.resolve([])), [rosterId]) ?? []
  const [bulk, setBulk] = useState('')
  const lines = bulk.split('\n').filter(s => s.trim()).length

  const addRoster = async () => {
    const name = prompt('ชื่อชุดรายชื่อ เช่น "ม.4/2" หรือ "ทีมการตลาด"')?.trim()
    if (name) setRoster(await createRoster(name))
  }

  const submitBulk = async () => {
    if (!rosterId || !bulk.trim()) return
    await addMembersBulk(rosterId, bulk)
    setBulk('')
  }

  return (
    <Page title="จัดการรายชื่อ" desc="แก้ที่นี่ที่เดียว ใช้ได้ทุกเครื่องมือ"
      right={<button className="btn-primary" onClick={addRoster}>+ ชุดใหม่</button>}>

      <div className="flex flex-wrap gap-2">
        {rosters.map(r => (
          <button key={r.id} onClick={() => setRoster(r.id)}
            className={r.id === rosterId ? 'btn-primary' : 'btn-ghost'}>{r.name}</button>
        ))}
      </div>

      {!rosterId ? <Empty>ยังไม่ได้เลือกชุดรายชื่อ กด “+ ชุดใหม่” เพื่อเริ่ม</Empty> : (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="card space-y-3">
            <label className="label">เพิ่มรายชื่อ บรรทัดละคน (ใส่ทีมได้: <code>ชื่อ, ทีม</code>)</label>
            <textarea className="input h-56 font-mono text-sm" value={bulk} onChange={e => setBulk(e.target.value)}
              placeholder={'สมชาย ใจดี, ทีมแดง\nสมหญิง รักเรียน, ทีมน้ำเงิน\nวิชัย มานะ'} />
            <div className="flex gap-2">
              <button className="btn-primary flex-1" onClick={submitBulk} disabled={!lines}>เพิ่ม {lines} รายชื่อ</button>
              <button className="btn-ghost" onClick={() => exportCSV('members.csv',
                [['ชื่อ', 'ทีม', 'ใช้งาน'], ...members.map(m => [m.name, m.meta.team ?? '', m.active ? 'ใช่' : 'ไม่'])])}>⬇ CSV</button>
            </div>
            <button className="btn-danger w-full !text-sm" onClick={async () => {
              if (confirm('ลบชุดรายชื่อนี้ทั้งหมด?')) { await deleteRoster(rosterId); setRoster(null) }
            }}>ลบชุดนี้</button>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">รายชื่อ ({members.filter(m => m.active).length}/{members.length} ใช้งาน)</h3>
              <button className="btn-ghost !py-1 !text-xs" onClick={() => {
                const n = prompt('เปลี่ยนชื่อชุดเป็น')?.trim()
                if (n) renameRoster(rosterId, n)
              }}>เปลี่ยนชื่อชุด</button>
            </div>
            <ul className="space-y-1 max-h-96 overflow-auto">
              {members.map((m, i) => (
                <li key={m.id} className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${m.active ? 'bg-slate-100 dark:bg-slate-800' : 'opacity-40'}`}>
                  <span className="text-xs text-slate-400 w-6">{i + 1}</span>
                  <span className="flex-1 truncate">{m.name}</span>
                  {m.meta.team && <span className="text-xs bg-brand-500/20 text-brand-600 dark:text-brand-500 px-1.5 rounded">{m.meta.team}</span>}
                  <button className="text-xs" title="เปิด/ปิดการใช้งาน" onClick={() => toggleMember(m)}>{m.active ? '👁️' : '🚫'}</button>
                  <button className="text-xs text-rose-500" onClick={() => removeMember(m.id)}>✕</button>
                </li>
              ))}
              {!members.length && <li className="text-slate-500 text-sm py-6 text-center">ยังไม่มีรายชื่อ</li>}
            </ul>
          </div>
        </div>
      )}
    </Page>
  )
}
