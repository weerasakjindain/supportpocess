import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Page } from '../components/ui'
import { useActiveMembers } from '../hooks/useRoster'
import { beep } from '../lib/sound'
import { saveResult } from '../db/repo'

interface Row { id: string; name: string; score: number }
const KEY = 'toolkit-scoreboard'

export default function Scoreboard() {
  const members = useActiveMembers()
  const [rows, setRows] = useState<Row[]>(() => JSON.parse(localStorage.getItem(KEY) || '[]'))
  const [step, setStep] = useState(1)

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(rows)) }, [rows])

  const add = (name: string) => { if (name) setRows(r => [...r, { id: crypto.randomUUID(), name, score: 0 }]) }
  const bump = (id: string, d: number) => {
    setRows(r => r.map(x => (x.id === id ? { ...x, score: x.score + d } : x)))
    beep(d > 0 ? 880 : 400, 80)
  }
  const ranked = [...rows].sort((a, b) => b.score - a.score)

  return (
    <Page title="กระดานคะแนน" desc="จัดอันดับให้อัตโนมัติ ปิดหน้าไปแล้วคะแนนก็ยังอยู่"
      right={<button className="btn-primary" onClick={() => add(prompt('ชื่อทีม/ผู้เล่น')?.trim() || '')}>+ เพิ่ม</button>}>

      <div className="card flex flex-wrap gap-3 items-end">
        <div>
          <label className="label">บวก/ลบครั้งละ</label>
          <input type="number" className="input digits !w-24" value={step} onChange={e => setStep(+e.target.value || 1)} />
        </div>
        <button className="btn-ghost" disabled={!members.length} onClick={() => members.forEach(m => add(m.name))}>
          นำเข้าจากชุดรายชื่อ ({members.length})
        </button>
        <button className="btn-ghost" onClick={() => setRows(r => r.map(x => ({ ...x, score: 0 })))}>รีเซ็ตคะแนน</button>
        <button className="btn-danger ml-auto" disabled={!rows.length} onClick={() => {
          if (!confirm('บันทึกผลลงประวัติแล้วล้างกระดาน?')) return
          saveResult('scoreboard', 'กระดานคะแนน', ranked.map((r, i) => ({ rank: i + 1, name: r.name, score: r.score })))
          setRows([])
        }}>บันทึกลงประวัติ & ล้าง</button>
      </div>

      <div className="space-y-2">
        {ranked.map((r, i) => (
          <motion.div key={r.id} layout className={`card flex items-center gap-3 !py-3
            ${i === 0 && r.score > 0 ? '!border-amber-400 !bg-amber-50 dark:!bg-amber-950/30' : ''}`}>
            <span className="text-2xl w-10 text-center">{['🥇', '🥈', '🥉'][i] ?? i + 1}</span>
            <span className="flex-1 font-semibold truncate">{r.name}</span>
            <span className="digits text-3xl font-bold w-20 text-right">{r.score}</span>
            <button className="btn-ghost !px-3" onClick={() => bump(r.id, -step)}>−</button>
            <button className="btn-primary !px-3" onClick={() => bump(r.id, step)}>+</button>
            <button className="text-rose-500 text-sm px-1" onClick={() => setRows(x => x.filter(y => y.id !== r.id))}>✕</button>
          </motion.div>
        ))}
        {!rows.length && <div className="card text-center text-slate-500 py-10">ยังไม่มีผู้เล่น กด “+ เพิ่ม” หรือนำเข้าจากชุดรายชื่อ</div>}
      </div>
    </Page>
  )
}
