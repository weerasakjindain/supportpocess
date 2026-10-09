import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Page } from '../components/ui'
import { pick } from '../lib/random'
import { beep } from '../lib/sound'

const BANK: Record<string, string[]> = {
  'ละลายพฤติกรรม': [
    'ถ้าเลือกกินอาหารได้แค่อย่างเดียวไปตลอดชีวิต จะเลือกอะไร',
    'ความสามารถพิเศษที่คนอื่นไม่ค่อยรู้ของคุณคืออะไร',
    'ที่เที่ยวที่อยากไปที่สุดตอนนี้ และทำไม',
    'เพลงที่ฟังบ่อยที่สุดในเดือนที่ผ่านมา',
    'ถ้ามีพลังพิเศษได้ 1 อย่าง จะขออะไร',
    'สิ่งเล็ก ๆ อะไรที่ทำให้วันของคุณดีขึ้นได้ทันที',
  ],
  'สะท้อนการเรียนรู้': [
    'วันนี้คุณได้เรียนรู้อะไรที่ไม่คาดคิดมาก่อน',
    'สิ่งที่คุณจะนำไปใช้ทันทีหลังจบกิจกรรมนี้คืออะไร',
    'ถ้าย้อนกลับไปทำใหม่ได้ คุณจะเปลี่ยนอะไร',
    'ช่วงไหนของวันนี้ที่คุณรู้สึกมีส่วนร่วมมากที่สุด',
  ],
  'ทำความรู้จักทีม': [
    'คุณทำงานได้ดีที่สุดในบรรยากาศแบบไหน',
    'คุณอยากได้ feedback แบบไหนจากเพื่อนร่วมทีม',
    'สิ่งที่คุณภูมิใจที่สุดในงานปีนี้คืออะไร',
  ],
}

export default function Questions() {
  const [cat, setCat] = useState(Object.keys(BANK)[0])
  const [extra, setExtra] = useState('')
  const [q, setQ] = useState<string | null>(null)

  const pool = [...BANK[cat], ...extra.split('\n').map(s => s.trim()).filter(Boolean)]
  const next = () => {
    const rest = pool.filter(x => x !== q)
    setQ(pick(rest.length ? rest : pool) ?? null)
    beep(760, 120)
  }

  return (
    <Page title="กล่องคำถาม" desc="สุ่มคำถามเปิดวง สะท้อนการเรียนรู้ หรือทำความรู้จักทีม">
      <div className="card flex flex-wrap gap-2">
        {Object.keys(BANK).map(c => (
          <button key={c} className={c === cat ? 'btn-primary' : 'btn-ghost'} onClick={() => { setCat(c); setQ(null) }}>{c}</button>
        ))}
      </div>

      <div className="card border-0 bg-gradient-to-br from-brand-600 to-indigo-900 text-white min-h-[260px] flex flex-col items-center justify-center gap-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div key={q ?? 'empty'} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="text-2xl md:text-3xl font-semibold leading-relaxed px-4">
            {q ?? 'กดปุ่มเพื่อสุ่มคำถาม'}
          </motion.div>
        </AnimatePresence>
        <button className="btn bg-white text-slate-900 !px-8" onClick={next}>💬 สุ่มคำถาม</button>
      </div>

      <div className="card">
        <label className="label">เพิ่มคำถามของคุณเอง (บรรทัดละข้อ จะรวมกับหมวดที่เลือก)</label>
        <textarea className="input h-24 text-sm" value={extra} onChange={e => setExtra(e.target.value)} />
      </div>
    </Page>
  )
}
