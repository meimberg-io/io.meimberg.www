'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

interface NewsletterFormProps {
  variant?: 'default' | 'highlight'
  title?: string
  description?: string
}

const DEFAULTS = {
  title: 'Abonniere meinen Newsletter!',
  description: 'Wöchentliche Updates zu Tools, KI und digitalem Alltag. Ohne Buzzword-Bingo. E-Mail eintragen und los.',
}

export default function NewsletterForm({ variant, title, description }: NewsletterFormProps = {}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
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
      <div className={`rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40 ${variant === 'highlight' ? 'bg-zinc-50 dark:bg-zinc-800/50' : ''}`}>
        {status === 'success' ? (
          <>
            <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <Mail className="h-6 w-6 flex-none text-teal-500" />
              <span className="ml-3">Newsletter abonnieren – Bestätigung nötig</span>
            </h2>
            <hr className="mt-4 border-t border-zinc-100 dark:border-zinc-700/40 mb-8" />
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Danke! <b>Prüfe dein Postfach!</b> – Du hast eine Bestätigungsmail erhalten.
            </p>
         
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Ich freue mich riesig, dass du dabei bist!
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 font-bold">
              Oli
            </p>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <Mail className="h-6 w-6 flex-none text-teal-500" />
              <span className="ml-3">{title || DEFAULTS.title}</span>
            </h2>
            <hr className="mt-4 border-t border-zinc-100 dark:border-zinc-700/40 mb-8" />
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              {description || DEFAULTS.description}
            </p>
            <div className="mt-6 flex items-center">
              <span className="flex min-w-0 flex-auto p-px">
                <input
                  type="email"
                  id="bd-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="deine@email.de"
                  aria-label="E-Mail-Adresse"
                  disabled={status === 'loading'}
                  className="w-full appearance-none rounded-lg bg-white px-3 py-2 text-sm text-zinc-900 shadow-md shadow-zinc-800/5 outline outline-zinc-900/10 placeholder:text-zinc-400 focus:ring-4 focus:ring-teal-500/10 focus:outline-teal-500 disabled:opacity-60 sm:text-sm dark:outline-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-teal-400/10 dark:focus:outline-teal-400"
                />
              </span>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="ml-4 flex-none cursor-pointer inline-flex items-center justify-center gap-2 rounded-md py-2                 px-3 text-sm font-semibold outline-offset-2 transition                 bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-800  disabled:opacity-60                  dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:black "               >
                {status === 'loading' ? 'Wird gesendet…' : 'Abonnieren'}
              </button>
            </div>
            {status === 'error' && message && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
                {message}
              </p>
            )}
          </form>
        )}
      </div>
  )
}
