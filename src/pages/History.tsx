import { useLiveQuery } from 'dexie-react-hooks'
import { Page, Empty } from '../components/ui'
import { clearResults, recentResults } from '../db/repo'
import { db } from '../db/db'

export default function History() {
  const items = useLiveQuery(() => recentResults(200), []) ?? []

  return (
    <Page title="ประวัติผลลัพธ์" desc="ผลจากทุกเครื่องมือเก็บไว้ที่นี่ ดูย้อนหลังได้ว่าครั้งก่อนสุ่มใครไปบ้าง"
      right={items.length ? (
        <button className="btn-danger" onClick={() => { if (confirm('ลบประวัติทั้งหมด?')) clearResults() }}>ล้างประวัติ</button>
      ) : null}>
      {!items.length ? <Empty>ยังไม่มีประวัติ ลองใช้เครื่องมือสุ่มสักครั้งก่อน</Empty> : (
        <div className="space-y-2">
          {items.map(r => (
            <details key={r.id} className="card !py-3">
              <summary className="cursor-pointer flex items-center gap-3 text-sm">
                <span className="font-semibold">{r.title}</span>
                <span className="text-slate-400 ml-auto">{new Date(r.createdAt).toLocaleString('th-TH')}</span>
                <button className="text-rose-500" onClick={e => { e.preventDefault(); db.results.delete(r.id) }}>✕</button>
              </summary>
              <pre className="mt-3 text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded-xl overflow-auto max-h-60 whitespace-pre-wrap">
                {JSON.stringify(r.payload, null, 2)}
              </pre>
            </details>
          ))}
        </div>
      )}
    </Page>
  )
}
