let ctx: AudioContext | null = null
const ac = () => {
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

export function beep(freq = 880, ms = 160, gain = 0.25) {
  const a = ac()
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  g.gain.setValueAtTime(gain, a.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + ms / 1000)
  osc.connect(g).connect(a.destination)
  osc.start()
  osc.stop(a.currentTime + ms / 1000)
}

export const tick = () => beep(1200, 50, 0.12)
export const success = () => { beep(660); setTimeout(() => beep(880), 140); setTimeout(() => beep(1320, 300), 280) }
export const alarm = () => [0, 300, 600, 900].forEach(d => setTimeout(() => beep(440, 220, 0.35), d))
