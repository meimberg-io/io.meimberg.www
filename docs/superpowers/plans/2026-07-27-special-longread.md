# Content-Format „Special" — Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ein mehrteiliger Longread („Special") mit einer Übersichtsseite und beliebig vielen Kapitelseiten, die über einen Storyblok-Ordner zusammengehalten und über eine klebende Sidebar navigiert werden.

**Architecture:** Zwei neue Storyblok-Content-Types (`special`, `specialchapter`) in einem Ordner pro Special unter `s/`. Die Kapitelreihenfolge kommt aus Storybloks manueller Ordner-Sortierung (`position`), nicht aus einem Feld. `renderPage()` erkennt beide Typen, lädt den Ordnerinhalt einmalig und stellt ihn über einen Client-Context bereit, den Sidebar, Verzeichnis und Zurück/Weiter lesen. Damit entfällt die sonst übliche Server/Client-Doppelung der Storyblok-Blöcke.

**Tech Stack:** Next.js 15 (App Router, RSC), React 19, TypeScript, Tailwind CSS 4, `@storyblok/react` 5.

**Spec:** `docs/superpowers/specs/2026-07-27-special-longread-design.md`

## Global Constraints

- **Keine Testinfrastruktur im Repo.** Es gibt kein vitest/jest, keine Testdateien, kein `test`-Script. Verifikation erfolgt über **`make check`** (Lint + `tsc --noEmit`) und die manuellen Browser-Checks in den Tasks. Kein Test-Framework einführen.
- **Niemals `npm run build` als Gate benutzen, solange ein Dev-Server läuft.** `next build` und `next dev` schreiben beide nach `.next`. Ein Build zieht dem laufenden Dev-Server die Chunks unter den Füßen weg; die Folge sind Laufzeitfehler wie `Cannot find module './873.js'` oder `Cannot read properties of undefined (reading 'prototype')`, die aussehen wie Fehler im eigenen Code und keine sind. `make check` prüft dieselben Typen in einer Sekunde und fasst `.next` nicht an. (In dieser Umsetzung real passiert.)
- **Semantische Farb-Tokens verwenden**, nie rohe Paletten-Werte. Definiert und dokumentiert in `src/styles/tailwind.css`:
  - `text-display` H1 · `text-lead` Vorspann · `text-accent` Content-Überschriften und dekorative Highlights
  - `text-internal` / `hover:text-internal-hover` für **interne Navigation** (die Kapitelnavigation gehört hierher) · `text-interactive` nur für externe Links und generische Aktionen
  - `text-foreground`, `text-foreground-strong`, `text-body`, `text-muted-foreground`, `text-subtle-foreground`
  - `bg-surface`, `bg-muted`, `border-border`, `border-border-subtle`
- **Einrückung:** 2 Leerzeichen (Stil der neueren Dateien wie `BlogLayout.tsx`, `BlogCardList.tsx`).
- **Ordner-Prefix:** `s/` — Konstante `STORYBLOK_FOLDER_SPECIALS`, nie als Literal im Code.
- **Commit-Stil:** deutsche, prägnante Subject-Line ohne Prefix (siehe `git log`). Kein Ticketsystem in diesem Repo. **Niemals pushen.**
- **Kein `chapternumber`-Feld.** Die Kapitelnummer ist immer der Index in der sortierten Liste.

## Abweichung von der Spec

Die Spec ordnet `fetchSpecialChapters()` der neuen Datei `src/lib/specials.ts` zu. Der Storyblok-Client (`getStoryblokApi()`) ist aber modul-privat in `src/lib/storyblokApi.ts` und wird dort gecacht. Deshalb:

- **`src/lib/storyblokApi.ts`** bekommt `fetchSpecialFolder()` — der einzige Ort mit API-Zugriff, wie bisher.
- **`src/lib/specials.ts`** bleibt frei von API- und React-Abhängigkeiten: nur Pfad-Zerlegung und das Umformen der Stories in die Context-Struktur.

Zweite, kleinere Abweichung: die Spec beschreibt einen Query mit `filter_query: component in specialchapter`. Der Plan lädt stattdessen den **gesamten Ordner** ohne Component-Filter und trennt Übersicht und Kapitel im Code. Grund: die Sidebar braucht auf Kapitelseiten auch den Titel des Specials für den Rücklink. Ohne diesen Trick wäre dafür ein zweiter API-Call nötig.

## Dateiübersicht

| Datei | Verantwortung |
|---|---|
| `src/lib/storyblokShared.ts` (M) | Konstanten: Component-Typen, Ordner-Prefix, `STORY_TYPES` |
| `src/lib/storyblokApi.ts` (M) | `fetchSpecialFolder()` — einziger API-Zugriff |
| `src/lib/specials.ts` (C) | reine Logik: Pfad zerlegen, Stories → Context-Struktur. Kein React, keine API |
| `src/components/special/SpecialContext.tsx` (C) | Provider + `useSpecial()` |
| `src/lib/pageRenderer.tsx` (M) | Typ-Weiche, Ordner laden, Provider setzen |
| `src/components/pagetypes/Special.tsx` (C) | Content-Type `special` |
| `src/components/pagetypes/SpecialChapter.tsx` (C) | Content-Type `specialchapter` |
| `src/components/layout/SpecialLayout.tsx` (C) | Übersicht: Header, Titel, Body, Verzeichnis |
| `src/components/layout/SpecialChapterLayout.tsx` (C) | Kapitel: Zweispalter Sidebar + Text |
| `src/components/special/ChapterIndex.tsx` (C) | Kapitelverzeichnis auf der Übersicht |
| `src/components/special/ChapterNav.tsx` (C) | Sidebar und eingeklappte Leiste |
| `src/components/special/ChapterPagination.tsx` (C) | Zurück / Weiter / Zur Übersicht |
| `src/lib/storyblok.ts` (M) | beide Komponenten registrieren |
| `src/components/elements/blogteaserlist/renderTeaserlist.tsx` (M) | `s/` → `special` |

C = create, M = modify.

---

### Task 1: Storyblok-Schema, Ordner und Konstanten

Diese Task ist zum Teil Handarbeit im Storyblok-UI. Sie klärt außerdem den einen offenen Punkt der Spec: unter welchem `full_slug` die Übersichts-Story liegt.

**Files:**
- Storyblok-Space 330326 (UI)
- Modify: `src/lib/storyblokShared.ts`
- Generiert: `src/types/component-types-sb.d.ts`

**Interfaces:**
- Consumes: nichts
- Produces: Content-Types `special` und `specialchapter`; Typen `SpecialStoryblok`, `SpecialchapterStoryblok`; Konstanten `COMPONENTTYPE_SPECIAL = 'special'`, `COMPONENTTYPE_SPECIALCHAPTER = 'specialchapter'`, `STORYBLOK_FOLDER_SPECIALS = 's/'`

- [ ] **Step 1: Content-Type `special` in Storyblok anlegen**

Block Library → New Block → Name `special` → Type **Content type**. Felder in dieser Reihenfolge:

| Feldname | Storyblok-Typ | Einstellung |
|---|---|---|
| `pagetitle` | Text | — |
| `pageintro` | Textarea | — |
| `headerpicture` | Asset | Filetype: images |
| `date` | Date/Time | Pflichtfeld (Required anhaken), ohne Uhrzeit |
| `teasertitle` | Text | — |
| `teaserimage` | Asset | Filetype: images |
| `abstract` | Textarea | — |
| `readmoretext` | Text | — |
| `body` | Blocks | Allowed components: **exakt dieselben wie im Content-Type `blog`** (dort nachsehen und übernehmen) |

- [ ] **Step 2: Content-Type `specialchapter` in Storyblok anlegen**

New Block → Name `specialchapter` → Type **Content type**:

| Feldname | Storyblok-Typ | Einstellung |
|---|---|---|
| `pagetitle` | Text | — |
| `pageintro` | Textarea | — |
| `abstract` | Textarea | — |
| `headerpicture` | Asset | Filetype: images |
| `body` | Blocks | Allowed components: dieselben wie bei `special` |

Kein `date`, kein `chapternumber`, keine Referenz auf das Special.

- [ ] **Step 3: Ordner und Testinhalte anlegen**

1. Ordner `s` im Space-Root anlegen.
2. Darin Ordner `netzkultur` anlegen.
3. Im Ordner `netzkultur` **Folder Settings** öffnen und die Sortierung auf **manuell** stellen (Sort by → Manual / „Custom"). Ohne das ist `position` nicht die Reihenfolge, die in der Oberfläche sichtbar ist.
4. Im Ordner eine Story vom Typ `special` anlegen und sie als **Start Page des Ordners** markieren (Folder Settings bzw. Story-Config, je nach Storyblok-Version).
5. Drei Stories vom Typ `specialchapter` im selben Ordner anlegen, mit Titeln und je zwei Sätzen `abstract`. Alle veröffentlichen.

- [ ] **Step 4: `full_slug` der Übersicht feststellen — der offene Punkt der Spec**

Content → die Übersichts-Story öffnen → Story-Config, oder alternativ im Browser aufrufen:

```
https://api-eu.storyblok.com/v2/cdn/stories?token=<NEXT_PUBLIC_STORYBLOK_TOKEN aus .env>&starts_with=s/netzkultur/&version=published
```

Das Ergebnis notieren:

- `full_slug` ist **`s/netzkultur`** → alles wie geplant, in Task 3 entfällt Step 6.
- `full_slug` ist etwas anderes (z. B. `s/netzkultur/index`) → **den exakten Wert notieren**, Task 3 Step 6 wird ausgeführt.

Ebenfalls prüfen und notieren — **das ist eine eigene Frage, nicht dieselbe:** erscheint die Übersichts-Story in der Antwort auf `starts_with=s/netzkultur/`? Ihr `full_slug` wäre `s/netzkultur` und beginnt damit streng genommen *nicht* mit `s/netzkultur/`.

Davon hängt die Begründung für den kombinierten Query ab. Liefert Storyblok die Startpage nicht mit, holt `fetchSpecialFolder()` auf Kapitelseiten exakt dieselbe Menge wie ein Query mit Component-Filter, und der Rücklink der Sidebar zeigt dauerhaft „Zur Übersicht" statt des Special-Titels. Die Seite funktioniert, aber der Verzicht auf den Filter hätte dann nichts gebracht.

- Startpage kommt mit → alles wie geplant.
- Startpage fehlt → entweder den `component`-Filter wieder einbauen und einen zweiten Call für den Titel akzeptieren, oder den Titel aus dem `specialPath` ableiten.

- [ ] **Step 5: Typen generieren**

```bash
npm run pull-sb-components && npm run generate-sb-types
```

- [ ] **Step 6: Prüfen, dass die Typen da sind**

```bash
grep -n "SpecialStoryblok\|SpecialchapterStoryblok" src/types/component-types-sb.d.ts
```

Erwartet: mindestens die Zeilen `export type SpecialStoryblok = Special` und `export type SpecialchapterStoryblok = Specialchapter`. Falls nicht: die Content-Types wurden nicht gespeichert oder das Pull-Script hat die alte JSON-Datei benutzt — Step 1/2 prüfen und Step 5 wiederholen.

- [ ] **Step 7: Konstanten ergänzen**

In `src/lib/storyblokShared.ts` die vorhandenen Konstantenblöcke erweitern:

```ts
export const COMPONENTTYPE_BLOG = 'blog'
export const COMPONENTTYPE_ARTICLE = 'article'
export const COMPONENTTYPE_PAGE = 'page'
export const COMPONENTTYPE_STUFF = 'stuff'
export const COMPONENTTYPE_SPECIAL = 'special'
export const COMPONENTTYPE_SPECIALCHAPTER = 'specialchapter'

export const STORYBLOK_FOLDER_ARTICLES = 'a/'
export const STORYBLOK_FOLDER_BLOG = 'b/'
export const STORYBLOK_FOLDER_SPECIALS = 's/'
```

und `STORY_TYPES` am Dateiende erweitern, damit Übersicht und Kapitel in der Sitemap landen:

```ts
export const STORY_TYPES = [
  COMPONENTTYPE_BLOG,
  COMPONENTTYPE_ARTICLE,
  COMPONENTTYPE_STUFF,
  COMPONENTTYPE_PAGE,
  COMPONENTTYPE_SPECIAL,
  COMPONENTTYPE_SPECIALCHAPTER
].join(',')
```

- [ ] **Step 8: Build prüfen**

```bash
npm run build
```

Erwartet: erfolgreicher Build. (Die neuen Typen werden noch nirgends benutzt, der Build prüft hier nur, dass die generierte `.d.ts` valide ist.)

- [ ] **Step 9: Commit**

```bash
git add src/lib/storyblokShared.ts src/types/component-types-sb.d.ts components.330326.json
git commit -m "Storyblok-Typen für das Special-Format ergänzt (special, specialchapter)"
```

Falls `components.330326.json` in diesem Repo nicht getrackt wird (`git status` prüfen), den Pfad aus dem `git add` weglassen.

---

### Task 2: Datenzugriff und reine Logik

**Files:**
- Modify: `src/lib/storyblokApi.ts`
- Create: `src/lib/specials.ts`

**Interfaces:**
- Consumes: `COMPONENTTYPE_SPECIAL`, `COMPONENTTYPE_SPECIALCHAPTER`, `STORYBLOK_FOLDER_SPECIALS` aus Task 1
- Produces:
  - `fetchSpecialFolder(specialPath: string, isPreview: boolean): Promise<ISbStoryData<unknown>[]>`
  - `specialPathFromSlug(fullSlug: string): string`
  - `interface SpecialChapterSummary { uuid: string; fullSlug: string; title: string; abstract: string }`
  - `interface SpecialContextValue { specialPath: string; specialTitle: string; chapters: SpecialChapterSummary[] }`
  - `buildSpecialContext(specialPath: string, stories: ISbStoryData<unknown>[], fallbackTitle?: string): SpecialContextValue`

- [ ] **Step 1: `fetchSpecialFolder()` in `src/lib/storyblokApi.ts` ergänzen**

Direkt hinter `fetchStories()` einfügen. Der Import von `ISbStoryData` ist in der Datei bereits vorhanden.

```ts
/**
 * Lädt den kompletten Inhalt eines Special-Ordners: die Übersichts-Story und
 * alle Kapitel in einem Rutsch. Bewusst ohne Component-Filter — die Sidebar
 * braucht auf Kapitelseiten auch den Titel des Specials für den Rücklink, und
 * ein zweiter Call nur dafür wäre Verschwendung. Getrennt wird im Code.
 *
 * sort_by=position:asc bildet die manuelle Drag-and-Drop-Reihenfolge der
 * Storyblok-Ordneransicht ab. Sie gilt jeweils innerhalb eines Ordners, was
 * hier genau passt: ein Ordner pro Special.
 */
export async function fetchSpecialFolder(
  specialPath: string,
  isPreview: boolean
): Promise<ISbStoryData[]> {
  const storyblokApi = getStoryblokApi()
  await storyblokApi.flushCache()
  const { data } = await storyblokApi.get('cdn/stories', {
    version: isPreview ? 'draft' : 'published',
    starts_with: `${specialPath}/`,
    sort_by: 'position:asc',
    per_page: 100
  })
  return data.stories
}
```

- [ ] **Step 2: `src/lib/specials.ts` anlegen**

Reine Logik, keine API- und keine React-Abhängigkeit.

```ts
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
```

- [ ] **Step 3: Lint und Build**

```bash
npm run lint && npm run build
```

Erwartet: beides fehlerfrei. Häufigster Fehler an dieser Stelle: `ISbStoryData` ohne Typparameter — das ist Absicht, die Funktionen sollen generisch über beide Content-Types laufen.

- [ ] **Step 4: Commit**

```bash
git add src/lib/storyblokApi.ts src/lib/specials.ts
git commit -m "Special-Ordner laden und in Navigationsdaten überführen"
```

---

### Task 3: Context und Weiche im Renderer

**Files:**
- Create: `src/components/special/SpecialContext.tsx`
- Modify: `src/lib/pageRenderer.tsx`

**Interfaces:**
- Consumes: `fetchSpecialFolder()`, `specialPathFromSlug()`, `buildSpecialContext()`, `SpecialContextValue` aus Task 2
- Produces:
  - `<SpecialProvider value={SpecialContextValue}>` (Client-Component)
  - `useSpecial(): SpecialContextValue`

- [ ] **Step 1: `src/components/special/SpecialContext.tsx` anlegen**

```tsx
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
 */
export function useSpecial(): SpecialContextValue {
  return useContext(SpecialContext)
}
```

- [ ] **Step 2: `src/lib/pageRenderer.tsx` erweitern**

Imports oben ergänzen:

```tsx
import { COMPONENTTYPE_SPECIAL, COMPONENTTYPE_SPECIALCHAPTER } from '@/lib/storyblokShared'
import { fetchSpecialFolder } from '@/lib/storyblokApi'
import { buildSpecialContext, specialPathFromSlug } from '@/lib/specials'
import { SpecialProvider } from '@/components/special/SpecialContext.tsx'
```

Der bisherige Schluss der Funktion lautet:

```tsx
  return isPreview ? <StoryClient initialStory={data.story} /> : <StoryblokStory story={data.story} />
}
```

Er wird ersetzt durch:

```tsx
  const rendered = isPreview
    ? <StoryClient initialStory={data.story} />
    : <StoryblokStory story={data.story} />

  // Special-Übersicht und Kapitel brauchen beide die Kapitelliste ihres
  // Ordners: die Übersicht fürs Verzeichnis, das Kapitel für Sidebar und
  // Zurück/Weiter. Einmal hier laden und über Context bereitstellen erspart
  // die sonst nötige Server/Client-Doppelung der Blöcke (vgl.
  // BlogteaserlistServer/BlogteaserlistClient) und funktioniert im Editor
  // genauso wie live.
  if (component === COMPONENTTYPE_SPECIAL || component === COMPONENTTYPE_SPECIALCHAPTER) {
    const specialPath = specialPathFromSlug(storyFullSlug)
    try {
      const stories = await fetchSpecialFolder(specialPath, isPreview)
      const fallbackTitle =
        component === COMPONENTTYPE_SPECIAL
          ? (data.story.content?.pagetitle ?? data.story.name ?? '')
          : ''
      const specialContext = buildSpecialContext(specialPath, stories, fallbackTitle)
      return <SpecialProvider value={specialContext}>{rendered}</SpecialProvider>
    } catch (err: unknown) {
      // Die Kapitelliste ist Beiwerk. Fällt sie aus, liefern wir die Seite
      // ohne Navigation aus statt einen 500er zu werfen, obwohl der
      // eigentliche Inhalt längst geladen ist. Der Fehler landet im
      // Server-Log, verschwindet also nicht stillschweigend.
      console.error(`fetchSpecialFolder failed for special path "${specialPath}":`, err)
      return rendered
    }
  }

  return rendered
}
```

Ohne Provider greift der leere Vorgabewert aus `useSpecial()`, und alle Verbraucher rendern `null` — die Seite ist vollständig lesbar, ihr fehlt nur die Kapitelnavigation.

Die Variablen `component` und `storyFullSlug` existieren in der Funktion bereits (sie werden für den LinkedIn-Guard verwendet) und werden hier wiederverwendet.

- [ ] **Step 3: Lint und Build**

```bash
npm run lint && npm run build
```

- [ ] **Step 4: Zwischenprüfung im Browser**

```bash
npm run dev
```

`http://localhost:3000/s/netzkultur` aufrufen (bzw. den in Task 1 Step 4 notierten Pfad).

Erwartet: die Seite lädt und zeigt den Fallback-Renderer für unbekannte Komponenten (`FallbackComponent`), **keinen** 500er. Die Content-Types sind noch nicht registriert — das ist Task 4 und 5. Wichtig ist hier nur: der zusätzliche API-Call läuft durch und wirft nicht.

Falls stattdessen ein 404 kommt: Task 1 Step 4 hat einen abweichenden `full_slug` ergeben → Step 6 dieser Task ausführen.

- [ ] **Step 5: Commit**

```bash
git add src/components/special/SpecialContext.tsx src/lib/pageRenderer.tsx
git commit -m "Kapitelliste eines Specials über Context an die Seiten reichen"
```

- [ ] **Step 6: NUR falls Task 1 Step 4 einen abweichenden `full_slug` ergeben hat**

Wenn die Übersicht unter `s/netzkultur/index` statt `s/netzkultur` liegt, in `src/lib/specials.ts` den Import um `STORYBLOK_FOLDER_SPECIALS` erweitern:

```ts
import {
  COMPONENTTYPE_SPECIAL,
  COMPONENTTYPE_SPECIALCHAPTER,
  STORYBLOK_FOLDER_SPECIALS
} from '@/lib/storyblokShared'
```

und ergänzen:

```ts
/** Slug der Übersichts-Story, wenn Storyblok sie nicht unter dem Ordnerpfad ausliefert. */
export const SPECIAL_OVERVIEW_SLUG = 'index'

/**
 * Bildet den öffentlichen Ordnerpfad auf die tatsächliche Übersichts-Story ab.
 * 's/netzkultur' → 's/netzkultur/index', alles andere bleibt unverändert.
 */
export function resolveSpecialOverviewSlug(fullSlug: string): string {
  const parts = fullSlug.split('/').filter(Boolean)
  const isSpecialRoot =
    parts.length === 2 && `${parts[0]}/` === STORYBLOK_FOLDER_SPECIALS
  return isSpecialRoot ? `${fullSlug}/${SPECIAL_OVERVIEW_SLUG}` : fullSlug
}
```

In `src/lib/pageRenderer.tsx` den Fetch anpassen — aus:

```tsx
const result = await fetchStory(full_slug, isPreview)
```

wird:

```tsx
const result = await fetchStory(resolveSpecialOverviewSlug(full_slug), isPreview)
```

(plus Import von `resolveSpecialOverviewSlug`).

**Dieselbe Anpassung braucht `src/app/[...slug]/page.tsx`.** `generateMetadata()` ruft `fetchStory()` direkt auf, am `renderPage()` vorbei — ohne die Normalisierung liefe die Seite, aber der Metadaten-Aufruf würde für die Übersicht ins Leere greifen. Dort aus:

```tsx
const { data } = await fetchStory(slug, isPreview)
```

wird:

```tsx
const { data } = await fetchStory(resolveSpecialOverviewSlug(slug), isPreview)
```

Und in `next.config.ts` im `redirects()`-Block ergänzen (falls noch keiner existiert, die Funktion neu anlegen), damit die Seite nicht unter zwei URLs erreichbar ist:

```ts
async redirects() {
  return [
    {
      source: '/s/:special/index',
      destination: '/s/:special',
      permanent: true
    }
  ]
}
```

Danach erneut `npm run build`, Browser-Check aus Step 4 wiederholen, dann:

```bash
git add src/lib/specials.ts src/lib/pageRenderer.tsx "src/app/[...slug]/page.tsx" next.config.ts
git commit -m "Übersichts-Story eines Specials unter dem Ordnerpfad ausliefern"
```

---

### Task 4: Übersichtsseite

**Files:**
- Create: `src/components/pagetypes/Special.tsx`
- Create: `src/components/layout/SpecialLayout.tsx`
- Create: `src/components/special/ChapterIndex.tsx`
- Modify: `src/lib/storyblok.ts`

**Interfaces:**
- Consumes: `useSpecial()` aus Task 3, `SpecialStoryblok` aus Task 1
- Produces: registrierte Komponente `special`

- [ ] **Step 1: `src/components/special/ChapterIndex.tsx` anlegen**

```tsx
'use client'

import Link from 'next/link'
import { useSpecial } from '@/components/special/SpecialContext.tsx'

export default function ChapterIndex() {
  const { chapters } = useSpecial()

  if (chapters.length === 0) return null

  return (
    <nav aria-label="Kapitel dieses Specials" className="not-prose mt-16 sm:mt-24">
      <h2 className="mb-8 font-headline text-2xl font-semibold text-accent">Kapitel</h2>
      <ol className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {chapters.map((chapter, index) => (
          <li key={chapter.uuid}>
            <Link
              href={`/${chapter.fullSlug}`}
              className="block h-full rounded-2xl bg-muted p-6 ring-1 ring-border transition hover:ring-internal"
            >
              <span className="text-sm font-semibold text-accent">
                Kapitel {index + 1}
              </span>
              <span className="mt-2 block text-lg font-semibold text-foreground-strong">
                {chapter.title}
              </span>
              {chapter.abstract && (
                <span className="mt-2 block text-base text-body">{chapter.abstract}</span>
              )}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

- [ ] **Step 2: `src/components/layout/SpecialLayout.tsx` anlegen**

Aufbau bewusst nah an `BlogLayout`: Headerbild, Titel über `Pagetitle`, Datumszeile, Body. Der Text bleibt in Lesebreite, das Kapitelverzeichnis darf die volle Breite nutzen — es ist die Übersicht.

```tsx
import React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'

import { ContainerOuter } from '@/components/layout/Container.tsx'
import HeaderPicture from '@/components/global/HeaderPicture.tsx'
import Pagetitle from '@/components/elements/Pagetitle.tsx'
import ChapterIndex from '@/components/special/ChapterIndex.tsx'
import { formatDate } from '@/lib/formatDate.ts'
import { SpecialStoryblok } from '@/types/component-types-sb'

export function SpecialLayout({
  special,
  children
}: {
  special: SpecialStoryblok
  children: React.ReactNode
}) {
  return (
    <>
      <HeaderPicture headerpicture={special.headerpicture} />
      <ContainerOuter className="mt-16 lg:mt-32">
        <div className="relative px-4 sm:px-8 lg:px-12">
          <article className="mx-auto max-w-3xl">
            <header className="flex flex-col">
              {special.pagetitle && (
                <div {...storyblokEditable(special)}>
                  <Pagetitle
                    blok={{
                      pagetitle: special.pagetitle,
                      pageintro: special.pageintro,
                      whitetitle: true
                    }}
                  />
                </div>
              )}
              {special.date && (
                <time
                  dateTime={special.date}
                  className="order-first mb-8 flex items-center text-base text-subtle-foreground"
                >
                  <span className="h-4 w-0.5 rounded-full bg-border" />
                  <span className="ml-3">{formatDate(special.date)}</span>
                </time>
              )}
            </header>
            {children}
          </article>
          <div className="mb-16 sm:mb-20">
            <ChapterIndex />
          </div>
        </div>
      </ContainerOuter>
    </>
  )
}
```

- [ ] **Step 3: `src/components/pagetypes/Special.tsx` anlegen**

```tsx
import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc'
import { SpecialStoryblok } from '@/types/component-types-sb'
import { SpecialLayout } from '@/components/layout/SpecialLayout.tsx'

export default function Special({ blok }: Readonly<{ blok: SpecialStoryblok }>) {
  return (
    <SpecialLayout special={blok} {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok: any) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </SpecialLayout>
  )
}
```

- [ ] **Step 4: Komponente registrieren**

In `src/lib/storyblok.ts` den Import ergänzen:

```ts
import Special from '@/components/pagetypes/Special.tsx'
```

und im `components`-Objekt hinter `stuff: Stuff,` eintragen:

```ts
    special: Special,
```

- [ ] **Step 5: Lint und Build**

```bash
npm run lint && npm run build
```

- [ ] **Step 6: Im Browser prüfen**

```bash
npm run dev
```

`http://localhost:3000/s/netzkultur` aufrufen. Erwartet:

- Titel, Vorspann und Datum werden angezeigt
- unter dem Body die Überschrift „Kapitel" und darunter die drei Testkapitel als Karten, in der Reihenfolge des Storyblok-Ordners, nummeriert 1 bis 3
- ein Klick auf eine Karte führt auf die Kapitel-URL (die noch als Fallback rendert — das ist Task 5)

Dann in Storyblok das mittlere Kapitel per Drag-and-Drop an die erste Stelle ziehen, Seite neu laden: die Nummerierung muss der neuen Reihenfolge folgen. Tut sie das nicht, steht der Ordner nicht auf manueller Sortierung (Task 1 Step 3.3).

- [ ] **Step 7: Commit**

```bash
git add src/components/pagetypes/Special.tsx src/components/layout/SpecialLayout.tsx src/components/special/ChapterIndex.tsx src/lib/storyblok.ts
git commit -m "Übersichtsseite des Specials mit automatischem Kapitelverzeichnis"
```

---

### Task 5: Kapitelseite mit Sidebar-Navigation

**Files:**
- Create: `src/components/special/ChapterNav.tsx`
- Create: `src/components/layout/SpecialChapterLayout.tsx`
- Create: `src/components/pagetypes/SpecialChapter.tsx`
- Modify: `src/lib/storyblok.ts`

**Interfaces:**
- Consumes: `useSpecial()` aus Task 3, `SpecialchapterStoryblok` aus Task 1
- Produces: registrierte Komponente `specialchapter`

**Breitenrechnung**, damit die Zahlen nicht geraten wirken: bei 1280px Viewport — dem `xl`-Breakpoint — gehen ab: `sm:px-8` der äußeren `ContainerOuter`-Hülle (64px), `lg:px-8` der inneren (64px) und `lg:px-12` des Layouts (96px). Bleiben 1056px. Sidebar 16rem = 256px plus `gap-12` = 48px macht 304px, für den Text bleiben 752px. `max-w-3xl` (768px) greift also erst knapp oberhalb des Breakpoints — schadet nicht, eine nicht bindende Maximalbreite ist folgenlos. Deshalb startet der Zweispalter bei `xl`.

- [ ] **Step 1: `src/components/special/ChapterNav.tsx` anlegen**

Eine Komponente, zwei Darstellungen: ab `xl` die klebende Sidebar, darunter eine klebende, aufklappbare Zeile.

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

import { useSpecial } from '@/components/special/SpecialContext.tsx'

export default function ChapterNav() {
  const { specialPath, specialTitle, chapters } = useSpecial()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  if (chapters.length === 0) return null

  const currentIndex = chapters.findIndex((chapter) => `/${chapter.fullSlug}` === pathname)
  const current = currentIndex >= 0 ? chapters[currentIndex] : null

  const chapterList = (
    <ol className="space-y-1">
      {chapters.map((chapter, index) => {
        const isCurrent = index === currentIndex
        return (
          <li key={chapter.uuid}>
            <Link
              href={`/${chapter.fullSlug}`}
              aria-current={isCurrent ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={clsx(
                'block border-l-2 py-1.5 pl-3 text-sm transition',
                isCurrent
                  ? 'border-accent font-semibold text-foreground-strong'
                  : 'border-border-subtle text-internal hover:border-internal hover:text-internal-hover'
              )}
            >
              <span className="mr-2 tabular-nums text-muted-foreground">{index + 1}</span>
              {chapter.title}
            </Link>
          </li>
        )
      })}
    </ol>
  )

  const backLink = (
    <Link
      href={`/${specialPath}`}
      className="mb-6 block text-sm font-semibold text-internal hover:text-internal-hover"
    >
      ← {specialTitle || 'Zur Übersicht'}
    </Link>
  )

  return (
    <>
      {/* ab xl: klebende Sidebar */}
      <nav
        aria-label="Kapitel dieses Specials"
        className="not-prose hidden xl:block"
      >
        <div className="sticky top-28">
          {backLink}
          {chapterList}
        </div>
      </nav>

      {/* unter xl: klebende Zeile, aufklappbar */}
      <nav
        aria-label="Kapitel dieses Specials"
        className="not-prose sticky top-0 z-20 -mx-4 mb-8 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-8 sm:px-8 xl:hidden"
      >
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full cursor-pointer items-center justify-between text-left text-sm text-internal hover:text-internal-hover"
        >
          <span>
            {current
              ? `Kapitel ${currentIndex + 1} von ${chapters.length} — ${current.title}`
              : specialTitle || 'Kapitel'}
          </span>
          <span aria-hidden="true" className="ml-4 shrink-0">
            {open ? '▲' : '▼'}
          </span>
        </button>
        {open && (
          <div className="mt-4">
            {backLink}
            {chapterList}
          </div>
        )}
      </nav>
    </>
  )
}
```

- [ ] **Step 2: `src/components/layout/SpecialChapterLayout.tsx` anlegen**

```tsx
import React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'

import { ContainerOuter } from '@/components/layout/Container.tsx'
import HeaderPicture from '@/components/global/HeaderPicture.tsx'
import Pagetitle from '@/components/elements/Pagetitle.tsx'
import ChapterNav from '@/components/special/ChapterNav.tsx'
import { SpecialchapterStoryblok } from '@/types/component-types-sb'

export function SpecialChapterLayout({
  chapter,
  children
}: {
  chapter: SpecialchapterStoryblok
  children: React.ReactNode
}) {
  return (
    <>
      <HeaderPicture headerpicture={chapter.headerpicture} />
      <ContainerOuter className="mt-16 lg:mt-32">
        <div className="relative px-4 sm:px-8 lg:px-12">
          {/* 1120px nutzbar: 16rem Sidebar + 3rem Abstand + max-w-3xl Text.
              Deshalb greift der Zweispalter erst ab xl. */}
          <div className="xl:grid xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-12">
            <ChapterNav />
            <article className="mx-auto mb-16 max-w-3xl sm:mb-20 xl:mx-0">
              <header>
                {chapter.pagetitle && (
                  <div {...storyblokEditable(chapter)}>
                    <Pagetitle
                      blok={{
                        pagetitle: chapter.pagetitle,
                        pageintro: chapter.pageintro,
                        whitetitle: true
                      }}
                    />
                  </div>
                )}
              </header>
              {children}
            </article>
          </div>
        </div>
      </ContainerOuter>
    </>
  )
}
```

- [ ] **Step 3: `src/components/pagetypes/SpecialChapter.tsx` anlegen**

```tsx
import { storyblokEditable, StoryblokServerComponent } from '@storyblok/react/rsc'
import { SpecialchapterStoryblok } from '@/types/component-types-sb'
import { SpecialChapterLayout } from '@/components/layout/SpecialChapterLayout.tsx'

export default function SpecialChapter({
  blok
}: Readonly<{ blok: SpecialchapterStoryblok }>) {
  return (
    <SpecialChapterLayout chapter={blok} {...storyblokEditable(blok)}>
      {blok.body?.map((nestedBlok: any) => (
        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
      ))}
    </SpecialChapterLayout>
  )
}
```

- [ ] **Step 4: Komponente registrieren**

In `src/lib/storyblok.ts` Import ergänzen:

```ts
import SpecialChapter from '@/components/pagetypes/SpecialChapter.tsx'
```

und im `components`-Objekt direkt hinter `special: Special,`:

```ts
    specialchapter: SpecialChapter,
```

- [ ] **Step 5: Lint und Build**

```bash
npm run lint && npm run build
```

- [ ] **Step 6: Im Browser prüfen, drei Breiten**

`npm run dev`, dann ein Kapitel aufrufen, z. B. `http://localhost:3000/s/netzkultur/die-anfaenge`.

| Fensterbreite | Erwartung |
|---|---|
| 1440px | Sidebar links sichtbar, klebt beim Scrollen, aktuelles Kapitel fett mit Akzent-Rand, Text rechts in Lesebreite |
| 1100px | keine Sidebar, stattdessen klebende Zeile oben „Kapitel 1 von 3 — …", Klick klappt die Liste auf |
| 390px | dieselbe Zeile, Text volle Breite, kein horizontales Scrollen |

Zusätzlich: Klick auf „← <Titel des Specials>" führt zur Übersicht.

- [ ] **Step 7: Commit**

```bash
git add src/components/special/ChapterNav.tsx src/components/layout/SpecialChapterLayout.tsx src/components/pagetypes/SpecialChapter.tsx src/lib/storyblok.ts
git commit -m "Kapitelseiten mit klebender Kapitelnavigation"
```

---

### Task 6: Zurück / Weiter und Newsletter am Kapitelende

**Files:**
- Create: `src/components/special/ChapterPagination.tsx`
- Modify: `src/components/layout/SpecialChapterLayout.tsx`

**Interfaces:**
- Consumes: `useSpecial()` aus Task 3
- Produces: `<ChapterPagination />`

- [ ] **Step 1: `src/components/special/ChapterPagination.tsx` anlegen**

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useSpecial } from '@/components/special/SpecialContext.tsx'

export default function ChapterPagination() {
  const { specialPath, specialTitle, chapters } = useSpecial()
  const pathname = usePathname()

  const currentIndex = chapters.findIndex((chapter) => `/${chapter.fullSlug}` === pathname)
  if (currentIndex < 0) return null

  const previous = currentIndex > 0 ? chapters[currentIndex - 1] : null
  const next = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null

  return (
    <nav
      aria-label="Weitere Kapitel"
      className="not-prose mt-16 border-t border-border pt-8"
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {previous ? (
          <Link
            href={`/${previous.fullSlug}`}
            className="rounded-2xl bg-muted p-5 ring-1 ring-border transition hover:ring-internal"
          >
            <span className="block text-sm text-muted-foreground">
              ← Kapitel {currentIndex}
            </span>
            <span className="mt-1 block font-semibold text-foreground-strong">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/${next.fullSlug}`}
            className="rounded-2xl bg-muted p-5 text-right ring-1 ring-border transition hover:ring-internal sm:col-start-2"
          >
            <span className="block text-sm text-muted-foreground">
              Kapitel {currentIndex + 2} →
            </span>
            <span className="mt-1 block font-semibold text-foreground-strong">
              {next.title}
            </span>
          </Link>
        )}
      </div>
      <Link
        href={`/${specialPath}`}
        className="mt-8 block text-sm font-semibold text-internal hover:text-internal-hover"
      >
        ← Alle Kapitel{specialTitle ? `: ${specialTitle}` : ''}
      </Link>
    </nav>
  )
}
```

Die Nummern stimmen ohne Off-by-one: `currentIndex` ist nullbasiert, das vorherige Kapitel trägt damit die Anzeigenummer `currentIndex`, das nächste `currentIndex + 2`.

- [ ] **Step 2: In `SpecialChapterLayout.tsx` einhängen**

Imports ergänzen:

```tsx
import ChapterPagination from '@/components/special/ChapterPagination.tsx'
import NewsletterForm from '@/components/elements/NewsletterForm.tsx'
```

Im `<article>` hinter `{children}` einfügen:

```tsx
              {children}
              <div className="mt-16">
                <NewsletterForm variant="highlight" />
              </div>
              <ChapterPagination />
```

Die klebende Newsletter-Karte aus `BlogLayout` wird hier bewusst **nicht** verwendet: zusammen mit der linken Sidebar wären es zwei mitschwimmende Elemente.

- [ ] **Step 3: Lint und Build**

```bash
npm run lint && npm run build
```

- [ ] **Step 4: Im Browser prüfen**

`npm run dev`, dann alle drei Testkapitel durchklicken:

- erstes Kapitel: kein „Zurück", rechts „Kapitel 2 →"
- mittleres Kapitel: beide Richtungen, Nummern 1 und 3
- letztes Kapitel: kein „Weiter", links „← Kapitel 2"
- unter jedem Kapitel der Newsletter-Block, darunter die Blätter-Navigation
- „← Alle Kapitel" führt zur Übersicht

- [ ] **Step 5: Commit**

```bash
git add src/components/special/ChapterPagination.tsx src/components/layout/SpecialChapterLayout.tsx
git commit -m "Blättern zwischen Kapiteln und Newsletter am Kapitelende"
```

---

### Task 7: Specials in Teaserlisten und Navigation

**Files:**
- Modify: `src/components/elements/blogteaserlist/renderTeaserlist.tsx`
- Storyblok-Space (UI): Feldoption und Nav-Eintrag

**Interfaces:**
- Consumes: `COMPONENTTYPE_SPECIAL`, `STORYBLOK_FOLDER_SPECIALS` aus Task 1
- Produces: `componentTypeForFolder('s/') === 'special'`

- [ ] **Step 1: `componentTypeForFolder()` erweitern**

In `src/components/elements/blogteaserlist/renderTeaserlist.tsx` den Import erweitern:

```ts
import {
  COMPONENTTYPE_ARTICLE,
  COMPONENTTYPE_BLOG,
  COMPONENTTYPE_SPECIAL,
  STORYBLOK_FOLDER_ARTICLES,
  STORYBLOK_FOLDER_SPECIALS
} from '@/lib/storyblokShared'
```

und die Funktion ersetzen durch:

```ts
export function componentTypeForFolder(folder?: string): string {
  if (folder === STORYBLOK_FOLDER_ARTICLES || folder === 'a') {
    return COMPONENTTYPE_ARTICLE
  }
  if (folder === STORYBLOK_FOLDER_SPECIALS || folder === 's') {
    return COMPONENTTYPE_SPECIAL
  }
  return COMPONENTTYPE_BLOG
}
```

- [ ] **Step 2: Feldoption in Storyblok ergänzen**

Block Library → `blogteaserlist` → Feld `folder` → bei den Optionen einen Eintrag hinzufügen: Name „Specials", Value `s/`.

- [ ] **Step 3: Lint und Build**

```bash
npm run lint && npm run build
```

- [ ] **Step 4: Im Browser prüfen**

In Storyblok auf einer Testseite einen `blogteaserlist`-Block mit Typ „automatic", Ordner „Specials" und Layout „cards" anlegen, speichern, im Frontend aufrufen.

Erwartet: das Special erscheint als Karte mit `teaserimage` (oder ersatzweise `headerpicture`), `teasertitle` und `abstract`. Bleibt die Liste leer, fehlt der Übersichts-Story das Pflichtfeld `date` oder sie ist nicht veröffentlicht.

- [ ] **Step 5: Nav-Eintrag setzen**

In Storyblok in den `globalsettings` einen Eintrag in `topnav` auf `/s/netzkultur` ergänzen. Frontend neu laden und den Link prüfen.

- [ ] **Step 6: Commit**

```bash
git add src/components/elements/blogteaserlist/renderTeaserlist.tsx
git commit -m "Specials in Teaserlisten anbieten"
```

---

### Task 8: Abnahme gegen die Spec

Kein neuer Code, sondern das Durchgehen der sieben Checks aus dem Verifikationsteil der Spec. Was hier auffällt, wird gefixt und einzeln committet.

**Files:** keine (außer bei gefundenen Fehlern)

- [ ] **Step 1: Reihenfolge**

Kapitel in Storyblok umsortieren, Übersicht und eine Kapitelseite neu laden. Verzeichnis, Sidebar und die Zurück/Weiter-Nummern folgen der neuen Reihenfolge.

- [ ] **Step 2: Breiten**

Kapitelseite bei 1440px, 1100px und 390px prüfen (siehe Tabelle in Task 5 Step 6).

- [ ] **Step 3: Ränder der Navigation**

Aktives Kapitel hervorgehoben; erstes Kapitel ohne „Zurück", letztes ohne „Weiter".

- [ ] **Step 4: Storyblok-Editor**

Die Übersicht und ein Kapitel im Visual Editor öffnen. Verzeichnis und Sidebar erscheinen dort ebenso, ohne `Loading…`-Zustand. Ein Klick in den Text springt im Editor an die richtige Stelle (`storyblokEditable` sitzt korrekt).

- [ ] **Step 5: Unveröffentlichtes Kapitel**

Ein viertes Kapitel anlegen und **nicht** veröffentlichen.

- Live (`http://localhost:3000/s/netzkultur`): darf weder im Verzeichnis noch in der Sidebar auftauchen.
- Vorschau (`?secret=<NEXT_PUBLIC_STORYBLOK_EDITOR_SECRET>`): muss auftauchen.

Schlägt das fehl, prüft `fetchSpecialFolder()` den `isPreview`-Parameter nicht richtig durch (Task 2 Step 1).

- [ ] **Step 6: Feeds und Sitemap**

```bash
curl -s localhost:3000/api/sitemap.xml | grep -c "s/netzkultur" || true
curl -s localhost:3000/api/rss.xml | grep -c "s/netzkultur" || true
```

Erwartet: Sitemap ≥ 4 Treffer (Übersicht plus Kapitel), RSS `0`. Das `|| true` ist nötig, weil `grep -c` bei null Treffern mit Exit-Code 1 endet — die `0` ist hier das gewünschte Ergebnis, kein Fehler.

- [ ] **Step 7: Teaserkarte**

`blogteaserlist` mit Ordner `s/` zeigt das Special als Karte (bereits in Task 7 Step 4 geprüft, hier als Regressionscheck nach allen Änderungen).

- [ ] **Step 8: Abschluss**

`git status` prüfen: nichts Ungewolltes offen. Falls in dieser Task Fixes entstanden sind, sind sie einzeln committet. **Nicht pushen** — das entscheidet der Nutzer.

---

## Bewusst nicht Teil dieses Plans

Aus der Spec übernommen, jederzeit nachrüstbar:

- eine `/s`-Indexseite aller Specials
- Kapitel oder das Special im RSS-Feed
- Prolog oder Nachwort ohne laufende Nummer
- Lesefortschritt in Prozent, geschätzte Lesedauer
- „Alles auf einer Seite lesen" oder Druckansicht
- Sprungmarken innerhalb eines Kapitels

---

## Nachtrag: was der Abschluss-Review geändert hat

Die Code-Blöcke oben sind der Stand *vor* dem Review über den gesamten Branch. Zwei Layout-Fehler
darin waren nur im Zusammenspiel mit dem Rest der Seite sichtbar und sind in `5f40ece` behoben —
wer die Blöcke oben abtippt, baut sie wieder ein:

- **Die eingeklappte Kapitelleiste war unsichtbar.** `sticky top-0` lag komplett hinter dem
  Seiten-Header (z-50, opak, 5rem hoch, ab dem ersten Scroll-Pixel gepinnt). Unter 1280px ist diese
  Leiste die gesamte Navigation des Features. Richtig ist `top-20`.
- **Der Artikel klappte in die Sidebar-Spalte.** `ChapterNav` liefert `null`, wenn es keine Kapitel
  gibt, und trägt dann keinen DOM-Knoten bei — der `<article>` rutschte damit in die 16rem-Spur des
  Grids. Genau der Fall, den wir absichtlich gebaut haben (Fehler beim Laden der Kapitelliste,
  leerer Context im Visual Editor), lieferte also eine unlesbare Seite. Richtig ist
  `xl:col-start-2` am `<article>`.

Dazu Kleineres: interner Link-Token auf den Kapitelkarten, `aria-controls` am Aufklapp-Button,
Rücklink auch dann, wenn kein Kapitel zum Pfad passt, korrigierter Full-Bleed zwischen 1024 und
1279px, und ein Hinweis in `SpecialContext.tsx`, dass nur Client-Komponenten `useSpecial()` lesen
können.
