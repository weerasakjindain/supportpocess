import { useRef } from 'react'
import { Page, FullscreenBtn } from '../components/ui'
import { useTicker } from '../hooks/useTicker'

export default function Clock() {
  const box = useRef<HTMLDivElement>(null)
  useTicker(true, 500)
  const now = new Date()
  return (
    <Page title="นาฬิกาจอใหญ่" desc="สำหรับฉายขึ้นจอช่วงพักเบรก" right={<FullscreenBtn target={box} />}>
      <div ref={box} className="card bg-slate-900 text-white py-20 flex flex-col items-center justify-center gap-3">
        <div className="digits text-[clamp(3rem,18vw,11rem)] leading-none">
          {now.toLocaleTimeString('th-TH', { hour12: false })}
        </div>
        <div className="text-xl opacity-70">
          {now.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>
    </Page>
  )
}
