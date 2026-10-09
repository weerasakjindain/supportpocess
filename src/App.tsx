import type { ComponentType } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './app/Layout'
import Home from './pages/Home'
import Soon from './pages/Soon'

// อ่านทุกไฟล์ใน src/pages อัตโนมัติ เช่น Wheel.tsx → /wheel
const modules = import.meta.glob<{ default: ComponentType }>('./pages/*.tsx', { eager: true })
const routes = Object.entries(modules)
  .map(([file, mod]) => ({
    path: '/' + file.split('/').pop()!.replace('.tsx', '').toLowerCase(),
    Comp: mod.default,
  }))
  .filter(r => r.path !== '/home' && r.path !== '/soon')

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        {routes.map(({ path, Comp }) => <Route key={path} path={path} element={<Comp />} />)}
        <Route path="*" element={<Soon />} />
      </Route>
    </Routes>
  )
}
