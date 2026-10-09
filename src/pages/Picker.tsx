import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Page, Empty, useHotkey } from '../components/ui'
import { useActiveMembers } from '../hooks/useRoster'
import { pickMany } from '../lib/random'
import { success, tick } from '../lib/sound'
import { saveResult } from '../db/repo'

export default function Picker() {
  const members = useActiveMembers()
  const [n, setN] = useState(1)
  const [noRepeat, setNoRepeat] = useState(true)
  const [used, setUsed] = useState<string[]>([])
  const [picked, setPicked] = useState<string[]>([])
  const [rolling, setRolling] = useState(false)

  const pool = members.map(m => m.name).filter(x => !noRepeat || !used.includes(x))

  const draw = () => {
    if (!pool.length || rolling) return
    const size = Math.min(n, pool.length)
    setRolling(true)
    let i = 0
    const anim = setInterval(() => {
      setPicked(pickMany(pool, size)); tick()
      if (++i < 14) return
      clearInterval(anim)
      const res = pickMany(pool, size)
      setPicked(res); setRolling(false); success()
      if (noRepeat) setUsed(u => [...u, ...res])
      saveResult('picker', 'สุ่มรายชื่อ', { picked: res })
    }, 70)
  }
  useHotkey('Space', draw)

  if (!members.length) return <Page title="สุ่มรายชื่อ"><Empty>เลือกชุดรายชื่อก่อนที่หน้า “จัดการรายชื่อ”</Empty></Page>

  return (
    <Page title="สุ่มรายชื่อ" desc="Space = สุ่ม">
      <div className="card bg-slate-900 text-white py-16 flex flex-col items-center gap-4 min-h-[340px] justify-center">
        <AnimatePresence mode="popLayout">
          {picked.length ? picked.map((name, i) => (
            <motion.div key={name + i} layout initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="text-[clamp(2rem,7vw,4rem)] font-bold leading-tight text-center">{name}</motion.div>
          )) : <div className="text-slate-500 text-xl">กดปุ่มเพื่อเริ่มสุ่ม</div>}
        </AnimatePresence>
        <button className="btn bg-white text-slate-900 !px-10 !py-3 text-lg mt-4" onClick={draw} disabled={!pool.length || rolling}>
          🎯 สุ่ม{n > 1 ? ` ${n} คน` : ''}
        </button>
      </div>

      <div className="card flex flex-wrap gap-4 items-end">
        <div>
          <label className="label">สุ่มครั้งละกี่คน</label>
          <input type="number" min={1} max={50} className="input digits !w-24" value={n}
            onChange={e => setN(Math.max(1, +e.target.value || 1))} />
        </div>
        <label className="flex items-center gap-2 text-sm pb-2">
          <input type="checkbox" checked={noRepeat} onChange={e => setNoRepeat(e.target.checked)} /> ไม่สุ่มซ้ำคนเดิม
        </label>
        <div className="text-sm text-slate-500 pb-2 ml-auto">เหลือ {pool.length} / {members.length} คน</div>
        {used.length > 0 && <button className="btn-ghost !py-1 !text-sm" onClick={() => setUsed([])}>รีเซ็ตคนที่ออกแล้ว</button>}
      </div>

      {used.length > 0 && (
        <div className="card">
          <h3 className="font-semibold mb-2 text-sm text-slate-500">ออกไปแล้ว ({used.length})</h3>
          <div className="flex flex-wrap gap-1.5">
            {used.map((u, i) => <span key={i} className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-lg">{u}</span>)}
          </div>
        </div>
      )}
    </Page>
  )
}
