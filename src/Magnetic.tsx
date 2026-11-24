import { useRef, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  href: string
  variant?: 'solid' | 'ghost'
  external?: boolean
}

/** Link that leans toward the pointer. */
export default function Magnetic({ children, href, variant = 'solid', external = false }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)
  return (
    <a
      ref={ref}
      href={href}
      className={`btn btn-${variant}`}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      onPointerMove={(e) => {
        const el = ref.current
        if (!el || e.pointerType !== 'mouse') return
        const r = el.getBoundingClientRect()
        el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.3}px, ${(e.clientY - (r.top + r.height / 2)) * 0.4}px)`
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = ''
      }}
    >
      <span>{children}</span>
    </a>
  )
}
