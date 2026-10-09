import { db, uid, type Member, type Roster, type Result } from './db'

/* ---------- รายชื่อกลาง ---------- */
export async function createRoster(name: string): Promise<string> {
  const id = uid()
  await db.rosters.add({ id, name, createdAt: Date.now(), updatedAt: Date.now() })
  return id
}

export async function renameRoster(id: string, name: string) {
  await db.rosters.update(id, { name, updatedAt: Date.now() })
}

export async function deleteRoster(id: string) {
  await db.transaction('rw', db.rosters, db.members, async () => {
    await db.members.where('rosterId').equals(id).delete()
    await db.rosters.delete(id)
  })
}

/** วางรายชื่อหลายบรรทัด รองรับรูปแบบ "ชื่อ, ทีม" */
export async function addMembersBulk(rosterId: string, raw: string) {
  const existing = await db.members.where('rosterId').equals(rosterId).count()
  const rows = raw.split('\n').map(s => s.trim()).filter(Boolean)
  const members: Member[] = rows.map((line, i) => {
    const [name, team] = line.split(/[,\t]/).map(s => s?.trim())
    return { id: uid(), rosterId, name, active: true, order: existing + i, meta: { team: team || undefined } }
  })
  await db.members.bulkAdd(members)
  await db.rosters.update(rosterId, { updatedAt: Date.now() })
}

export const membersOf = (rosterId: string) =>
  db.members.where('rosterId').equals(rosterId).sortBy('order')

export const activeMembersOf = async (rosterId: string) =>
  (await membersOf(rosterId)).filter(m => m.active)

export const toggleMember = (m: Member) => db.members.update(m.id, { active: !m.active })
export const removeMember = (id: string) => db.members.delete(id)
export const allRosters = (): Promise<Roster[]> => db.rosters.orderBy('updatedAt').reverse().toArray()

/* ---------- ประวัติผลลัพธ์ ---------- */
export async function saveResult(toolType: string, title: string, payload: unknown) {
  const r: Result = { id: uid(), toolType, title, payload, createdAt: Date.now() }
  await db.results.add(r)
  return r.id
}

export const recentResults = (limit = 100) =>
  db.results.orderBy('createdAt').reverse().limit(limit).toArray()

export const clearResults = () => db.results.clear()
