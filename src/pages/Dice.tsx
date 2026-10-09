import { useState } from 'react'
import { motion } from 'framer-motion'
import { Page } from '../components/ui'
import { randInt } from '../lib/random'
import { beep } from '../lib/sound'

const FACE = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅']

export default function Dice() {
  const [count, setCount] = useState(2)
  const [dice, setDice] = useState<number[]>([1, 1])
  const [rollId, setRollId] = useState(0)
  const [coin, setCoin] = useState<string | null>(null)
  const [range, setRange] = useState({ min: 1, max: 100 })
  const [num, setNum] = useState<number | null>(null)

  const roll = () => { setDice(Array.from({ length: count }, () => randInt(6) + 1)); setRollId(x => x + 1); beep(620, 90) }

  return (
    <Page title="ลูกเต๋า & เหรียญ" desc="ตัวช่วยสุ่มพื้นฐาน">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card text-center space-y-3">
          <h3 className="font-semibold">🎲 ลูกเต๋า</h3>
          <div className="flex justify-center gap-2 flex-wrap min-h-[72px] items-center">
            {dice.map((d, i) => (
              <motion.div key={`${rollId}-${i}`} initial={{ rotate: -90, scale: 0.5 }} animate={{ rotate: 0, scale: 1 }}
                className="text-6xl leading-none">{FACE[d - 1]}</motion.div>
            ))}
          </div>
          <div className="text-sm text-slate-500">รวม {dice.reduce((a, b) => a + b, 0)}</div>
          <label className="label">จำนวนลูกเต๋า</label>
          <input type="number" min={1} max={8} className="input digits" value={count}
            onChange={e => { const c = Math.min(8, Math.max(1, +e.target.value || 1)); setCount(c); setDice(Array(c).fill(1)) }} />
          <button className="btn-primary w-full" onClick={roll}>ทอย</button>
        </div>

        <div className="card text-center space-y-3">
          <h3 className="font-semibold">🪙 เหรียญ</h3>
          <div className="text-5xl font-bold min-h-[72px] flex items-center justify-center text-brand-600">{coin ?? '—'}</div>
          <button className="btn-primary w-full" onClick={() => { setCoin(randInt(2) ? 'หัว' : 'ก้อย'); beep(880, 90) }}>โยน</button>
        </div>

        <div className="card text-center space-y-3">
          <h3 className="font-semibold">🔢 สุ่มตัวเลข</h3>
          <div className="text-5xl font-bold min-h-[72px] flex items-center justify-center digits text-brand-600">{num ?? '—'}</div>
          <div className="flex gap-2">
            <input type="number" className="input digits" value={range.min} onChange={e => setRange(r => ({ ...r, min: +e.target.value }))} />
            <input type="number" className="input digits" value={range.max} onChange={e => setRange(r => ({ ...r, max: +e.target.value }))} />
          </div>
          <button className="btn-primary w-full" onClick={() => {
            const lo = Math.min(range.min, range.max), hi = Math.max(range.min, range.max)
            setNum(lo + randInt(hi - lo + 1)); beep(1000, 90)
          }}>สุ่ม</button>
        </div>
      </div>
    </Page>
  )
}
