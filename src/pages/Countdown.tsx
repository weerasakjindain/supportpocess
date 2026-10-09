import { useEffect, useRef, useState } from 'react'
import { Page, FullscreenBtn, useHotkey } from '../components/ui'
import { useTicker } from '../hooks/useTicker'
import { fmt, toMs } from '../lib/time'
import { alarm, tick } from '../lib/sound'

const PRESETS = [1, 2, 3, 5, 10, 15, 20, 30]

export default function Countdown() {
  const [total, setTotal] = useState(5 * 60_000)
  const [left, setLeft] = useState(5 * 60_000)
  const [run, setRun] = useState(false)
  const [endAt, setEndAt] = useState(0)
  const [done, setDone] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const lastSec = useRef(-1)
  useTicker(run, 100)

  const ms = run ? Math.max(0, endAt - Date.now()) : left

  useEffect(() => {
    if (!run) return
    if (ms <= 0) { setRun(false); setLeft(0); setDone(true); alarm(); return }
    const s = Math.ceil(ms / 1000)
    if (s <= 5 && s !== lastSec.current) { lastSec.current = s; tick() }
  }, [ms, run])

  const start = () => { if (ms <= 0) return; setDone(false); setEndAt(Date.now() + ms); setRun(true) }
  const pause = () => { setLeft(ms); setRun(false) }
  const reset = () => { setRun(false); setLeft(total); setDone(false) }
  const setAll = (t: number) => { setRun(false); setTotal(t); setLeft(t); setDone(false) }
  const addMinute = () => {
    setDone(false)
    if (run) setEndAt(e => e + 60_000)
    else setLeft(l => l + 60_000)
  }
  useHotkey('Space', () => (run ? pause() : start()))

  const parts = [Math.floor(total / 3_600_000), Math.floor(total / 60_000) % 60, Math.floor(total / 1000) % 60]
  const pct = total ? Math.min(100, (ms / total) * 100) : 0
  const urgent = ms <= 10_000 && ms > 0

  return (
    <Page title="นาฬิกานับถอยหลัง" desc="Space = เริ่ม/พัก" right={<FullscreenBtn target={box} />}>
      <div ref={box} className={`card border-0 flex flex-col items-center justify-center py-14 gap-6 transition-colors text-white
        ${done ? 'bg-rose-600' : urgent ? 'bg-amber-500' : 'bg-slate-900'}`}>
        <div className={`digits text-[clamp(3rem,18vw,10rem)] leading-none ${urgent ? 'animate-pulse' : ''}`}>
          {done ? 'หมดเวลา!' : fmt(ms)}
        </div>
        <div className="w-4/5 h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-[width] duration-200" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-3">
          <button className="btn bg-white text-slate-900 hover:bg-slate-200 !px-8" onClick={run ? pause : start}>
            {run ? '⏸ พัก' : '▶ เริ่ม'}
          </button>
          <button className="btn-glass" onClick={reset}>↺ รีเซ็ต</button>
          <button className="btn-glass" onClick={addMinute}>+1 นาที</button>
        </div>
      </div>

      <div className="card space-y-3">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(m => <button key={m} className="btn-ghost !py-1" onClick={() => setAll(m * 60_000)}>{m} นาที</button>)}
        </div>
        <div className="flex gap-2 items-end">
          {['ชั่วโมง', 'นาที', 'วินาที'].map((lbl, i) => (
            <div key={lbl} className="flex-1">
              <label className="label">{lbl}</label>
              <input type="number" min={0} className="input digits" value={parts[i]}
                onChange={e => {
                  const v = [...parts]
                  v[i] = Math.max(0, +e.target.value || 0)
                  setAll(toMs(v[0], v[1], v[2]))
                }} />
            </div>
          ))}
        </div>
      </div>
    </Page>
  )
}
