import { useEffect, useReducer } from 'react'

/** สั่ง re-render เป็นจังหวะ ใช้คู่กับ Date.now() เพื่อให้เวลาแม่นยำ */
export function useTicker(active: boolean, ms = 50) {
  const [, bump] = useReducer((x: number) => x + 1, 0)
  useEffect(() => {
    if (!active) return
    const id = setInterval(bump, ms)
    return () => clearInterval(id)
  }, [active, ms])
}
