import { useState } from 'react'
import { motion } from 'framer-motion'
import { Page, Empty } from '../components/ui'
import { useActiveMembers } from '../hooks/useRoster'
import { makeGroups } from '../lib/random'
import { success } from '../lib/sound'
import { saveResult } from '../db/repo'
import { exportCSV } from '../lib/file'
import type { Member } from '../db/db'

const NAMES = ['แดง', 'น้ำเงิน', 'เขียว', 'เหลือง', 'ม่วง', 'ส้ม', 'ชมพู', 'ฟ้า', 'เทา', 'ทอง']
const gName = (i: number) => (NAMES[i] ? `กลุ่ม${NAMES[i]}` : `กลุ่ม ${i + 1}`)

export default function Grouping() {
  const members = useActiveMembers()
  const [mode, setMode] = useState<'count' | 'size'>('count')
  const [val, setVal] = useState(4)
  const [balance, setBalance] = useState(false)
  const [groups, setGroups] = useState<Member[][]>([])

  const run = () => {
    const g = makeGroups(members, {
      ...(mode === 'count' ? { groupCount: val } : { groupSize: val }),
      balanceKey: balance ? 'team' : undefined,
    }) as Member[][]
    setGroups(g); success()
    saveResult('grouping', 'สุ่มกลุ่ม', g.map((x, i) => ({ group: gName(i), members: x.map(m => m.name) })))
  }

  if (!members.length) return <Page title="สุ่มกลุ่ม"><Empty>เลือกชุดรายชื่อก่อนที่หน้า “จัดการรายชื่อ”</Empty></Page>

  return (
    <Page title="สุ่มกลุ่ม" desc={`สมาชิกที่ใช้งาน ${members.length} คน`}>
      <div className="card flex flex-wrap gap-4 items-end">
        <div>
          <label className="label">แบ่งโดย</label>
          <select className="input !w-44" value={mode} onChange={e => setMode(e.target.value as 'count' | 'size')}>
            <option value="count">กำหนดจำนวนกลุ่ม</option>
            <option value="size">กำหนดคนต่อกลุ่ม</option>
          </select>
        </div>
        <div>
          <label className="label">{mode === 'count' ? 'จำนวนกลุ่ม' : 'คนต่อกลุ่ม'}</label>
          <input type="number" min={1} max={members.length} className="input digits !w-24" value={val}
            onChange={e => setVal(Math.max(1, +e.target.value || 1))} />
        </div>
        <label className="flex items-center gap-2 text-sm pb-2">
          <input type="checkbox" checked={balance} onChange={e => setBalance(e.target.checked)} /> คละคนจาก “ทีม” เดียวกันให้กระจาย
        </label>
        <button className="btn-primary ml-auto !px-8" onClick={run}>🔀 สุ่มกลุ่ม</button>
        {groups.length > 0 && (
          <button className="btn-ghost" onClick={() => exportCSV('groups.csv',
            [['กลุ่ม', 'สมาชิก'], ...groups.flatMap((g, i) => g.map(m => [gName(i), m.name]))])}>⬇ CSV</button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((g, i) => (
          <motion.div key={i + g.map(m => m.id).join()} className="card"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-brand-600">{gName(i)}</h3>
              <span className="text-xs text-slate-400">{g.length} คน</span>
            </div>
            <ul className="space-y-1 text-sm">
              {g.map(m => (
                <li key={m.id} className="flex gap-2">
                  <span className="text-slate-400">•</span>{m.name}
                  {m.meta.team && <span className="text-xs text-slate-400 ml-auto">{m.meta.team}</span>}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Page>
  )
}
