import { useState } from 'react'
import { motion } from 'framer-motion'
import { Page } from '../components/ui'
import { useActiveMembers } from '../hooks/useRoster'
import { shuffle } from '../lib/random'
import { beep, success } from '../lib/sound'

export default function Cards() {
  const members = useActiveMembers()
  const [raw, setRaw] = useState('')
  const [deck, setDeck] = useState<string[]>([])
  const [open, setOpen] = useState<number[]>([])

  const build = () => {
    const src = raw.trim() ? raw.split('\n').map(s => s.trim()).filter(Boolean) : members.map(m => m.name)
    setDeck(shuffle(src)); setOpen([])
  }
  const flip = (i: number) => {
    if (open.includes(i)) return
    setOpen(o => [...o, i]); beep(700, 120)
    if (open.length + 1 === deck.length) setTimeout(success, 400)
  }

  return (
    <Page title="เปิดการ์ด" desc="พลิกการ์ดเพื่อเผยผล ใช้ได้กับชื่อ ภารกิจ คำถาม หรือรางวัล"
      right={<button className="btn-primary" onClick={build}>🔀 สับการ์ด</button>}>

      <div className="card">
        <label className="label">ข้อความบนการ์ด (ถ้าเว้นว่างจะใช้ชุดรายชื่อ · {members.length} คน)</label>
        <textarea className="input h-24 text-sm font-mono" value={raw} onChange={e => setRaw(e.target.value)}
          placeholder={'ภารกิจ: เต้น 10 วินาที\nภารกิจ: เล่าเรื่องตลก\nโชคดี! ข้ามได้เลย'} />
      </div>

      {deck.length === 0 ? (
        <div className="card text-center text-slate-500 py-10">กด “สับการ์ด” เพื่อเริ่ม</div>
      ) : (
        <>
          <div className="text-sm text-slate-500">
            เปิดแล้ว {open.length} / {deck.length} ใบ
            {open.length > 0 && <button className="btn-ghost !py-0.5 !px-2 !text-xs ml-2" onClick={() => setOpen([])}>คว่ำทั้งหมด</button>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3" style={{ perspective: 1000 }}>
            {deck.map((txt, i) => {
              const flipped = open.includes(i)
              return (
                <motion.button key={i} onClick={() => flip(i)}
                  animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.45 }}
                  className="relative aspect-[3/4] rounded-2xl" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-900 text-white flex items-center justify-center text-5xl shadow-lg"
                    style={{ backfaceVisibility: 'hidden' }}>?</div>
                  <div className="absolute inset-0 rounded-2xl bg-white dark:bg-slate-800 border-2 border-brand-500 flex items-center justify-center p-3 text-center font-semibold shadow-lg"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>{txt}</div>
                </motion.button>
              )
            })}
          </div>
        </>
      )}
    </Page>
  )
}
