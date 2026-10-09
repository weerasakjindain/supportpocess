import { useRef, useState } from 'react'
import { Page, FullscreenBtn, useHotkey } from '../components/ui'
import { useTicker } from '../hooks/useTicker'
import { fmt } from '../lib/time'
import { exportCSV } from '../lib/file'

export default function Stopwatch() {
  const [run, setRun] = useState(false)
  const [base, setBase] = useState(0)
  const [from, setFrom] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const box = useRef<HTMLDivElement>(null)
  useTicker(run, 33)

  const ms = base + (run ? Date.now() - from : 0)

  const toggle = () => {
    if (run) { setBase(ms); setRun(false) }
    else { setFrom(Date.now()); setRun(true) }
  }
  const reset = () => { setRun(false); setBase(0); setLaps([]) }
  const lap = () => { if (run) setLaps(l => [...l, ms]) }

  useHotkey('Space', toggle)
  useHotkey('KeyL', lap)
  useHotkey('KeyR', reset)

  return (
    <Page title="นาฬิกาจับเวลา" desc="Space = เริ่ม/หยุด · L = Lap · R = รีเซ็ต" right={<FullscreenBtn target={box} />}>
      <div ref={box} className="card bg-slate-900 text-white flex flex-col items-center justify-center py-14 gap-6">
        <div className="digits text-[clamp(3rem,16vw,9rem)] leading-none">{fmt(ms, true)}</div>
        <div className="flex gap-3">
          <button className={run ? 'btn-danger !px-8' : 'btn-primary !px-8'} onClick={toggle}>{run ? '⏸ หยุด' : '▶ เริ่ม'}</button>
          <button className="btn-glass" onClick={lap} disabled={!run}>🏁 Lap</button>
          <button className="btn-glass" onClick={reset}>↺ รีเซ็ต</button>
        </div>
      </div>

      {laps.length > 0 && (
        <div className="card">
          <div className="flex justify-between mb-2">
            <h3 className="font-semibold">รอบที่บันทึก</h3>
            <button className="btn-ghost !py-1 !text-xs" onClick={() =>
              exportCSV('laps.csv', [['รอบ', 'เวลารวม', 'เวลารอบนี้'],
                ...laps.map((t, i) => [i + 1, fmt(t, true), fmt(t - (laps[i - 1] ?? 0), true)])])}>⬇ CSV</button>
          </div>
          <ul className="divide-y divide-slate-200 dark:divide-slate-800">
            {laps.map((t, i) => (
              <li key={i} className="flex justify-between py-1.5 digits text-sm">
                <span className="text-slate-500">รอบ {i + 1}</span>
                <span>{fmt(t - (laps[i - 1] ?? 0), true)}</span>
                <span className="text-slate-400">{fmt(t, true)}</span>
              </li>
            )).reverse()}
          </ul>
        </div>
      )}
    </Page>
  )
}
