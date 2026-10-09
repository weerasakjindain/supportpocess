import { useState } from 'react'
import { Page, Empty } from '../components/ui'
import { useActiveMembers } from '../hooks/useRoster'
import { saveResult } from '../db/repo'
import { exportCSV } from '../lib/file'

type St = 'present' | 'late' | 'absent'
const LABEL: Record<St, string> = { present: 'มา', late: 'สาย', absent: 'ขาด' }
const STYLE: Record<St, string> = {
  present: 'bg-emerald-500 text-white', late: 'bg-amber-500 text-white', absent: 'bg-rose-500 text-white',
}

export default function Attendance() {
  const members = useActiveMembers()
  const [state, setState] = useState<Record<string, St | undefined>>({})
  const count = (s: St) => members.filter(m => state[m.id] === s).length

  if (!members.length) return <Page title="เช็กชื่อ"><Empty>เลือกชุดรายชื่อก่อน</Empty></Page>

  const save = () => {
    const rows = members.map(m => [m.name, state[m.id] ? LABEL[state[m.id]!] : '-'])
    exportCSV(`attendance-${new Date().toISOString().slice(0, 10)}.csv`, [['ชื่อ', 'สถานะ'], ...rows])
    saveResult('attendance', 'เช็กชื่อ', rows)
  }

  return (
    <Page title="เช็กชื่อ"
      desc={`มา ${count('present')} · สาย ${count('late')} · ขาด ${count('absent')} · จากทั้งหมด ${members.length} คน`}
      right={<button className="btn-primary" onClick={save}>⬇ บันทึก & ส่งออก</button>}>

      <div className="flex gap-2">
        <button className="btn-ghost !text-sm" onClick={() => setState(Object.fromEntries(members.map(m => [m.id, 'present' as St])))}>
          ✓ มาทุกคน
        </button>
        <button className="btn-ghost !text-sm" onClick={() => setState({})}>ล้าง</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        {members.map(m => (
          <div key={m.id} className="card !py-2.5 flex items-center gap-2">
            <span className="flex-1 truncate">{m.name}</span>
            {(Object.keys(LABEL) as St[]).map(s => (
              <button key={s} onClick={() => setState(x => ({ ...x, [m.id]: x[m.id] === s ? undefined : s }))}
                className={`btn !px-3 !py-1 !text-sm ${state[m.id] === s ? STYLE[s] : 'bg-slate-200 dark:bg-slate-800'}`}>
                {LABEL[s]}
              </button>
            ))}
          </div>
        ))}
      </div>
    </Page>
  )
}
