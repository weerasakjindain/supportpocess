import { useState } from 'react'
import { Page, Empty } from '../components/ui'
import { useActiveMembers } from '../hooks/useRoster'
import { makePairs, shuffle } from '../lib/random'
import { success } from '../lib/sound'
import { saveResult } from '../db/repo'
import type { Member } from '../db/db'

export default function Pairs() {
  const members = useActiveMembers()
  const [mode, setMode] = useState<'pair' | 'santa'>('pair')
  const [pairs, setPairs] = useState<Member[][]>([])
  const [santa, setSanta] = useState<[Member, Member][]>([])

  const run = () => {
    if (mode === 'pair') {
      const p = makePairs(members)
      setPairs(p); setSanta([])
      saveResult('pairs', 'สุ่มจับคู่', p.map(x => x.map(m => m.name)))
    } else {
      // เรียงเป็นวง แต่ละคนให้ของคนถัดไป จึงไม่มีใครจับได้ตัวเอง
      const ring = shuffle(members)
      const res = ring.map((m, i) => [m, ring[(i + 1) % ring.length]] as [Member, Member])
      setSanta(res); setPairs([])
      saveResult('pairs', 'Secret Santa', res.map(([a, b]) => `${a.name} → ${b.name}`))
    }
    success()
  }

  if (members.length < 2) return <Page title="สุ่มจับคู่"><Empty>ต้องมีอย่างน้อย 2 คนในชุดรายชื่อ</Empty></Page>

  return (
    <Page title="สุ่มจับคู่" right={<button className="btn-primary" onClick={run}>🤝 สุ่ม</button>}>
      <div className="card flex flex-wrap gap-2">
        <button className={mode === 'pair' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMode('pair')}>จับคู่สนทนา</button>
        <button className={mode === 'santa' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMode('santa')}>Secret Santa (ใครให้ใคร)</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {pairs.map((p, i) => (
          <div key={i} className="card flex flex-wrap items-center justify-center gap-2 text-center">
            {p.map((m, j) => (
              <span key={m.id} className="flex items-center gap-2">
                {j > 0 && <span className="text-brand-500">↔</span>}
                <span className="font-semibold">{m.name}</span>
              </span>
            ))}
          </div>
        ))}
        {santa.map(([a, b]) => (
          <div key={a.id} className="card text-center">
            <span className="font-semibold">{a.name}</span>
            <span className="text-rose-500 mx-2">🎁 →</span>
            <span className="font-semibold">{b.name}</span>
          </div>
        ))}
      </div>
    </Page>
  )
}
