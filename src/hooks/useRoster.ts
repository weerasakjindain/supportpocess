import { useLiveQuery } from 'dexie-react-hooks'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { activeMembersOf, allRosters } from '../db/repo'

interface AppState {
  rosterId: string | null
  theme: 'light' | 'dark'
  setRoster: (id: string | null) => void
  toggleTheme: () => void
}

export const useApp = create<AppState>()(
  persist(
    set => ({
      rosterId: null,
      theme: 'dark',
      setRoster: id => set({ rosterId: id }),
      toggleTheme: () => set(s => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
    }),
    { name: 'toolkit-app' },
  ),
)

/** สมาชิกที่เปิดใช้งานในชุดรายชื่อที่เลือก ทุกเครื่องมือดึงข้อมูลจากที่นี่ */
export function useActiveMembers() {
  const rosterId = useApp(s => s.rosterId)
  return useLiveQuery(() => (rosterId ? activeMembersOf(rosterId) : Promise.resolve([])), [rosterId]) ?? []
}

export const useRosters = () => useLiveQuery(allRosters, []) ?? []
