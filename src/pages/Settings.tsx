import { useRef } from 'react'
import { Page } from '../components/ui'
import { backupAll, restoreAll } from '../lib/file'
import { useApp } from '../hooks/useRoster'
import { db } from '../db/db'
import { success } from '../lib/sound'

export default function Settings() {
  const { theme, toggleTheme } = useApp()
  const file = useRef<HTMLInputElement>(null)

  return (
    <Page title="ตั้งค่า & สำรองข้อมูล" desc="ข้อมูลทั้งหมดเก็บอยู่ในเบราว์เซอร์ของคุณ ไม่ได้ส่งไปที่อื่น">
      <div className="card space-y-3">
        <h3 className="font-semibold">การแสดงผล</h3>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={toggleTheme}>สลับเป็นธีม{theme === 'dark' ? 'สว่าง ☀️' : 'มืด 🌙'}</button>
          <button className="btn-ghost" onClick={success}>ทดสอบเสียง 🔊</button>
        </div>
      </div>

      <div className="card space-y-3">
        <h3 className="font-semibold">สำรอง / กู้คืน</h3>
        <p className="text-sm text-slate-500">
          ข้อมูลผูกอยู่กับเบราว์เซอร์นี้ ถ้าล้างแคชหรือเปลี่ยนเครื่อง ข้อมูลจะหายไป
          ควรส่งออกไฟล์ JSON เก็บไว้เป็นระยะ
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={backupAll}>⬇ ส่งออกทั้งหมด</button>
          <button className="btn-ghost" onClick={() => file.current?.click()}>⬆ นำเข้าไฟล์สำรอง</button>
          <input ref={file} type="file" accept="application/json" className="hidden"
            onChange={async e => {
              const f = e.target.files?.[0]
              e.target.value = ''
              if (!f || !confirm('การนำเข้าจะเขียนทับข้อมูลเดิมทั้งหมด ต้องการดำเนินการต่อ?')) return
              try { await restoreAll(f); alert('นำเข้าสำเร็จ'); location.reload() }
              catch { alert('ไฟล์ไม่ถูกต้อง') }
            }} />
          <button className="btn-danger ml-auto" onClick={async () => {
            if (!confirm('ลบข้อมูลทั้งหมดในเครื่องนี้?')) return
            await db.delete(); localStorage.clear(); location.reload()
          }}>ล้างข้อมูลทั้งหมด</button>
        </div>
      </div>
    </Page>
  )
}
