export type Cat = 'time' | 'random' | 'engage' | 'facilitate' | 'data'

export interface ToolDef { path: string; name: string; desc: string; icon: string; cat: Cat; ready: boolean }

export const CATS: Record<Cat, string> = {
  time: 'เวลา', random: 'สุ่ม', engage: 'การมีส่วนร่วม', facilitate: 'กระบวนการ', data: 'ข้อมูล',
}

export const TOOLS: ToolDef[] = [
  { path: '/stopwatch', name: 'นาฬิกาจับเวลา', desc: 'นับขึ้น + บันทึก Lap', icon: '⏱️', cat: 'time', ready: true },
  { path: '/countdown', name: 'นับถอยหลัง', desc: 'ตั้งเวลา + เสียงเตือน + เต็มจอ', icon: '⏳', cat: 'time', ready: true },
  { path: '/interval', name: 'Interval Timer', desc: 'รอบทำงาน–พัก สำหรับกิจกรรมฐาน', icon: '🔁', cat: 'time', ready: true },
  { path: '/clock', name: 'นาฬิกาจอใหญ่', desc: 'เวลาปัจจุบันเต็มจอ', icon: '🕐', cat: 'time', ready: true },
  { path: '/agenda', name: 'Agenda Timer', desc: 'จับเวลาตามวาระ เลื่อนอัตโนมัติ', icon: '📋', cat: 'time', ready: false },

  { path: '/wheel', name: 'วงล้อสุ่ม', desc: 'หมุนวงล้อ ตัดชื่อที่ออกแล้วได้', icon: '🎡', cat: 'random', ready: true },
  { path: '/picker', name: 'สุ่มรายชื่อ', desc: 'สุ่มทีละคนหรือหลายคน ไม่ซ้ำ', icon: '🎯', cat: 'random', ready: true },
  { path: '/grouping', name: 'สุ่มกลุ่ม', desc: 'แบ่งกลุ่มเฉลี่ย คละทีม', icon: '👥', cat: 'random', ready: true },
  { path: '/cards', name: 'เปิดการ์ด', desc: 'พลิกการ์ดเผยชื่อ/ภารกิจ/รางวัล', icon: '🃏', cat: 'random', ready: true },
  { path: '/pairs', name: 'สุ่มจับคู่', desc: 'จับคู่สนทนา / Secret Santa', icon: '🤝', cat: 'random', ready: true },
  { path: '/dice', name: 'ลูกเต๋า & เหรียญ', desc: 'ทอยเต๋า โยนหัวก้อย สุ่มเลข', icon: '🎲', cat: 'random', ready: true },
  { path: '/bingo', name: 'Bingo', desc: 'สร้างการ์ด + หมุนเลข', icon: '🔢', cat: 'random', ready: false },

  { path: '/scoreboard', name: 'กระดานคะแนน', desc: 'บวกลบเร็ว จัดอันดับอัตโนมัติ', icon: '🏆', cat: 'engage', ready: true },
  { path: '/buzzer', name: 'กดชิงตอบ', desc: 'จอเดียว ใช้คีย์บอร์ดหรือปุ่มสัมผัส', icon: '🔔', cat: 'engage', ready: true },
  { path: '/poll', name: 'โหวต / Poll', desc: 'นับคะแนนสด', icon: '📊', cat: 'engage', ready: false },
  { path: '/noise', name: 'มิเตอร์วัดเสียง', desc: 'ใช้ไมค์คุมระดับเสียงห้อง', icon: '📣', cat: 'engage', ready: false },

  { path: '/notes', name: 'กระดานโน้ต', desc: 'Sticky note ระดมสมอง', icon: '🗒️', cat: 'facilitate', ready: false },
  { path: '/attendance', name: 'เช็กชื่อ', desc: 'มา/สาย/ขาด + สรุปออกไฟล์', icon: '✅', cat: 'facilitate', ready: true },
  { path: '/questions', name: 'กล่องคำถาม', desc: 'สุ่มคำถามละลายพฤติกรรม', icon: '💬', cat: 'facilitate', ready: true },

  { path: '/roster', name: 'จัดการรายชื่อ', desc: 'ศูนย์กลางรายชื่อของทุกเครื่องมือ', icon: '📇', cat: 'data', ready: true },
  { path: '/history', name: 'ประวัติผลลัพธ์', desc: 'ย้อนดูผลสุ่ม/กลุ่ม/คะแนน', icon: '🕓', cat: 'data', ready: true },
  { path: '/settings', name: 'ตั้งค่า & สำรองข้อมูล', desc: 'ธีม เสียง นำเข้า–ส่งออก', icon: '⚙️', cat: 'data', ready: true },
]
