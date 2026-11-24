import { useEffect, useRef, type MutableRefObject } from 'react'
import { useReducedMotion } from './hooks'

const PHI = (1 + Math.sqrt(5)) / 2
type V3 = [number, number, number]
const norm = (v: V3): V3 => {
  const l = Math.hypot(v[0], v[1], v[2])
  return [v[0] / l, v[1] / l, v[2] / l]
}
const VERTS: V3[] = ([[-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0], [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI], [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]] as V3[]).map(norm)
const EDGES: [number, number][] = (() => {
  const d = (a: V3, b: V3) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
  let m = Infinity
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) m = Math.min(m, d(VERTS[i], VERTS[j]))
  const out: [number, number][] = []
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) if (d(VERTS[i], VERTS[j]) < m * 1.05) out.push([i, j])
  return out
})()

type Star = { x: number; y: number; z: number; c: string }

/** Hero scene: perspective floor, star field that turns into warp streaks on scroll, wireframe core that follows the pointer. */
export default function Holo({ warp }: { warp: MutableRefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const c = ref.current
    const host = c?.parentElement
    if (!c || !host) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    let w = 0, h = 0, raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const m = { x: 0, y: 0, tx: 0, ty: 0 }
    let stars: Star[] = []
    const rings: { x: number; y: number; t: number }[] = []
    let off = 0

    const resize = () => {
      w = host.clientWidth
      h = host.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = ['255,255,255', '200,255,61', '56,240,255', '255,61,240']
      stars = Array.from({ length: Math.min(150, Math.floor(w / 7)) }, () => ({
        x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random(), c: cols[Math.floor(Math.random() * cols.length)],
      }))
    }

    const rot = (v: V3, ax: number, ay: number): V3 => {
      const cy = Math.cos(ay), sy = Math.sin(ay), cx = Math.cos(ax), sx = Math.sin(ax)
      const x1 = v[0] * cy + v[2] * sy, z1 = -v[0] * sy + v[2] * cy
      return [x1, v[1] * cx - z1 * sx, v[1] * sx + z1 * cx]
    }

    const mesh = (cx: number, cy: number, R: number, ax: number, ay: number, a: number, col: string) => {
      const P = VERTS.map((v) => {
        const r = rot(v, ax, ay)
        const s = 3.2 / (3.2 + r[2])
        return { x: cx + r[0] * R * s, y: cy + r[1] * R * s, z: r[2] }
      })
      ctx.lineWidth = 1.1
      for (const [i, j] of EDGES) {
        const z = (P[i].z + P[j].z) / 2
        ctx.strokeStyle = `rgba(${col},${(0.25 + (1 - z) * 0.3) * a})`
        ctx.beginPath()
        ctx.moveTo(P[i].x, P[i].y)
        ctx.lineTo(P[j].x, P[j].y)
        ctx.stroke()
      }
      for (const p of P) {
        ctx.fillStyle = `rgba(${col},${(0.7 - p.z * 0.3) * a})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.2 - p.z, 0, 7)
        ctx.fill()
      }
    }

    const draw = (t: number) => {
      const wp = Number.isFinite(warp.current) ? warp.current : 0
      m.x += (m.tx - m.x) * 0.06
      m.y += (m.ty - m.y) * 0.06
      ctx.clearRect(0, 0, w, h)
      const wide = w > 860
      const vpx = w * 0.5 + m.x * w * 0.06
      const hy = h * (wide ? 0.66 : 0.72) + m.y * 14
      // glow behind the core
      const cx = wide ? w * 0.72 + m.x * 26 : w * 0.5 + m.x * 14
      const cy = wide ? h * 0.42 + m.y * 20 : h * 0.2 + m.y * 10
      const R = Math.min(w, h) * (wide ? 0.27 : 0.19) * (1 + wp * 1.8)
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.4)
      g.addColorStop(0, 'rgba(160,90,255,0.30)')
      g.addColorStop(0.5, 'rgba(56,240,255,0.08)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // floor
      off = (off + 0.004 * (1 + wp * 10)) % 1
      const rows = 20
      for (let i = 0; i < rows; i++) {
        const zf = (i + off) / rows
        const y = hy + (h - hy) * Math.pow(zf, 2.3)
        ctx.strokeStyle = `rgba(200,255,61,${0.05 + zf * 0.28})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }
      for (let k = -18; k <= 18; k++) {
        ctx.strokeStyle = 'rgba(200,255,61,0.16)'
        ctx.beginPath()
        ctx.moveTo(vpx + k * w * 0.035, hy)
        ctx.lineTo(vpx + k * w * 0.2, h)
        ctx.stroke()
      }
      ctx.strokeStyle = 'rgba(56,240,255,0.55)'
      ctx.beginPath()
      ctx.moveTo(0, hy)
      ctx.lineTo(w, hy)
      ctx.stroke()

      // stars / warp
      const sp = 0.0016 * (1 + wp * 22)
      for (const s of stars) {
        const z0 = s.z
        s.z -= reduced ? 0 : sp
        if (s.z <= 0.03) {
          s.z = 1
          s.x = Math.random() * 2 - 1
          s.y = Math.random() * 1.2 - 1
        }
        const k = w * 0.5
        const x1 = vpx + (s.x / s.z) * k * 0.4, y1 = hy * 0.8 + (s.y / s.z) * k * 0.3
        const zb = Math.min(1.2, s.z + (z0 - s.z) * (2 + wp * 14))
        const x0 = vpx + (s.x / zb) * k * 0.4, y0 = hy * 0.8 + (s.y / zb) * k * 0.3
        if (y1 > hy + 4) continue
        ctx.strokeStyle = `rgba(${s.c},${(1 - s.z) * 0.9})`
        ctx.lineWidth = 0.8 + (1 - s.z) * 1.4
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      }

      // core
      const a = Math.max(0, 1 - wp * 1.1)
      const ay = t * 0.00035 + m.x * 1.4 + wp * 4
      const ax = 0.5 + m.y * 0.8 + t * 0.0002
      mesh(cx, cy, R, ax, ay, a, '200,255,61')
      mesh(cx, cy, R * 0.55, -ax * 1.3, -ay * 1.6, a, '56,240,255')
      ctx.lineWidth = 1
      for (let k = 0; k < 3; k++) {
        ctx.strokeStyle = `rgba(255,61,240,${0.28 * a})`
        ctx.beginPath()
        ctx.ellipse(cx, cy, R * (1.25 + k * 0.18), R * (0.32 + k * 0.05), -0.4 + k * 0.5 + t * 0.0002 * (k + 1), 0, 7)
        ctx.stroke()
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i]
        const age = (t - r.t) / 900
        if (age > 1) {
          rings.splice(i, 1)
          continue
        }
        ctx.strokeStyle = `rgba(200,255,61,${(1 - age) * 0.7})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(r.x, r.y, 10 + age * 220, 0, 7)
        ctx.stroke()
      }
      if (!reduced) raf = requestAnimationFrame(draw)
    }

    const move = (e: PointerEvent) => {
      const r = c.getBoundingClientRect()
      m.tx = (e.clientX - r.left) / r.width - 0.5
      m.ty = (e.clientY - r.top) / r.height - 0.5
    }
    const down = (e: PointerEvent) => {
      const r = c.getBoundingClientRect()
      rings.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() })
    }
    resize()
    draw(0)
    if (!reduced) raf = requestAnimationFrame(draw)
    const ro = new ResizeObserver(resize)
    ro.observe(host)
    host.addEventListener('pointermove', move)
    host.addEventListener('pointerdown', down)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerdown', down)
    }
  }, [reduced, warp])

  return <canvas ref={ref} className="pf-holo" aria-hidden="true" />
}
