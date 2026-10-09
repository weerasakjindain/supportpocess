/** สุ่มด้วย crypto (สุ่มจริง ไม่ลำเอียง) */
export function randInt(max: number) {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const pick = <T,>(arr: readonly T[]): T | undefined =>
  arr.length ? arr[randInt(arr.length)] : undefined

export const pickMany = <T,>(arr: readonly T[], n: number): T[] => shuffle(arr).slice(0, n)

/** แบ่งกลุ่มเฉลี่ย + คละตาม key (เช่น team) */
export function makeGroups<T extends { meta?: Record<string, unknown> }>(
  items: readonly T[],
  opts: { groupCount?: number; groupSize?: number; balanceKey?: string },
): T[][] {
  const n = items.length
  if (!n) return []
  let g = opts.groupCount ?? Math.ceil(n / Math.max(1, opts.groupSize ?? 1))
  g = Math.max(1, Math.min(g, n))

  const buckets = new Map<string, T[]>()
  for (const it of shuffle(items)) {
    const k = opts.balanceKey ? String(it.meta?.[opts.balanceKey] ?? '—') : '—'
    if (!buckets.has(k)) buckets.set(k, [])
    buckets.get(k)!.push(it)
  }

  const groups: T[][] = Array.from({ length: g }, () => [])
  let i = 0
  for (const list of buckets.values())
    for (const it of list) groups[i++ % g].push(it)
  return groups
}

/** จับคู่ ถ้าจำนวนคี่ คนสุดท้ายเข้าคู่สุดท้ายเป็นกลุ่ม 3 */
export function makePairs<T>(items: readonly T[]): T[][] {
  const s = shuffle(items)
  const out: T[][] = []
  for (let i = 0; i + 1 < s.length; i += 2) out.push([s[i], s[i + 1]])
  if (s.length % 2) {
    const last = s[s.length - 1]
    if (out.length) out[out.length - 1].push(last)
    else out.push([last])
  }
  return out
}
