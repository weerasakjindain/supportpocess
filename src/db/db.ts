import Dexie, { type Table } from 'dexie'

export const uid = () => crypto.randomUUID()

export interface Roster  { id: string; name: string; createdAt: number; updatedAt: number }
export interface Member  { id: string; rosterId: string; name: string; active: boolean; order: number
                           meta: { team?: string; gender?: string; note?: string } }
export interface Session { id: string; title: string; date: number; rosterId?: string; notes?: string }
export interface Result  { id: string; sessionId?: string; toolType: string; title: string
                           payload: unknown; createdAt: number }
export interface Preset  { id: string; toolType: string; name: string; config: unknown; createdAt: number }
export interface Setting { key: string; value: unknown }

class ToolkitDB extends Dexie {
  rosters!: Table<Roster, string>
  members!: Table<Member, string>
  sessions!: Table<Session, string>
  results!: Table<Result, string>
  presets!: Table<Preset, string>
  settings!: Table<Setting, string>

  constructor() {
    super('toolkit')
    this.version(1).stores({
      rosters:  'id, name, updatedAt',
      members:  'id, rosterId, name, active, order',
      sessions: 'id, date, rosterId',
      results:  'id, sessionId, toolType, createdAt',
      presets:  'id, toolType, name',
      settings: 'key',
    })
  }
}

export const db = new ToolkitDB()
