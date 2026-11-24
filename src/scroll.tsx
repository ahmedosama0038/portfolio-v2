import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { useReducedMotion } from './hooks'

export type Info = { y: number; h: number; elTop: number; elH: number; rel: number; progress: number; vel: number; t: number }
type Fn = (i: Info) => void
type Reg = { el: HTMLElement; fn: { current: Fn }; top: number; h: number }
type Ctx = { register: (r: Reg) => () => void; live: boolean; reduced: boolean }

const Scroll = createContext<Ctx>({ register: () => () => {}, live: false, reduced: false })
export const useScroll = () => useContext(Scroll)
export const clamp = (v: number, a = 0, b = 1) => (Number.isFinite(v) ? Math.min(b, Math.max(a, v)) : a)

const STRIP = 100

/**
 * Scroll engine. Reads where the viewport is with IntersectionObserver strips laid over the page,
 * so it also works inside a tall sandboxed frame where window scroll events never fire.
 * Everything animates from one smoothed value in a single rAF loop.
 */
export function ScrollRoot({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const regs = useRef(new Set<Reg>())
  const reduced = useReducedMotion()
  const [live, setLive] = useState(false)
  const [docH, setDocH] = useState(0)
  const view = useRef({ top: 0, h: 0, ok: false })
  const seen = useRef(new Map<number, [number, number]>())
  const hMax = useRef(0)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const ro = new ResizeObserver(() => setDocH(el.scrollHeight))
    ro.observe(el)
    setDocH(el.scrollHeight)
    const late = [300, 1200, 3000].map((ms) => setTimeout(() => setDocH(el.scrollHeight), ms))
    return () => {
      ro.disconnect()
      late.forEach(clearTimeout)
    }
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el || docH === 0 || typeof IntersectionObserver === 'undefined') return
    const n = Math.ceil(docH / STRIP)
    seen.current.clear()
    const strips = Array.from(el.querySelectorAll<HTMLElement>('.pf-strip'))
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          const i = Number((e.target as HTMLElement).dataset.i)
          if (e.isIntersecting && e.intersectionRatio > 0) {
            const a = e.intersectionRect.top - e.boundingClientRect.top
            const b = e.intersectionRect.bottom - e.boundingClientRect.top
            seen.current.set(i, [i * STRIP + a, i * STRIP + b])
          } else seen.current.delete(i)
        }
        let top = Infinity, bottom = -Infinity
        seen.current.forEach(([a, b]) => {
          if (a < top) top = a
          if (b > bottom) bottom = b
        })
        if (top === Infinity) {
          view.current.ok = false
          return
        }
        hMax.current = Math.max(hMax.current, bottom - top)
        view.current = { top, h: Math.max(hMax.current, 420), ok: true }
        setLive(true)
      },
      { threshold: Array.from({ length: 21 }, (_, k) => k / 20) },
    )
    strips.slice(0, n).forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [docH])

  useEffect(() => {
    const el = root.current
    if (!el || !live || reduced) return
    let raf = 0
    let smooth = view.current.top
    let last = smooth
    let lastMeasure = 0
    const measure = () => {
      const rr = el.getBoundingClientRect()
      regs.current.forEach((r) => {
        const b = r.el.getBoundingClientRect()
        r.top = b.top - rr.top
        r.h = b.height
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    const loop = (t: number) => {
      const v = view.current
      if (v.ok) smooth += (v.top - smooth) * 0.13
      const vel = smooth - last
      last = smooth
      if (t - lastMeasure > 600) {
        measure()
        lastMeasure = t
      }
      const stage = clamp(v.h, 540, 1400)
      el.style.setProperty('--stage', `${Math.round(stage)}px`)
      el.style.setProperty('--vh', `${Math.round(v.h)}px`)
      el.classList.toggle('is-short', v.h < 720)
      regs.current.forEach((r) => {
        const rel = smooth - r.top
        const progress = clamp((smooth + v.h - r.top) / (v.h + r.h))
        r.fn.current({ y: smooth, h: v.h, elTop: r.top, elH: r.h, rel, progress, vel, t })
      })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [live, reduced])

  const register = (r: Reg) => {
    regs.current.add(r)
    return () => {
      regs.current.delete(r)
    }
  }
  const n = Math.ceil(docH / STRIP)
  return (
    <Scroll.Provider value={{ register, live: live && !reduced, reduced }}>
      <div ref={root} className={`pf-root${live && !reduced ? ' is-live' : ''}`}>
        {children}
        <div className="pf-strips" aria-hidden="true">
          {Array.from({ length: n }, (_, i) => (
            <i key={i} className="pf-strip" data-i={i} style={{ top: i * STRIP }} />
          ))}
        </div>
      </div>
    </Scroll.Provider>
  )
}

/** Run `fn` every frame with scroll info for `ref`. No-op until the engine is live. */
export function useScene(ref: RefObject<HTMLElement | null>, fn: Fn) {
  const { register, live } = useScroll()
  const f = useRef(fn)
  f.current = fn
  useEffect(() => {
    const el = ref.current
    if (!el || !live) return
    return register({ el, fn: f, top: 0, h: 0 })
  }, [live, register, ref])
}

/**
 * A scroll scene. Sets --sp (0 to 1 as it crosses the screen). With `extra` it pins: the stage
 * stays on screen while the page scrolls `extra` px, and --pin runs 0 to 1 across that distance.
 */
export function Scene({
  id, extra = 0, className = '', children, onInfo, marks = [],
}: { id?: string; extra?: number; className?: string; children: ReactNode; onInfo?: Fn; marks?: number[] }) {
  const outer = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const { live } = useScroll()
  const pinned = extra > 0 && live
  useScene(outer, (i) => {
    const o = outer.current
    if (!o) return
    o.style.setProperty('--sp', i.progress.toFixed(4))
    if (pinned && inner.current) {
      const d = clamp(i.rel, 0, extra)
      o.style.setProperty('--pin', (d / extra).toFixed(4))
      inner.current.style.transform = `translate3d(0,${d.toFixed(1)}px,0)`
    }
    onInfo?.(i)
  })
  const style: CSSProperties | undefined = pinned ? { height: `calc(var(--stage) + ${extra}px)` } : undefined
  return (
    <section id={id} ref={outer} className={`pf-scene ${className}${pinned ? ' is-pinned' : ''}`} style={style}>
      <div ref={inner} className="pf-scene-in" style={pinned ? { height: 'var(--stage)' } : undefined}>
        {children}
      </div>
      {pinned && marks.map((m, k) => <i key={k} id={`${id}-m${k}`} className="pf-mark" style={{ top: m }} />)}
    </section>
  )
}

export function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
