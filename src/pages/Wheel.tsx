import { useEffect, useRef, useState } from 'react'
import { Page, Empty } from '../components/ui'
import { useActiveMembers } from '../hooks/useRoster'
import { randInt } from '../lib/random'
import { success, tick } from '../lib/sound'
import { saveResult } from '../db/repo'

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ef4444', '#84cc16']
const SPIN_MS = 5000

export default function Wheel() {
  const members = useActiveMembers()
  const [custom, setCustom] = useState('')
  const [removeWinner, setRemoveWinner] = useState(true)
  const [removed, setRemoved] = useState<string[]>([])
  const [rot, setRot] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const cv = useRef<HTMLCanvasElement>(null)

  const source = custom.trim()
    ? custom.split('\n').map(s => s.trim()).filter(Boolean)
    : members.map(m => m.name)
  const items = source.filter(n => !removed.includes(n))
  const key = items.join('|')

  useEffect(() => {
    const c = cv.current
    if (!c) return
    const ctx = c.getContext('2d')!
    const S = 520, R = S / 2
    c.width = c.height = S
    ctx.clearRect(0, 0, S, S)
    if (!items.length) return
    const seg = (Math.PI * 2) / items.length
    items.forEach((name, i) => {
      const a0 = i * seg - Math.PI / 2
      ctx.beginPath(); ctx.moveTo(R, R); ctx.arc(R, R, R - 6, a0, a0 + seg); ctx.closePath()
      ctx.fillStyle = COLORS[i % COLORS.length]; ctx.fill()
      ctx.save(); ctx.translate(R, R); ctx.rotate(a0 + seg / 2)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 18px "Noto Sans Thai", sans-serif'
      ctx.textAlign = 'right'; ctx.textBaseline = 'middle'
      ctx.fillText(name.slice(0, 18), R - 24, 0); ctx.restore()
    })
    ctx.beginPath(); ctx.arc(R, R, 34, 0, Math.PI * 2); ctx.fillStyle = '#0f172a'; ctx.fill()
  }, [key])

  const spin = () => {
    if (spinning || items.length < 2) return
    const pool = [...items]
    const idx = randInt(pool.length)
    const seg = 360 / pool.length
    const center = idx * seg + seg / 2
    setRot(r => {
      const cur = ((r % 360) + 360) % 360
      const need = (((360 - center - cur) % 360) + 360) % 360
      return r + 360 * (5 + randInt(3)) + need
    })
    setSpinning(true); setWinner(null); tick()
    setTimeout(() => {
      const name = pool[idx]
      setWinner(name); setSpinning(false); success()
      saveResult('wheel', 'วงล้อสุ่ม', { winner: name, pool })
      if (removeWinner) setRemoved(x => [...x, name])
    }, SPIN_MS + 200)
  }

  return (
    <Page title="วงล้อสุ่ม" desc={custom.trim() ? 'ใช้รายการที่พิมพ์เอง' : 'ใช้ชุดรายชื่อที่เลือกไว้'}>
      <div className="grid lg:grid-cols-[1fr,320px] gap-5">
        <div className="card flex flex-col items-center gap-4">
          {items.length < 2 ? <Empty>ต้องมีอย่างน้อย 2 รายการ เลือกชุดรายชื่อหรือพิมพ์รายการทางขวา</Empty> : (
            <div className="relative w-full max-w-[520px] aspect-square">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 text-3xl drop-shadow">🔻</div>
              <canvas ref={cv} className="w-full h-full"
                style={{ transform: `rotate(${rot}deg)`, transition: spinning ? `transform ${SPIN_MS}ms cubic-bezier(.17,.67,.14,1)` : 'none' }} />
              <button onClick={spin} disabled={spinning}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full
                           bg-slate-900 text-white font-bold border-4 border-white disabled:opacity-60">
                {spinning ? '...' : 'หมุน'}
              </button>
            </div>
          )}
          {winner && (
            <div className="text-center">
              <div className="text-sm text-slate-500">ผลที่ได้</div>
              <div className="text-4xl font-bold text-brand-600 animate-bounce">{winner}</div>
            </div>
          )}
        </div>

        <div className="card space-y-3 h-fit">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={removeWinner} onChange={e => setRemoveWinner(e.target.checked)} />
            ตัดรายการที่ออกแล้วออกจากวงล้อ
          </label>
          <div className="text-sm text-slate-500">เหลือ {items.length} รายการ · ออกไปแล้ว {removed.length}</div>
          {removed.length > 0 && (
            <button className="btn-ghost w-full !text-sm" onClick={() => { setRemoved([]); setWinner(null) }}>คืนรายการทั้งหมด</button>
          )}
          <label className="label">หรือพิมพ์รายการเอง (บรรทัดละรายการ)</label>
          <textarea className="input h-44 text-sm font-mono" value={custom}
            onChange={e => { setCustom(e.target.value); setRemoved([]) }}
            placeholder={'รางวัลที่ 1\nรางวัลที่ 2\nอดเลย'} />
        </div>
      </div>
    </Page>
  )
}
