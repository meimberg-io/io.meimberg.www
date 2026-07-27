import { ISbStoryData } from '@storyblok/react'
import {
  COMPONENTTYPE_SPECIAL,
  COMPONENTTYPE_SPECIALCHAPTER
} from '@/lib/storyblokShared'

/** Ein Kapitel, reduziert auf das, was Navigation und Verzeichnis brauchen. */
export interface SpecialChapterSummary {
  uuid: string
  fullSlug: string
  title: string
  abstract: string
}

export interface SpecialContextValue {
  /** Pfad der Übersicht ohne führenden Slash, z. B. 's/netzkultur'. */
  specialPath: string
  specialTitle: string
  chapters: SpecialChapterSummary[]
}

/**
 * Schneidet aus dem full_slug einer Story den Pfad ihres Specials heraus.
 * 's/netzkultur/usenet' → 's/netzkultur'
 * 's/netzkultur'        → 's/netzkultur'
 */
export function specialPathFromSlug(fullSlug: string): string {
  return fullSlug.split('/').filter(Boolean).slice(0, 2).join('/')
}

function storyTitle(story: ISbStoryData): string {
  const content = story.content as { pagetitle?: string } | undefined
  return content?.pagetitle?.trim() || story.name?.trim() || ''
}

/**
 * Trennt den Ordnerinhalt in Übersicht und Kapitel. Die Reihenfolge der
 * Kapitel kommt aus der API (sort_by=position:asc) und wird hier nicht
 * angefasst.
 *
 * fallbackTitle greift, wenn die Übersichts-Story nicht Teil der Ordner-
 * Antwort ist — dann ist sie die gerade gerenderte Story und der Aufrufer
 * kennt ihren Titel bereits.
 */
export function buildSpecialContext(
  specialPath: string,
  stories: ISbStoryData[],
  fallbackTitle = ''
): SpecialContextValue {
  const overview = stories.find(
    (story) => (story.content as { component?: string })?.component === COMPONENTTYPE_SPECIAL
  )
  const chapters = stories
    .filter(
      (story) =>
        (story.content as { component?: string })?.component === COMPONENTTYPE_SPECIALCHAPTER
    )
    .map((story) => ({
      uuid: story.uuid,
      fullSlug: story.full_slug,
      title: storyTitle(story),
      abstract: ((story.content as { abstract?: string })?.abstract ?? '').trim()
    }))

  return {
    specialPath,
    specialTitle: overview ? storyTitle(overview) : fallbackTitle,
    chapters
  }
}
