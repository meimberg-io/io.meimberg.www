'use client'

/* ============================================================================
 * NewsletterFormSticky
 * ----------------------------------------------------------------------------
 * Sticky "floating" newsletter card for the blog article right rail.
 * - Same submit logic / endpoint as NewsletterForm (/api/newsletter).
 * - Reading-progress ring around the mail badge, driven by the <article>'s
 *   scroll position (pass its ref, or it falls back to document.querySelector).
 * - Subtle float + entrance, no extra dependencies, no global CSS.
 *
 * Drop this file next to NewsletterForm.tsx:
 *   src/components/elements/NewsletterFormSticky.tsx
 * ==========================================================================*/

import { useEffect, useRef, useState } from 'react'
import { Mail } from 'lucide-react'

interface NewsletterFormStickyProps {
  /** Ref to the <article> element whose scroll progress drives the ring. */
  articleRef?: React.RefObject<HTMLElement | null>
  title?: string
  description?: string
}

const DEFAULTS = {
  title: 'Abonniere meinen Newsletter',
  description:
    'Wöchentliche Updates zu Tools, KI und digitalem Alltag. Ohne Buzzword-Bingo — E-Mail eintragen und los.',
}

const RING_R = 19
const RING_C = 2 * Math.PI * RING_R // ≈ 119.38

export default function NewsletterFormSticky({
  articleRef,
  title,
  description,
}: NewsletterFormStickyProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [progress, setProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  const floatRef = useRef<HTMLDivElement>(null)

  // One rAF loop drives reading-progress + a gentle float. Robust + cheap.
  useEffect(() => {
    setMounted(true)
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    const t0 = performance.now()
    const loop = (t: number) => {
      const e = (t - t0) / 1000
      const art = articleRef?.current ?? document.querySelector('article')
      if (art) {
        const total = art.offsetHeight - window.innerHeight
        const p = total > 0 ? Math.max(0, Math.min(1, -art.getBoundingClientRect().top / total)) : 0
        setProgress((prev) => (Math.abs(p - prev) > 0.0015 ? p : prev))
      }
      if (floatRef.current) {
        floatRef.current.style.transform = prefersReduced
          ? 'none'
          : `translateY(${(-7 * Math.sin((e * Math.PI) / 3)).toFixed(2)}px)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [articleRef])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data?.error || 'Etwas ist schiefgelaufen.')
      }
    } catch {
      setStatus('error')
      setMessage('Netzwerkfehler. Bitte später erneut versuchen.')
    }
  }

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        mounted ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'
      }`}
    >
      <div ref={floatRef} className="will-change-transform">
        <div className="relative rounded-2xl border border-border-subtle bg-zinc-50 p-6 shadow-2xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-black/20 dark:bg-zinc-800/50 dark:shadow-black/60 dark:hover:shadow-black/80">
          {/* badge with reading-progress ring + heading */}
          <div className="mt-1.5 mb-4 flex items-center gap-3">
            <div className="relative flex h-11 w-11 flex-none items-center justify-center rounded-full">
              <svg className="absolute inset-0 -rotate-90" width="44" height="44" viewBox="0 0 44 44" aria-hidden>
                <circle cx="22" cy="22" r={RING_R} fill="none" strokeWidth="2.5" className="stroke-zinc-300 dark:stroke-white/10" />
                <circle
                  cx="22"
                  cy="22"
                  r={RING_R}
                  fill="none"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="stroke-primary"
                  style={{
                    strokeDasharray: RING_C,
                    strokeDashoffset: RING_C * (1 - progress),
                    transition: 'stroke-dashoffset .15s linear',
                  }}
                />
              </svg>
              <Mail className="relative h-5 w-5 text-primary" />
            </div>
            <div className="font-headline text-[17px] leading-tight font-semibold text-primary">
              {title || DEFAULTS.title}
            </div>
          </div>

          {status === 'success' ? (
            <div className="flex flex-col items-center px-1 pt-1 pb-1 text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-primary/35 bg-primary/15">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="font-headline text-[15px] font-semibold text-primary">Prüfe dein Postfach!</p>
              <p className="mt-1 text-[13px] leading-snug text-body">
                Du hast eine Bestätigungsmail erhalten. Ich freue mich, dass du dabei bist! — Oli
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="mb-4 text-sm leading-relaxed text-body">{description || DEFAULTS.description}</p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  id="bd-email-sticky"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="deine@email.de"
                  aria-label="E-Mail-Adresse"
                  disabled={status === 'loading'}
                  className="w-full appearance-none rounded-lg bg-white px-3 py-2 text-sm text-zinc-900 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-accent/10 focus:outline-accent disabled:opacity-60 dark:outline-zinc-700 dark:placeholder:text-zinc-500"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-zinc-900 transition outline-offset-2 hover:bg-primary-hover active:bg-primary disabled:opacity-60"
                >
                  {status === 'loading' ? 'Wird gesendet…' : 'Abonnieren'}
                </button>
              </div>
              {status === 'error' && message && (
                <p className="mt-2 text-sm text-destructive" role="alert">
                  {message}
                </p>
              )}
              <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-subtle-foreground">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                Kein Spam. Jederzeit abbestellbar.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
