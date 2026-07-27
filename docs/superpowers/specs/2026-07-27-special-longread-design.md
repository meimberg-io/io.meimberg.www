# Content-Format „Special": mehrteiliger Longread mit Kapitelseiten

*Datum: 2026-07-27 · Status: abgestimmt, bereit für Umsetzungsplanung*

## Ausgangslage und Ziel

meimberg.io kennt heute die Content-Types `page`, `blog` (der frühere `article`), `stuff` und `news`.
Alle rendern über denselben generischen Pfad: jede Storyblok-Story ist eine Seite, aufgelöst in
`src/app/[...slug]/page.tsx` → `renderPage()` → `StoryblokStory`.

Gebraucht wird ein Format für eine sehr lange, in Kapitel gegliederte Abhandlung, fast ein kleines
Buch. Erstes Vorhaben: zehn Kapitel über Netzkultur. Jedes Kapitel liegt auf einer eigenen Seite,
dazu kommt eine Übersichtsseite. Bei zehn Kapiteln sind das elf Stories in Storyblok.

Inhaltlich entsteht nichts Neues: innerhalb eines Kapitels stehen dieselben Blöcke wie im Artikel
(Richtext, Bild, Video, Youtube, Gallery, Hyperlink und so weiter). Neu sind die Klammer über den
Kapiteln, die Navigation innerhalb des Specials und ein breiteres Layout.

## Entscheidungen

| Frage | Entscheidung |
|---|---|
| Zuordnung Kapitel → Special | Der Ordner ist die Klammer. Keine Referenzfelder. |
| Reihenfolge der Kapitel | Storybloks manuelle Ordner-Sortierung (`position`), kein Nummernfeld. |
| URL | `/s/<special>` für die Übersicht, `/s/<special>/<kapitel>` für Kapitel. |
| Navigation | Klebende Sidebar links mit allen Kapiteln, aktuelles hervorgehoben. |
| Übersichtsseite | Eigener Content-Type, Kapitelverzeichnis rendert das Layout automatisch. |
| Auffindbarkeit | Über den bestehenden `blogteaserlist`-Block, kein eigener Index. |

## Content-Modell

### Ordnerstruktur

```
s/                       Ordner, Sammelplatz aller Specials
└── netzkultur/          Ordner, ein Special
    ├── (Übersicht)      Story vom Typ special, Startpage des Ordners
    ├── die-anfaenge     Story vom Typ specialchapter
    ├── usenet           Story vom Typ specialchapter
    └── …
```

Das Prefix `s/` folgt der bestehenden Konvention (`b/` Blog, `a/` Artikel, `p/` Pages). Der Ordner
pro Special wird von Hand angelegt.

Die Kapitelnummer steckt bewusst **nicht** im Slug. Sonst bricht die URL, sobald umsortiert wird.

### Content-Type `special`

| Feld | Typ | Zweck |
|---|---|---|
| `pagetitle` | Text | Titel des Specials |
| `pageintro` | Text | Vorspann |
| `headerpicture` | Asset | Titelbild, rendert über die bestehende `HeaderPicture`-Komponente |
| `date` | Date | Pflichtfeld. `fetchStories()` sortiert nach `content.date:desc`; ohne Datum rutscht das Special in Teaserlisten ans Ende. |
| `teasertitle` | Text | Teaser-Felder exakt wie bei `blog`, damit `BlogCardList` ohne Sonderfall funktioniert |
| `teaserimage` | Asset | dito |
| `abstract` | Textarea | dito, dient zusätzlich als Meta-Description |
| `readmoretext` | Text | dito |
| `body` | Bloks | freie Einleitung, gleiche Blockliste wie `blog` |

### Content-Type `specialchapter`

| Feld | Typ | Zweck |
|---|---|---|
| `pagetitle` | Text | Kapiteltitel |
| `pageintro` | Text | Vorspann |
| `abstract` | Textarea | ein bis zwei Sätze, erscheinen im Verzeichnis der Übersichtsseite und als Meta-Description |
| `headerpicture` | Asset | optional, pro Kapitel |
| `body` | Bloks | Inhalt, identische Blockliste wie `blog` |

Kein `chapternumber`, kein `date`, keine Rückreferenz auf das Special. Die laufende Nummer ist der
Index in der sortierten Kapitelliste; sie zusätzlich zu speichern wäre eine zweite Quelle für
dieselbe Wahrheit und liefe beim Einschieben eines Kapitels auseinander.

### Der eine Query

Übersicht wie Kapitelseiten holen die Kapitelliste identisch:

```
starts_with:   s/<special>/
filter_query:  component: { in: specialchapter }
sort_by:       position:asc
```

`position` bildet die Drag-and-Drop-Reihenfolge der Storyblok-Ordneransicht ab und gilt jeweils
innerhalb eines Ordners, was hier genau passt. Die Übersichts-Story liegt im selben Ordner, fällt
aber durch den `component`-Filter heraus.

Voraussetzung im CMS: der Ordner muss auf manuelle Sortierung stehen, sonst ist `position` nicht
das, was in der Oberfläche zu sehen ist.

Ein neues Kapitel anzulegen heißt: Story im Ordner erstellen, an die richtige Stelle ziehen. Nichts
nachzupflegen.

## Rendering

### Breite und Aufbau der Kapitelseite

Grundlage bleibt `ContainerOuter` (`max-w-7xl`, 1280px). Darin ein Zweispalter:

- links die Kapitelnavigation, etwa 16rem
- rechts der Fließtext weiterhin in Lesebreite, `max-w-3xl`

16rem + Abstand + 48rem gehen sich in 1280px aus. „Breit" heißt also nicht breiterer Fließtext,
sondern dass die Seite ihre Fläche für Orientierung nutzt. Bilder und Galerien im Body dürfen
weiterhin über die Textspalte hinausbrechen.

Unterhalb von `xl` (1280px) wird die Sidebar zu einer schmalen, klebenden Zeile am oberen Rand:
„Kapitel 3 von 10 — Usenet", aufklappbar zur vollen Liste. Auf dem Handy dieselbe Komponente,
eingeklappt.

Weitere Festlegungen:

- Kein Zurück-Pfeil wie in `BlogLayout`. Die Sidebar hat oben einen festen Link zur Übersicht des
  Specials; das ist präziser als `router.back()`.
- Keine klebende Newsletter-Karte auf Kapitelseiten. Sie sitzt im Blog ab 1600px rechts; zusammen
  mit der linken Sidebar wären es zwei mitschwimmende Elemente. Stattdessen der normale
  Inline-Block am Kapitelende, oberhalb von Zurück/Weiter.
- Am Kapitelende: Zurück / Weiter / Zur Übersicht.

### Aufbau der Übersichtsseite

Headerbild, Titel, Vorspann, danach der freie `body`, darunter das automatisch gerenderte
Kapitelverzeichnis (Nummer, Titel, `abstract`). Das Verzeichnis ist kein platzierbarer Block,
sondern Teil des Layouts. Damit kann es nicht vergessen werden und nie leer erscheinen.

### Wie die Navigation an ihre Daten kommt

Das ist der einzige nicht offensichtliche Teil.

Im Storyblok-Editor rendert die Seite client-seitig über `StoryClient`, im Livebetrieb server-seitig
über `StoryblokStory`. Deshalb existiert bei den Teaserlisten die Doppelung aus
`BlogteaserlistServer` und `BlogteaserlistClient`. Diese Doppelung wird hier nicht wiederholt.

Stattdessen prüft `renderPage()` nach dem Laden der Story deren Typ. Ist es `special` oder
`specialchapter`, holt es einmalig die Kapitelliste und stellt sie über einen Client-Context
bereit, der beide Render-Pfade umschließt. Sidebar, Verzeichnis und Zurück/Weiter lesen daraus.

Ergebnis: ein zusätzlicher API-Call pro Seitenaufruf, identisches Verhalten im Editor und live,
keine `Loading…`-Zustände.

### Neue Dateien

```
src/lib/specials.ts                            fetchSpecialChapters(), Pfad-Helfer
src/components/pagetypes/Special.tsx           Content-Type special
src/components/pagetypes/SpecialChapter.tsx    Content-Type specialchapter
src/components/layout/SpecialLayout.tsx        Übersicht
src/components/layout/SpecialChapterLayout.tsx Kapitel, Zweispalter
src/components/special/SpecialContext.tsx      Kapitelliste als Context
src/components/special/ChapterNav.tsx          Sidebar und eingeklappte Variante
src/components/special/ChapterIndex.tsx        Verzeichnis auf der Übersicht
src/components/special/ChapterPagination.tsx   Zurück / Weiter / Zur Übersicht
```

Jede Datei hat eine Aufgabe: `specials.ts` weiß, wie man Kapitel lädt und Pfade zerlegt, der
Context transportiert die Liste, die drei Komponenten unter `special/` stellen sie unterschiedlich
dar, die Layouts setzen sie zusammen. Die Layouts kennen die Storyblok-API nicht, die
Datei `specials.ts` kennt kein React.

### Änderungen an bestehenden Dateien

| Datei | Änderung |
|---|---|
| `src/lib/storyblok.ts` | `special` und `specialchapter` registrieren |
| `src/lib/storyblokShared.ts` | `COMPONENTTYPE_SPECIAL`, `COMPONENTTYPE_SPECIALCHAPTER`, `STORYBLOK_FOLDER_SPECIALS = 's/'`, beide Typen in `STORY_TYPES` |
| `src/lib/pageRenderer.tsx` | Typ-Weiche, Kapitelliste laden, Context setzen |
| `src/components/elements/blogteaserlist/renderTeaserlist.tsx` | `componentTypeForFolder()` kennt `s/` → `special` |
| `src/types/component-types-sb.d.ts` | neu generiert per `npm run pull-sb-components && npm run generate-sb-types` |

Metadaten brauchen keine Anpassung: `deriveTitle`, `deriveDescription` und `selectOgImage` in
`src/lib/metadata.ts` lesen `pagetitle`, `abstract` und `headerpicture`, die beide neuen Typen haben.

## Einbindung ins bestehende System

**Einstieg.** Das Feld `folder` im `blogteaserlist`-Block bekommt in Storyblok die Option `s/`, im
Code mappt `componentTypeForFolder()` sie auf `special`. Damit lassen sich Specials überall
anteasern, wo heute Blogbeiträge stehen: Home, Blog-Seite, jede Page. Kein neuer Block, keine neue
Kartenkomponente, weil `special` die Teaser-Felder von `blog` spiegelt. Dazu ein Nav-Eintrag direkt
auf `/s/netzkultur`.

**Was sich von allein richtig verhält:**

- *Sitemap*: nimmt auf, was in `STORY_TYPES` steht. Übersicht und Kapitel sind damit automatisch drin.
- *RSS*: `src/app/api/rss.xml/route.ts` filtert hart auf `component: blog` im Ordner `b/`. Die zehn
  Kapitel fluten den Feed also nicht.
- *News-Aggregation*: unberührt, zieht aus RSS-Quellen.
- *Caching*: die Seiten unter `[...slug]` lesen `searchParams` und rendern pro Request. Ein neues
  Kapitel erscheint sofort in der Sidebar aller Geschwisterseiten; es gibt keinen Stand, der
  invalidiert werden müsste.

## Offener Punkt, zuerst zu klären

Damit die Übersicht unter `/s/netzkultur` liegt und nicht unter `/s/netzkultur/index`, muss sie die
Startpage des Ordners sein. Storyblok kennt das Konzept (`is_startpage`); ob die Content-Delivery-API
die Story dann unter dem reinen Ordnerpfad ausliefert, ist ohne Zugriff auf die Space nicht
bestätigt.

Erster Umsetzungsschritt ist deshalb: Ordner anlegen, Übersichts-Story als Startpage markieren,
`full_slug` prüfen.

- Ergibt es `s/netzkultur`: nichts weiter zu tun.
- Ergibt es etwas anderes: eine Slug-Normalisierung in `renderPage()` ergänzen, die einen
  zweisegmentigen Pfad unterhalb von `s/` auf die Startpage abbildet, plus Redirect vom
  Index-Pfad auf den Ordnerpfad, damit die Seite nicht unter zwei URLs erreichbar ist.

Beide Wege ändern nichts am übrigen Konzept.

## Verifikation

Manuell, entlang des ersten echten Specials:

1. Ordner `s/netzkultur` mit Übersicht und drei Kapiteln anlegen, mittleres Kapitel per
   Drag-and-Drop verschieben und prüfen, dass Verzeichnis und Sidebar der neuen Reihenfolge folgen.
2. Kapitelseite bei 1440px, 1100px und 390px prüfen: Sidebar, eingeklappte Leiste, Lesebreite.
3. Aktives Kapitel in der Sidebar korrekt hervorgehoben; erstes Kapitel ohne „Zurück", letztes
   ohne „Weiter".
4. Storyblok-Editor öffnen: Sidebar und Verzeichnis erscheinen dort ebenso, ohne Ladezustand.
5. Ein unveröffentlichtes Kapitel darf live weder im Verzeichnis noch in der Sidebar auftauchen,
   in der Vorschau schon.
6. `/api/sitemap.xml` enthält Übersicht und Kapitel, `/api/rss.xml` enthält sie nicht.
7. `blogteaserlist` mit Ordner `s/` zeigt das Special als Karte.

## Bewusst nicht Teil davon

Jederzeit nachrüstbar, aber nicht in diesem Schritt:

- eine `/s`-Indexseite aller Specials, sinnvoll ab dem zweiten oder dritten Special
- Kapitel oder das Special im RSS-Feed
- Prolog oder Nachwort ohne laufende Nummer
- Lesefortschritt in Prozent, geschätzte Lesedauer
- „Alles auf einer Seite lesen" oder Druckansicht
- Sprungmarken innerhalb eines Kapitels (Unterüberschriften im Inhaltsverzeichnis)
