import { Link } from 'react-router-dom'
import { CATS, TOOLS, type Cat } from '../tools'
import { useActiveMembers, useApp, useRosters } from '../hooks/useRoster'

export default function Home() {
  const members = useActiveMembers()
  const rosterId = useApp(s => s.rosterId)
  const roster = useRosters().find(r => r.id === rosterId)
  const cats = Object.keys(CATS) as Cat[]

  return (
    <div className="space-y-7">
      <div className="card bg-gradient-to-br from-brand-600 to-indigo-800 text-white border-0">
        <h1 className="text-2xl font-bold">ชุดเครื่องมือกระบวนกร & นันทนาการ</h1>
        <p className="opacity-90 mt-1 text-sm">ใส่รายชื่อครั้งเดียว ใช้ได้กับทุกเครื่องมือ ข้อมูลเก็บในเครื่องของคุณ</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/roster" className="btn-glass">
            📇 {roster ? `${roster.name} · ${members.length} คน` : 'เริ่มจากสร้างชุดรายชื่อ'}
          </Link>
          <Link to="/wheel" className="btn-glass">🎡 วงล้อสุ่ม</Link>
          <Link to="/countdown" className="btn-glass">⏳ นับถอยหลัง</Link>
        </div>
      </div>

      {cats.map(c => (
        <section key={c}>
          <h2 className="font-bold text-lg mb-2">{CATS[c]}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TOOLS.filter(t => t.cat === c).map(t => (
              <Link key={t.path} to={t.path}
                className="card hover:border-brand-500 hover:-translate-y-0.5 transition relative">
                {!t.ready && <span className="absolute top-2 right-2 text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded">เร็ว ๆ นี้</span>}
                <div className="text-2xl">{t.icon}</div>
                <div className="font-semibold mt-1.5">{t.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
