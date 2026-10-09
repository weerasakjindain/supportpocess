export function fmt(ms: number, showMs = false) {
  const sign = ms < 0 ? '-' : ''
  const t = Math.abs(ms)
  const h = Math.floor(t / 3_600_000)
  const m = Math.floor((t % 3_600_000) / 60_000)
  const s = Math.floor((t % 60_000) / 1000)
  const cs = Math.floor((t % 1000) / 10)
  const base = h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return sign + base + (showMs ? `.${String(cs).padStart(2, '0')}` : '')
}

export const toMs = (h: number, m: number, s: number) => ((h * 60 + m) * 60 + s) * 1000