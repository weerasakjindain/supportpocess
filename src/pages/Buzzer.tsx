import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Page } from '../components/ui'
import { useActiveMembers } from '../hooks/useRoster'
import { beep } from '../lib/sound'

const KEYS = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P']

export default function Buzzer() {
  const members = useActiveMembers()
  const [players, setPlayers] = useState<string[]>(['ทีม 1', 'ทีม 2', 'ทีม 3', 'ทีม 4'])
  const [order, setOrder] = useState<string[]>([])
  const [armed, setArmed] = useState(true)

  const press = (name: string) => {
    if (!armed || order.includes(name)) return
    beep(order.length === 0 ? 1200 : 600, order.length === 0 ? 300 : 120)
    setOrder(o => [...o, name])
  }
  const clear = () => { setOrder([]); setArmed(true) }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return
      if (e.code === 'Space') { e.preventDefault(); clear(); return }
      const i = KEYS.indexOf(e.key.toUpperCase())
      if (i >= 0 && players[i]) press(players[i])
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  return (
    <Page title="กดชิงตอบ" desc="กดปุ่ม Q W E R T… ตามลำดับผู้เล่น · Space = เริ่มรอบใหม่">
      <div className="card bg-slate-900 text-white py-8 min-h-[180px]">
        {order.length ? (
          <ol className="space-y-2">
            {order.map((n, i) => (
              <motion.li key={n} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                className={`flex items-center gap-3 ${i === 0 ? 'text-4xl font-bold text-amber-400' : 'text-lg opacity-70'}`}>
                <span className="w-10">{i + 1}.</span>{n}
              </motion.li>
            ))}
          </ol>
        ) : <div className="text-center text-slate-500 text-xl py-10">{armed ? 'พร้อมรับการกด…' : '🔒 ล็อกปุ่มอยู่'}</div>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {players.map((p, i) => (
          <button key={p + i} onClick={() => press(p)} disabled={order.includes(p)}
            className={`card !p-4 text-center active:scale-95 transition ${order.includes(p) ? 'opacity-40' : 'hover:border-brand-500'}`}>
            <div className="text-xs text-slate-400 mb-1">[{KEYS[i]}]</div>
            <div className="font-semibold truncate">{p}</div>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn-primary flex-1" onClick={clear}>รอบใหม่ (Space)</button>
        <button className="btn-ghost" onClick={() => setArmed(a => !a)}>{armed ? '🔒 ล็อกปุ่ม' : '🔓 ปลดล็อก'}</button>
        <button className="btn-ghost" disabled={!members.length}
          onClick={() => { setPlayers(members.slice(0, 10).map(m => m.name)); clear() }}>ใช้ชุดรายชื่อ (สูงสุด 10)</button>
        <button className="btn-ghost" onClick={() => {
          const n = prompt('ชื่อผู้เล่น คั่นด้วยเครื่องหมายจุลภาค (,)', players.join(', '))
          if (n !== null) { setPlayers(n.split(',').map(s => s.trim()).filter(Boolean).slice(0, 10)); clear() }
        }}>แก้ผู้เล่น</button>
      </div>
    </Page>
  )
}
