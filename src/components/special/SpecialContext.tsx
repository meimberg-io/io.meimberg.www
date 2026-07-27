'use client'

import { createContext, useContext } from 'react'
import type { SpecialContextValue } from '@/lib/specials'

const EMPTY: SpecialContextValue = {
  specialPath: '',
  specialTitle: '',
  chapters: []
}

const SpecialContext = createContext<SpecialContextValue>(EMPTY)

export function SpecialProvider({
  value,
  children
}: {
  value: SpecialContextValue
  children: React.ReactNode
}) {
  return <SpecialContext.Provider value={value}>{children}</SpecialContext.Provider>
}

/**
 * Liefert die Kapiteldaten des umgebenden Specials. Ohne Provider kommt ein
 * leerer Wert zurück statt eines Fehlers: im Storyblok-Visual-Editor kann eine
 * Story auch außerhalb des normalen Renderpfads gerendert werden, und ein
 * Throw würde dort die Vorschau schwarz schalten statt nur die Navigation
 * wegzulassen.
 *
 * Achtung: React Context ist nur in Client Components lesbar. Bloks, die über
 * StoryblokServerComponent gerendert werden, sind Server Components und
 * erhalten von useSpecial() daher immer den leeren Default-Wert, unabhängig
 * vom Provider.
 */
export function useSpecial(): SpecialContextValue {
  return useContext(SpecialContext)
}
