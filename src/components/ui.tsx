import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { useNavigate } from 'react-router-dom'

export function Page({ title, desc, children, right }: {
  title: string; desc?: string; children: ReactNode; right?: ReactNode
}) {
  const nav = useNavigate()
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3">
        <button className="btn-ghost !px-3 lg:hidden" onClick={() => nav('/')}>←</button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{title}</h1>
          {desc && <p className="text-slate-500 text-sm mt-0.5">{desc}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

export function FullscreenBtn({ target }: { target: RefObject<HTMLElement> }) {
  return (
    <button className="btn-ghost" onClick={() => {
      const el = target.current
      if (!el) return
      if (document.fullscreenElement) document.exitFullscreen()
      else el.requestFullscreen()
    }}>⛶ เต็มจอ</button>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="card text-center text-slate-500 py-10">{children}</div>
}

/** คีย์ลัด จะไม่ทำงานขณะกำลังพิมพ์ในช่องกรอก */
export function useHotkey(code: string, fn: () => void) {
  const ref = useRef(fn)
  ref.current = fn
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code !== code) return
      const t = e.target as HTMLElement
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName)) return
      e.preventDefault()
      ref.current()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [code])
}
