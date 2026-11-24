import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Holo from './Holo'
import Magnetic from './Magnetic'
import { useReducedMotion } from './hooks'
import { Scene, ScrollRoot, clamp, goTo, useScene, useScroll } from './scroll'
import { projects, stack, features, contact, photos, values, repos, signInRequired, type Project, type Repo } from './data'

const n = projects.length
const featuresSorted = [...features].sort((a, b) => a.p - b.p)
const liveCount = repos.filter((r) => r.live).length
const EXTRA = 1500
const ST_EXTRA = 1000
const CT_EXTRA = 300
const demoLabel = (u: string) => (signInRequired.includes(u) ? 'Live demo (sign-in required) ↗' : 'Live demo ↗')
const css = (o: Record<string, string | number>) => o as CSSProperties

const GLYPHS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789<>/#'
/** Letters that decode into place, again on hover. */
function Decode({ text, delay = 0 }: { text: string; delay?: number }) {
  const reduced = useReducedMotion()
  const [out, setOut] = useState(text)
  const run = useRef(0)
  const start = (d: number) => {
    if (reduced) return
    const id = ++run.current
    const t0 = performance.now() + d
    const tick = () => {
      if (id !== run.current) return
      const t = performance.now() - t0
      let done = true
      const s = text.split('').map((ch, i) => {
        if (t > 380 + i * 110) return ch
        done = false
        return t < 0 ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
      })
      setOut(s.join(''))
      if (!done) setTimeout(tick, 45)
    }
    tick()
  }
  useEffect(() => {
    start(delay)
    return () => {
      run.current++
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <span className="pf-split" aria-label={text} onPointerEnter={() => start(0)}>
      {out.split('').map((ch, i) => (
        <span className="pf-ch" key={i} aria-hidden="true">{ch}</span>
      ))}
    </span>
  )
}

function Rotating({ words }: { words: string[] }) {
  const [i, setI] = useState(0)
  const reduced = useReducedMotion()
  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setI((v) => (v + 1) % words.length), 2200)
    return () => clearInterval(t)
  }, [words.length, reduced])
  return <span className="pf-rot"><span key={words[i]} className="pf-rot-word">{words[i]}</span></span>
}

function Clock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const f = () => setT(new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()))
    f()
    const id = setInterval(f, 1000)
    return () => clearInterval(id)
  }, [])
  return <>{t}</>
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const readout = useRef<HTMLSpanElement>(null)
  const warp = useRef(0)
  useScene(ref, (i) => {
    const p = clamp(i.y / Math.max(1, i.elH * 0.85))
    warp.current = p
    ref.current?.style.setProperty('--p', p.toFixed(4))
  })
  return (
    <section
      ref={ref}
      className="pf-hero"
      id="top"
      onPointerMove={(e) => {
        const el = ref.current
        if (!el || e.pointerType !== 'mouse') return
        const r = el.getBoundingClientRect()
        el.style.setProperty('--px', String((e.clientX - r.left) / r.width - 0.5))
        el.style.setProperty('--py', String((e.clientY - r.top) / r.height - 0.5))
        el.style.setProperty('--cx', `${e.clientX - r.left}px`)
        el.style.setProperty('--cy', `${e.clientY - r.top}px`)
        el.classList.add('pf-lit')
        if (readout.current) readout.current.textContent = `x ${Math.round(e.clientX - r.left)}  y ${Math.round(e.clientY - r.top)}`
      }}
      onPointerLeave={() => ref.current?.classList.remove('pf-lit')}
    >
      <Holo warp={warp} />
      <div className="pf-blueprint" aria-hidden="true">
        <span className="pf-cross"><span ref={readout} className="pf-readout">x 0  y 0</span></span>
        <b className="pf-bp1">display: grid; place-items: center;</b>
        <b className="pf-bp2">const [project, setProject] = useState&lt;Project&gt;()</b>
        <b className="pf-bp3">&lt;Hero name=&quot;Ahmed Osama&quot; /&gt;</b>
      </div>
      <header className="pf-nav">
        <a href="#top" className="pf-logo" onClick={(e) => { e.preventDefault(); goTo('top') }}>AO<span>.</span></a>
        <nav aria-label="Sections">
          <a href="#work" onClick={(e) => { e.preventDefault(); goTo('work') }}>Work</a>
          <a href="#all" onClick={(e) => { e.preventDefault(); goTo('all') }}>All</a>
          <a href="#me" onClick={(e) => { e.preventDefault(); goTo('me') }}>Me</a>
          <a href="#stack" onClick={(e) => { e.preventDefault(); goTo('stack') }}>Stack</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); goTo('contact') }}>Contact</a>
        </nav>
      </header>
      <div className="pf-hud pf-hud-l" aria-hidden="true">
        <span>BASE / CAIRO, EG</span>
        <span>LOCAL / <Clock /></span>
      </div>
      <div className="pf-hud pf-hud-r" aria-hidden="true">
        <span>REACT / NEXT / TS</span>
        <span>CLICK THE SCENE</span>
      </div>
      <div className="pf-hero-inner">
        <p className="pf-eyebrow"><i className="pf-dot" /> Frontend Developer · Cairo, Egypt</p>
        <h1>
          <span className="pf-line"><Decode text="AHMED" delay={200} /></span>
          <span className="pf-line pf-outline"><Decode text="OSAMA" delay={500} /></span>
        </h1>
        <p className="pf-lede">
          I build <Rotating words={['fast storefronts', 'admin dashboards', 'social apps', 'typed interfaces']} /> with React, Next.js and TypeScript.
        </p>
        <div className="pf-cta">
          <Magnetic href="#work">See my work</Magnetic>
          <Magnetic href={contact.cv} variant="ghost">Open CV (PDF)</Magnetic>
        </div>
      </div>
      <figure className="pf-portrait">
        <img src={photos[0].src} alt={photos[0].alt} />
        <i className="pf-pc a" /><i className="pf-pc b" /><i className="pf-pc c" /><i className="pf-pc d" />
        <figcaption>AO / CAIRO</figcaption>
      </figure>
      <div className="pf-scrollhint" aria-hidden="true"><span /> scroll to warp</div>
    </section>
  )
}

function Marquee() {
  const ref = useRef<HTMLDivElement>(null)
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  useScene(ref, (i) => {
    const half = (a.current?.scrollWidth ?? 2) / 2
    const drift = i.t * 0.035
    const o1 = -((i.y * 0.8 + drift) % half)
    const o2 = -half + ((i.y * 0.8 + drift) % half)
    const sk = clamp(i.vel * -0.5, -14, 14)
    if (a.current) a.current.style.transform = `translate3d(${o1}px,0,0) skewX(${sk}deg)`
    if (b.current) b.current.style.transform = `translate3d(${o2}px,0,0) skewX(${sk}deg)`
  })
  const items = [...stack, ...stack]
  return (
    <div className="pf-marquee" ref={ref} aria-label="Technologies I use">
      <div className="pf-track" ref={a}>{items.map((s, i) => <span key={i}>{s}<b>✦</b></span>)}</div>
      <div className="pf-track pf-track-2" ref={b} aria-hidden="true">{items.map((s, i) => <span key={i}>{s}<b>✦</b></span>)}</div>
    </div>
  )
}

function Shot({ p }: { p: Project }) {
  return (
    <div className="pf-shot">
      <div className="pf-bar"><i /><i /><i /><em>{p.live.replace('https://', '')}</em></div>
      <div className="pf-shot-img">
        <img src={p.shot} alt={`Screenshot of the ${p.title} app`} loading="lazy" />
        <span className="pf-scan" aria-hidden="true" />
      </div>
    </div>
  )
}

function Detail({ p }: { p: Project }) {
  return (
    <div className="pf-detail" key={p.id}>
      <div className="pf-detail-a">
        <p className="pf-kind">{p.index} / {p.kind}</p>
        <h3>{p.title}</h3>
        <p className="pf-blurb">{p.blurb}</p>
      </div>
      <div className="pf-detail-b">
        <ul>{p.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
        <div className="pf-chips">{p.stack.map((s) => <span key={s}>{s}</span>)}</div>
        <div className="pf-links">
          <Magnetic href={p.live} external>{demoLabel(p.live)}</Magnetic>
          <Magnetic href={p.code} external variant="ghost">Source on GitHub</Magnetic>
        </div>
      </div>
    </div>
  )
}

const plateau = (f: number) => {
  if (f < 0.22) return 0
  if (f > 0.78) return 1
  const t = (f - 0.22) / 0.56
  return t * t * (3 - 2 * t)
}

/** Projects as a 3D carousel that scroll turns. Falls back to a plain stack when scroll can't be read or motion is reduced. */
function Work() {
  const { live } = useScroll()
  const [act, setAct] = useState(0)
  const actRef = useRef(0)
  const slides = useRef<(HTMLDivElement | null)[]>([])
  const bar = useRef<HTMLSpanElement>(null)
  const marks = projects.map((_, i) => EXTRA * (0.05 + 0.9 * (i / (n - 1))))

  const onInfo = (i: { rel: number }) => {
    const raw = clamp((i.rel / EXTRA - 0.05) / 0.9) * (n - 1)
    const fl = Math.min(Math.floor(raw), n - 2)
    const pos = fl + plateau(raw - fl)
    slides.current.forEach((el, k) => {
      if (!el) return
      const off = k - pos
      el.style.setProperty('--off', off.toFixed(3))
      el.style.setProperty('--abs', Math.abs(off).toFixed(3))
      el.style.zIndex = String(10 - Math.round(Math.abs(off) * 3))
    })
    if (bar.current) bar.current.style.transform = `scaleX(${(raw / (n - 1)).toFixed(3)})`
    const a = Math.round(pos)
    if (a !== actRef.current) {
      actRef.current = a
      setAct(a)
    }
  }

  if (!live) {
    return (
      <Scene id="work" className="pf-work">
        <div className="pf-work-head"><h2>Selected <em>work</em></h2></div>
        <p className="pf-sub">The five projects I would show first. Screenshots are of the deployed sites. Every other project is in the full list right after.</p>
        <div className="pf-static-list">
          {projects.map((p) => (
            <article key={p.id} className="pf-static" style={css({ '--accent': p.accent })}>
              <Shot p={p} />
              <Detail p={p} />
            </article>
          ))}
        </div>
      </Scene>
    )
  }
  const p = projects[act]
  return (
    <Scene id="work" extra={EXTRA} className="pf-work" onInfo={onInfo} marks={marks}>
      <div className="pf-deck" style={css({ '--accent': p.accent })}>
        <div className="pf-deck-glow" aria-hidden="true" />
        <div className="pf-deck-head">
          <h2>Selected <em>work</em></h2>
          <div className="pf-count" aria-live="polite"><b>0{act + 1}</b><span>/ 0{n}</span></div>
        </div>
        <div
          className="pf-flow"
          role="group"
          aria-label="Projects. Scroll or use the arrow keys."
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goTo(`work-m${Math.min(n - 1, act + 1)}`) }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goTo(`work-m${Math.max(0, act - 1)}`) }
          }}
        >
          {projects.map((pr, k) => (
            <div
              key={pr.id}
              ref={(el) => { slides.current[k] = el }}
              className="pf-slide"
              style={css({ '--off': k, '--abs': k, '--accent': pr.accent })}
              onClick={() => k !== act && goTo(`work-m${k}`)}
            >
              <Shot p={pr} />
              <span className="pf-slide-tag">{pr.index} {pr.title}</span>
            </div>
          ))}
        </div>
        <div className="pf-dots">
          {projects.map((pr, k) => (
            <button key={pr.id} type="button" className={k === act ? 'on' : ''} onClick={() => goTo(`work-m${k}`)} aria-label={`Show ${pr.title}`} aria-current={k === act}>
              <span>{pr.index}</span> {pr.title}
            </button>
          ))}
          <span className="pf-track-bar" aria-hidden="true"><span ref={bar} /></span>
        </div>
        <Detail p={p} />
      </div>
    </Scene>
  )
}

function useWide() {
  const [w, setW] = useState(true)
  useEffect(() => {
    const m = window.matchMedia('(min-width: 900px) and (min-height: 600px)')
    const f = () => setW(m.matches)
    f()
    m.addEventListener('change', f)
    return () => m.removeEventListener('change', f)
  }, [])
  return w
}

const AR_EXTRA = 2000

function RepoLinks({ r }: { r: Repo }) {
  return (
    <div className="pf-links">
      {r.live && <Magnetic href={r.live} external>{demoLabel(r.live)}</Magnetic>}
      <Magnetic href={r.code} external variant="ghost">Source on GitHub</Magnetic>
    </div>
  )
}

/** All public projects. Scroll walks down the list; hover, focus or a click picks one and holds it until you scroll on. */
function Archive() {
  const { live } = useScroll()
  const wide = useWide()
  const N = repos.length
  const [act, setAct] = useState(0)
  const hold = useRef<number | null>(null)
  const last = useRef(0)
  const onInfo = (i: { rel: number }) => {
    last.current = i.rel
    if (hold.current !== null) {
      if (Math.abs(i.rel - hold.current) < 90) return
      hold.current = null
    }
    const k = Math.min(N - 1, Math.max(0, Math.floor(clamp(i.rel / AR_EXTRA) * N)))
    setAct((a) => (a === k ? a : k))
  }
  const pick = (k: number) => {
    hold.current = last.current
    setAct(k)
  }
  const head = (
    <div className="pf-ar-head">
      <h2>All <em>{N}</em> projects</h2>
      <p className="pf-sub">Every public project on my GitHub, strongest first. {liveCount} have a live demo; the rest are code only.{live && wide ? ' Scroll down the list, or hover and click any row.' : ''}</p>
    </div>
  )
  if (!live || !wide) {
    return (
      <Scene id="all" className="pf-ar">
        {head}
        <div className="pf-ar-cards">
          {repos.map((r, k) => (
            <article key={r.repo} className="pf-ar-card">
              {r.shot ? <img src={r.shot} alt={`Screenshot of ${r.title}`} loading="lazy" /> : <div className="pf-ar-noshot"><b>{r.repo}</b><span>code only</span></div>}
              <div>
                <p className="pf-kind">{String(k + 1).padStart(2, '0')} / {r.kind}</p>
                <h3>{r.title}</h3>
                <p className="pf-blurb">{r.blurb}</p>
                <div className="pf-chips">{r.stack.map((s) => <span key={s}>{s}</span>)}</div>
                <RepoLinks r={r} />
              </div>
            </article>
          ))}
        </div>
      </Scene>
    )
  }
  const r = repos[act]
  return (
    <Scene id="all" extra={AR_EXTRA} className="pf-ar" onInfo={onInfo}>
      <div className="pf-ar-in">
        {head}
        <div className="pf-ar-body">
          <ol className="pf-ar-list" aria-label="All projects">
            {repos.map((p, k) => (
              <li key={p.repo}>
                <button type="button" className={k === act ? 'on' : ''} onMouseEnter={() => pick(k)} onFocus={() => pick(k)} onClick={() => pick(k)} aria-current={k === act}>
                  <span className="pf-ar-n">{String(k + 1).padStart(2, '0')}</span>
                  <span className="pf-ar-t">{p.title}</span>
                  <span className="pf-ar-k">{p.kind}</span>
                  <span className={`pf-ar-b${p.live ? ' is-live' : ''}`}>{p.live ? 'live' : 'code'}</span>
                </button>
              </li>
            ))}
          </ol>
          <div className="pf-ar-view" key={r.repo}>
            {r.shot ? (
              <div className="pf-shot">
                <div className="pf-bar"><i /><i /><i /><em>{(r.live ?? r.code).replace('https://', '')}</em></div>
                <div className="pf-shot-img"><img src={r.shot} alt={`Screenshot of ${r.title}`} /><span className="pf-scan" aria-hidden="true" /></div>
              </div>
            ) : (
              <div className="pf-ar-noshot big"><b>{r.repo}</b><span>code only, no live demo</span></div>
            )}
            <p className="pf-kind">{r.featured ? `Featured ${r.featured} / ` : ''}{r.kind}</p>
            <h3>{r.title}</h3>
            <p className="pf-blurb">{r.blurb}</p>
            <div className="pf-chips">{r.stack.map((s) => <span key={s}>{s}</span>)}</div>
            <RepoLinks r={r} />
          </div>
        </div>
      </div>
    </Scene>
  )
}

const FR_EXTRA = 1500

/** Photos as a 3D deck that scroll turns, next to the original About text. The certificate opens full size. */
function Frames() {
  const { live } = useScroll()
  const P = photos.length
  const [act, setAct] = useState(0)
  const actRef = useRef(0)
  const [zoom, setZoom] = useState(false)
  const cards = useRef<(HTMLButtonElement | null)[]>([])
  const onInfo = (i: { rel: number }) => {
    const raw = clamp(i.rel / FR_EXTRA) * (P - 1)
    const fl = Math.min(Math.floor(raw), P - 2)
    const pos = fl + plateau(raw - fl)
    cards.current.forEach((el, k) => {
      if (!el) return
      const off = k - pos
      el.style.setProperty('--off', off.toFixed(3))
      el.style.setProperty('--abs', Math.abs(off).toFixed(3))
      el.style.zIndex = String(10 - Math.round(Math.abs(off) * 3))
    })
    const a = Math.round(pos)
    if (a !== actRef.current) {
      actRef.current = a
      setAct(a)
    }
  }
  useEffect(() => {
    if (!zoom) return
    const f = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(false)
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [zoom])
  const ph = photos[act]
  const story = (
    <div className="pf-me-text">
      <p className="pf-kind">Behind the code</p>
      <h2>Ahmed Osama <em>Fathy</em></h2>
      <p className="pf-blurb">I started my journey with a passion for building interfaces that don&apos;t just work, but feel right. Over the past year, I&apos;ve specialized in React and Next.js to deliver high-performance applications.</p>
      <ul className="pf-vals">
        {values.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
      </ul>
    </div>
  )
  if (!live) {
    return (
      <Scene id="me" className="pf-me">
        <div className="pf-me-static">
          {story}
          <div className="pf-me-grid">
            {photos.map((p) => (
              <figure key={p.src}><img src={p.src} alt={p.alt} loading="lazy" /><figcaption>{p.tag}</figcaption></figure>
            ))}
          </div>
        </div>
      </Scene>
    )
  }
  return (
    <Scene id="me" extra={FR_EXTRA} className="pf-me" onInfo={onInfo}>
      <div className="pf-me-in">
        {story}
        <div className="pf-me-deck">
          <div className="pf-me-flow" role="group" aria-label="Photos. Scroll to turn them.">
            {photos.map((p, k) => (
              <button
                key={p.src}
                type="button"
                ref={(el) => { cards.current[k] = el }}
                className="pf-me-card"
                style={css({ '--off': k, '--abs': k })}
                onClick={() => (k === act ? setZoom(true) : goTo('me'))}
                aria-label={k === act ? `Open ${p.tag} full size` : p.alt}
              >
                <img src={p.src} alt={p.alt} />
              </button>
            ))}
          </div>
          <p className="pf-me-cap" aria-live="polite"><b>{ph.tag}</b><span>{ph.note}</span><em>{act + 1} / {P}</em></p>
        </div>
        {zoom && (
          <div className="pf-zoom" role="dialog" aria-label={ph.alt} onClick={() => setZoom(false)}>
            <img src={ph.src} alt={ph.alt} />
            <button type="button" className="btn btn-ghost" onClick={() => setZoom(false)}>Close</button>
          </div>
        )}
      </div>
    </Scene>
  )
}

const words = 'I build fast, typed, carefully animated interfaces with React and Next.js, and ship them live.'.split(' ')
function Statement() {
  return (
    <Scene id="about" extra={ST_EXTRA} className="pf-statement">
      <p className="pf-words" style={css({ '--n': words.length })}>
        {words.map((w, i) => (
          <span key={i} className={/^(React|Next\.js,|ship|live\.)$/.test(w) ? 'hot' : ''} style={css({ '--i': i })}>{w}</span>
        ))}
      </p>
      <dl className="pf-specs">
        <div><dt>Education</dt><dd>Bachelor of Management Information Systems, Al-Jazeera High Institute, class of 2025</dd></div>
        <div><dt>Languages</dt><dd>Arabic native. English good for technical work.</dd></div>
        <div><dt>Shipped</dt><dd>{repos.length} public projects on GitHub, {liveCount} with a live demo</dd></div>
        <div><dt>Based in</dt><dd>Cairo, Egypt</dd></div>
      </dl>
    </Scene>
  )
}

const techs = Array.from(new Set([...projects.flatMap((p) => p.stack), ...stack]))
type Focus = { k: 'p' | 't'; i: number } | null

/** Stack as a graph: projects on the inner ring, tools on the outer ring, a line for every tool a project uses. Scroll turns the rings. */
function Graph() {
  const wrap = useRef<HTMLDivElement>(null)
  const cv = useRef<HTMLCanvasElement>(null)
  const status = useRef<HTMLParagraphElement>(null)
  const rot = useRef(0)
  const focus = useRef<Focus>(null)
  const redraw = useRef<() => void>(() => {})
  const [sel, setSel] = useState<number | null>(null)
  const reduced = useReducedMotion()
  useScene(wrap, (i) => {
    rot.current = i.progress
  })

  const say = (f: Focus) => {
    if (!status.current) return
    if (!f) status.current.textContent = 'Tap a project or a tool to follow the lines.'
    else if (f.k === 'p') status.current.textContent = `${projects[f.i].title}: ${projects[f.i].stack.join(', ')}`
    else {
      const users = projects.filter((p) => p.stack.includes(techs[f.i])).map((p) => p.title)
      status.current.textContent = users.length ? `${techs[f.i]}: used in ${users.join(', ')}` : `${techs[f.i]}: in my toolkit`
    }
  }
  const setFocus = (f: Focus) => {
    focus.current = f
    setSel(f && f.k === 'p' ? f.i : null)
    say(f)
    redraw.current()
  }

  useEffect(() => {
    const c = cv.current
    const host = wrap.current
    if (!c || !host) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0, raf = 0
    const pos = { p: [] as { x: number; y: number }[], t: [] as { x: number; y: number; a: number }[] }
    const resize = () => {
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const draw = (time: number) => {
      const f = focus.current
      const cx = w / 2, cy = h / 2
      const small = w < 560
      const Ro = Math.min(w, h) / 2 - (small ? 52 : 92)
      const Ri = Ro * 0.42
      const sp = rot.current
      const to = sp * 1.5 + (reduced ? 0 : time * 0.00004)
      const pi = -sp * 1.1 - (reduced ? 0 : time * 0.00006)
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      ;[Ro, Ri].forEach((r, k) => {
        ctx.strokeStyle = k ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.06)'
        ctx.setLineDash([2, 7])
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, 7)
        ctx.stroke()
        ctx.setLineDash([])
      })
      pos.t = techs.map((_, i) => {
        const a = to + (i / techs.length) * Math.PI * 2 - Math.PI / 2
        return { x: cx + Math.cos(a) * Ro, y: cy + Math.sin(a) * Ro, a }
      })
      pos.p = projects.map((_, k) => {
        const a = pi + (k / projects.length) * Math.PI * 2 - Math.PI / 2
        return { x: cx + Math.cos(a) * Ri, y: cy + Math.sin(a) * Ri }
      })
      const used = (ti: number, pk: number) => projects[pk].stack.includes(techs[ti])
      const lit = (ti: number, pk: number) => !f || (f.k === 'p' ? f.i === pk : f.i === ti)
      projects.forEach((p, pk) => {
        techs.forEach((_, ti) => {
          if (!used(ti, pk)) return
          const on = lit(ti, pk)
          ctx.strokeStyle = p.accent + (on ? (f ? 'dd' : '77') : '14')
          ctx.lineWidth = on && f ? 1.8 : 1
          ctx.beginPath()
          ctx.moveTo(pos.p[pk].x, pos.p[pk].y)
          ctx.lineTo(pos.t[ti].x, pos.t[ti].y)
          ctx.stroke()
        })
      })
      ctx.font = `${small ? 10 : 12}px ui-monospace, Menlo, Consolas, monospace`
      ctx.textBaseline = 'middle'
      techs.forEach((t, ti) => {
        const P = pos.t[ti]
        const users = projects.map((_, pk) => (used(ti, pk) ? pk : -1)).filter((v) => v >= 0)
        const on = !f || (f.k === 't' ? f.i === ti : users.includes(f.i))
        const r = users.length > 1 ? 6 : 4
        ctx.fillStyle = on ? (users.length ? '#c8ff3d' : '#8f9ab0') : 'rgba(255,255,255,0.15)'
        ctx.beginPath()
        ctx.arc(P.x, P.y, r, 0, 7)
        ctx.fill()
        if (users.length > 1 && on) {
          ctx.strokeStyle = 'rgba(200,255,61,.45)'
          ctx.beginPath()
          ctx.arc(P.x, P.y, r + 5, 0, 7)
          ctx.stroke()
        }
        const right = Math.cos(P.a) >= 0
        ctx.textAlign = right ? 'left' : 'right'
        ctx.fillStyle = on ? '#e9edf7' : 'rgba(233,237,247,0.25)'
        const tw = ctx.measureText(t).width
        let lx = P.x + Math.cos(P.a) * 14
        lx = right ? Math.min(lx, w - 6 - tw) : Math.max(lx, 6 + tw)
        ctx.fillText(t, lx, P.y + Math.sin(P.a) * 14)
      })
      projects.forEach((p, pk) => {
        const P = pos.p[pk]
        const on = !f || (f.k === 'p' ? f.i === pk : used(f.i, pk))
        const r = small ? 20 : 26
        const g = ctx.createRadialGradient(P.x, P.y, 0, P.x, P.y, r * 2.2)
        g.addColorStop(0, p.accent + (on ? '66' : '14'))
        g.addColorStop(1, p.accent + '00')
        ctx.fillStyle = g
        ctx.fillRect(P.x - r * 2.2, P.y - r * 2.2, r * 4.4, r * 4.4)
        ctx.fillStyle = '#07080d'
        ctx.strokeStyle = on ? p.accent : p.accent + '44'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(P.x, P.y, r, 0, 7)
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = on ? p.accent : p.accent + '66'
        ctx.textAlign = 'center'
        ctx.font = `700 ${small ? 12 : 15}px ui-monospace, Menlo, Consolas, monospace`
        ctx.fillText(p.index, P.x, P.y)
        ctx.font = `${small ? 10 : 12}px ui-monospace, Menlo, Consolas, monospace`
      })
      ctx.fillStyle = '#c8ff3d'
      ctx.textAlign = 'center'
      ctx.font = `700 ${small ? 14 : 18}px ui-monospace, Menlo, Consolas, monospace`
      ctx.fillText('AO', cx, cy)
    }
    const loop = (t: number) => {
      draw(t)
      raf = requestAnimationFrame(loop)
    }
    redraw.current = () => draw(performance.now())
    const hit = (e: PointerEvent): Focus => {
      const r = c.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      let best: Focus = null
      let bd = e.pointerType === 'mouse' ? 30 : 38
      pos.p.forEach((P, i) => {
        const d = Math.hypot(P.x - x, P.y - y) - 10
        if (d < bd) { bd = d; best = { k: 'p', i } }
      })
      pos.t.forEach((P, i) => {
        const d = Math.hypot(P.x - x, P.y - y)
        if (d < bd) { bd = d; best = { k: 't', i } }
      })
      return best
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const f = hit(e)
      const cur = focus.current
      if ((f?.k ?? '') !== (cur?.k ?? '') || (f?.i ?? -1) !== (cur?.i ?? -1)) setFocus(f)
      c.style.cursor = f ? 'pointer' : 'default'
    }
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      const f = hit(e)
      setFocus(f && focus.current && f.k === focus.current.k && f.i === focus.current.i ? null : f)
    }
    const leave = () => setFocus(null)
    resize()
    draw(0)
    if (!reduced) raf = requestAnimationFrame(loop)
    const ro = new ResizeObserver(() => {
      resize()
      draw(performance.now())
    })
    ro.observe(c)
    c.addEventListener('pointermove', move)
    c.addEventListener('pointerdown', down)
    c.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      c.removeEventListener('pointermove', move)
      c.removeEventListener('pointerdown', down)
      c.removeEventListener('pointerleave', leave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])

  return (
    <Scene id="stack" className="pf-stack">
      <div className="pf-stack-head">
        <h2>How it <em>connects</em></h2>
        <p className="pf-sub">Projects in the middle, tools around them. Bright rings are tools shared by more than one project.</p>
      </div>
      <div className="pf-graph" ref={wrap}>
        <canvas ref={cv} role="img" aria-label="Graph linking each project to the tools it uses. The same information is listed in the buttons below." />
      </div>
      <div className="pf-legend">
        {projects.map((p, k) => (
          <button key={p.id} type="button" className={sel === k ? 'on' : ''} style={css({ '--accent': p.accent })} aria-pressed={sel === k} onClick={() => setFocus(sel === k ? null : { k: 'p', i: k })}>
            <i /> {p.title}
          </button>
        ))}
      </div>
      <p className="pf-status" ref={status} aria-live="polite">Tap a project or a tool to follow the lines.</p>
    </Scene>
  )
}

/** Every feature from the five featured projects as a typographic index. Rows light up as they cross the middle of the screen. */
function Index() {
  const ref = useRef<HTMLDivElement>(null)
  const { live } = useScroll()
  useScene(ref, (i) => {
    const root = ref.current
    if (!root) return
    const mid = i.y + i.h * 0.5
    const rt = (root.closest('.pf-root') ?? root).getBoundingClientRect().top
    root.querySelectorAll<HTMLElement>('.pf-row').forEach((r) => {
      const b = r.getBoundingClientRect()
      const c = b.top - rt + b.height / 2
      r.style.setProperty('--lit', clamp(1 - Math.abs(c - mid) / (i.h * 0.32)).toFixed(3))
    })
  })
  return (
    <Scene id="index" className="pf-index">
      <div className="pf-index-head">
        <h2>Everything <em>inside</em></h2>
        <p className="pf-sub">{features.length} features across the five featured projects, taken from their READMEs, code and CV write-ups.{live ? ' Scroll through.' : ''}</p>
      </div>
      <div ref={ref} className="pf-rows">
        {featuresSorted.map((f, i) => (
          <div key={i} className="pf-row" style={css({ '--accent': projects[f.p].accent })}>
            <span className="pf-row-n">{String(i + 1).padStart(2, '0')}</span>
            <span className="pf-row-t">{f.text}</span>
            <span className="pf-row-p">{projects[f.p].title}</span>
          </div>
        ))}
      </div>
    </Scene>
  )
}

const lines = [
  ['whoami', 'Ahmed Osama Fathy, Frontend Developer'],
  ['location', 'Cairo, Egypt'],
  ['stack', 'React, Next.js, TypeScript'],
  ['contact', '--open'],
]
function Terminal() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const full = lines.map(([a, b]) => `> ${a}\n  ${b}`).join('\n')
  const [txt, setTxt] = useState(reduced ? full : '')
  useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let timer = 0
    const io = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting) return
      io.disconnect()
      let k = 0
      const step = () => {
        k += 2
        setTxt(full.slice(0, k))
        if (k < full.length) timer = window.setTimeout(step, 22)
      }
      step()
    }, { threshold: 0.4 })
    io.observe(el)
    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [reduced, full])
  return (
    <div className="pf-term" ref={ref}>
      <div className="pf-term-bar"><i /><i /><i /><em>ahmed@portfolio</em></div>
      <pre aria-hidden="true">{txt}<span className="pf-caret" /></pre>
      <p className="pf-sr">Ahmed Osama Fathy, Frontend Developer, Cairo, Egypt. React, Next.js, TypeScript.</p>
    </div>
  )
}

const channels: [string, string, string, boolean][] = [
  ['Email', contact.email, `mailto:${contact.email}`, false],
  ['LinkedIn', 'Ahmed Osama', contact.linkedin, true],
  ['GitHub', 'ahmedosama0038', contact.github, true],
  ['WhatsApp', contact.phone, contact.whatsapp, true],
  ['Instagram', '__a7med__72', contact.instagram, true],
  ['CV', 'One page, PDF', contact.cv, false],
]

const FORM_URL = 'https://formcarry.com/s/_Wt6RDf4nbx'

/** Sends through the same form service the old site used. Says "sent" only when the service confirms it. */
function MessageForm() {
  const [st, setSt] = useState<'idle' | 'sending' | 'ok' | 'err' | 'bad'>('idle')
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const d = new FormData(form)
    const ok = String(d.get('name') ?? '').trim() && /^\S+@\S+\.\S+$/.test(String(d.get('email') ?? '')) && String(d.get('message') ?? '').trim()
    if (!ok) { setSt('bad'); return }
    setSt('sending')
    try {
      const res = await fetch(FORM_URL, { method: 'POST', body: d, headers: { Accept: 'application/json' } })
      const j = await res.json().catch(() => ({}))
      if (res.ok && (j.status === 'success' || j.code === 200)) { setSt('ok'); form.reset() } else setSt('err')
    } catch {
      setSt('err')
    }
  }
  return (
    <form className="pf-form" onSubmit={submit} noValidate>
      <label><span>Name</span><input name="name" autoComplete="name" required /></label>
      <label><span>Email</span><input name="email" type="email" autoComplete="email" required /></label>
      <label><span>Message</span><textarea name="message" rows={3} required /></label>
      <button className="btn btn-solid" type="submit" disabled={st === 'sending'}><span>{st === 'sending' ? 'Sending...' : 'Send message'}</span></button>
      <p className="pf-form-st" role="status" aria-live="polite">
        {st === 'ok' && 'Sent. Thank you, I will reply by email.'}
        {st === 'err' && `Could not send from here. Please email ${contact.email} instead.`}
        {st === 'bad' && 'Please fill in your name, a valid email and a message.'}
      </p>
    </form>
  )
}

function Contact() {
  const [writing, setWriting] = useState(false)
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied('ok')
    } catch {
      setCopied('fail')
      setTimeout(() => {
        const el = document.getElementById('pf-email-sel')
        const sel = window.getSelection()
        if (el && sel) { const r = document.createRange(); r.selectNodeContents(el); sel.removeAllRanges(); sel.addRange(r) }
      }, 50)
      return
    }
    setTimeout(() => setCopied('idle'), 2200)
  }
  return (
    <Scene id="contact" extra={CT_EXTRA} className="pf-contact">
      <div className="pf-tunnel" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="pf-contact-grid">
        <div className="pf-contact-l">
          <h2 className="pf-big">Let&apos;s build <em>something</em>.</h2>
          {writing ? <MessageForm /> : <Terminal />}
          <div className="pf-contact-btns">
            <button className="btn btn-solid" onClick={() => setWriting((w) => !w)} type="button" aria-expanded={writing}>
              <span>{writing ? 'Back' : 'Write a message'}</span>
            </button>
            <button className="btn btn-ghost pf-copy" onClick={copy} type="button" aria-live="polite">
              <span>{copied === 'ok' ? 'Email copied ✓' : copied === 'fail' ? 'Not copied. Select the address below.' : 'Copy email address'}</span>
            </button>
          </div>
          {copied === 'fail' && <p className="pf-sel" id="pf-email-sel">{contact.email}</p>}
        </div>
        <ul className="pf-channels">
          {channels.map(([label, value, href, ext]) => (
            <li key={label}>
              <a href={href} {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}>
                <span className="pf-ch-l">{label}</span>
                <span className="pf-ch-v">{value}</span>
                <b aria-hidden="true">↗</b>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <footer>© {new Date().getFullYear()} Ahmed Osama Fathy</footer>
    </Scene>
  )
}

const SECTIONS = [['top', 'Intro'], ['work', 'Work'], ['all', 'All'], ['about', 'About'], ['me', 'Me'], ['stack', 'Stack'], ['index', 'Index'], ['contact', 'Contact']] as const

/** Progress bar and section dots that follow the viewport (a fixed element would sit at the top of a tall frame). */
function Rail() {
  const { live } = useScroll()
  const ref = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const items = useRef<(HTMLButtonElement | null)[]>([])
  const total = useRef(0)
  useScene(ref, (i) => {
    const root = ref.current?.parentElement
    if (!root || !ref.current) return
    total.current = root.scrollHeight
    ref.current.style.transform = `translate3d(0,${i.y.toFixed(1)}px,0)`
    ref.current.style.height = `${i.h}px`
    const p = clamp(i.y / Math.max(1, total.current - i.h))
    if (fill.current) fill.current.style.transform = `scaleX(${p.toFixed(4)})`
    const rt = root.getBoundingClientRect().top
    let cur = 0
    SECTIONS.forEach(([id], k) => {
      const el = document.getElementById(id)
      if (el && el.getBoundingClientRect().top - rt <= i.y + i.h * 0.45) cur = k
    })
    items.current.forEach((b, k) => b?.classList.toggle('on', k === cur))
  })
  if (!live) return null
  return (
    <div className="pf-rail" ref={ref}>
      <span className="pf-rail-bar"><span ref={fill} /></span>
      <nav aria-label="Page sections">
        {SECTIONS.map(([id, label], k) => (
          <button key={id} type="button" ref={(el) => { items.current[k] = el }} onClick={() => goTo(id)} aria-label={`Go to ${label}`}>
            <em>{label}</em><i />
          </button>
        ))}
      </nav>
    </div>
  )
}

export default function App() {
  return (
    <ScrollRoot>
      <Rail />
      <Hero />
      <Marquee />
      <Work />
      <Archive />
      <Statement />
      <Frames />
      <Graph />
      <Index />
      <Contact />
    </ScrollRoot>
  )
}
