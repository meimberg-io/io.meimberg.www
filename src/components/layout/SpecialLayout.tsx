import React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'

import { Container } from '@/components/layout/Container.tsx'
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
      <Container className="mt-16 lg:mt-32">
        <div className="relative">
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
          {/* Bewusst volle Breite statt mx-auto max-w-3xl wie der Artikel oben:
              Übersichtsseiten dürfen die ganze Breite nutzen, nur der Lesetext
              bleibt auf Lesebreite. Die Kartenreihe darf daher links/rechts über
              die Textspalte hinausragen. */}
          <ChapterIndex />
        </div>
      </Container>
    </>
  )
}
