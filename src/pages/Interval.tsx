import { useEffect, useRef, useState } from 'react'
import { Page, FullscreenBtn } from '../components/ui'
import { useTicker } from '../hooks/useTicker'
import { fmt } from '../lib/time'
import { beep, success } from '../lib/sound'

export default function Interval() {
  const [work, setWork] = useState(60)
  const [rest, setRest] = useState(20)
  const [rounds, setRounds] = useState(6)
  const [run, setRun] = useState(false)
  const [phase, setPhase] = useState<'work' | 'rest'>('work')
  const [round, setRound] = useState(1)
  const [endAt, setEndAt] = useState(0)
  const [left, setLeft] = useState(60_000)
  const box = useRef<HTMLDivElement>(null)
  useTicker(run, 100)

  const ms = run ? Math.max(0, endAt - Date.now()) : left

  useEffect(() => {
    if (!run || ms > 0) return
    if (phase === 'work') {
      if (round >= rounds) { setRun(false); setLeft(0); success(); return }
      beep(520); setPhase('rest'); setEndAt(Date.now() + rest * 1000)
    } else {
      beep(880); setPhase('work'); setRound(r => r + 1); setEndAt(Date.now() + work * 1000)
    }
  }, [ms, run, phase, round, rounds, work, rest])

  const reset = (w = work) => { setRun(false); setPhase('work'); setRound(1); setLeft(w * 1000) }
  const start = () => {
    if (left <= 0) { reset(); setEndAt(Date.now() + work * 1000) }
    else setEndAt(Date.now() + left)
    setRun(true)
  }
  const pause = () => { setLeft(ms); setRun(false) }

  const fields: [string, number, (n: number) => void][] = [
    ['ทำงาน (วินาที)', work, n => { setWork(n); reset(n) }],
    ['พัก (วินาที)', rest, n => { setRest(n); reset() }],
    ['จำนวนรอบ', rounds, n => { setRounds(n); reset() }],
  ]

  return (
    <Page title="Interval Timer" desc="สลับรอบทำงานกับพัก สำหรับกิจกรรมฐานหรือออกกำลังกาย" right={<FullscreenBtn target={box} />}>
      <div ref={box} className={`card border-0 text-white flex flex-col items-center py-14 gap-4 ${phase === 'work' ? 'bg-emerald-600' : 'bg-sky-600'}`}>
        <div className="text-xl font-bold tracking-wider">{phase === 'work' ? '💪 ทำงาน' : '😮‍💨 พัก'}</div>
        <div className="digits text-[clamp(3rem,16vw,9rem)] leading-none">{fmt(ms)}</div>
        <div className="opacity-80">รอบ {round} / {rounds}</div>
        <div className="flex gap-3">
          <button className="btn bg-white text-slate-900 !px-8" onClick={run ? pause : start}>{run ? '⏸ พัก' : '▶ เริ่ม'}</button>
          <button className="btn-glass" onClick={() => reset()}>↺ รีเซ็ต</button>
        </div>
      </div>

      <div className="card grid grid-cols-3 gap-3">
        {fields.map(([lbl, v, set]) => (
          <div key={lbl}>
            <label className="label">{lbl}</label>
            <input type="number" min={1} className="input digits" value={v}
              onChange={e => set(Math.max(1, +e.target.value || 1))} />
          </div>
        ))}
      </div>
    </Page>
  )
}
