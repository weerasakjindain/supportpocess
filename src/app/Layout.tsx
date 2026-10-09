import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { CATS, TOOLS, type Cat } from '../tools'
import { useApp, useRosters } from '../hooks/useRoster'

export default function Layout() {
  const { theme, toggleTheme, rosterId, setRoster } = useApp()
  const rosters = useRosters()
  const loc = useLocation()

  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark') }, [theme])
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])

  const cats = Object.keys(CATS) as Cat[]

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="font-bold text-lg">🧰 ToolKit</Link>
          <select className="input !w-auto !py-1 text-sm ml-auto" value={rosterId ?? ''}
            onChange={e => setRoster(e.target.value || null)}>
            <option value="">— เลือกชุดรายชื่อ —</option>
            {rosters.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button className="btn-ghost !px-3 !py-1" onClick={toggleTheme} title="สลับธีม">
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex gap-6">
        <nav className="hidden lg:block w-56 shrink-0 space-y-5">
          {cats.map(c => (
            <div key={c}>
              <div className="text-xs font-bold uppercase text-slate-400 mb-1">{CATS[c]}</div>
              {TOOLS.filter(t => t.cat === c).map(t => (
                <NavLink key={t.path} to={t.path}
                  className={({ isActive }) =>
                    `block rounded-lg px-2 py-1.5 text-sm ${isActive ? 'bg-brand-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'} ${t.ready ? '' : 'opacity-50'}`}>
                  <span className="mr-1.5">{t.icon}</span>{t.name}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <main className="flex-1 min-w-0"><Outlet /></main>
      </div>
    </div>
  )
}
