import React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'

import { Container } from '@/components/layout/Container.tsx'
import HeaderPicture from '@/components/global/HeaderPicture.tsx'
import Pagetitle from '@/components/elements/Pagetitle.tsx'
import ChapterNav from '@/components/special/ChapterNav.tsx'
import ChapterPagination from '@/components/special/ChapterPagination.tsx'
import NewsletterForm from '@/components/elements/NewsletterForm.tsx'
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
      <Container className="mt-16 lg:mt-32">
        <div className="relative">
          {/* Container (nicht ContainerOuter), damit die Inhaltsbox exakt die des
              Headers ist: dieselbe Kette bis lg:px-12 plus dessen
              `mx-auto max-w-2xl lg:max-w-5xl`. Nur so schließen Sidebar und
              Artikel links mit dem Logo und rechts mit dem Theme-Umschalter ab.
              Ab lg sind das 1024px: 16rem Sidebar + 3rem Gap lassen 720px für
              den Text, max-w-3xl bindet dort also nicht mehr — es gilt nur noch
              unterhalb von xl, wo der Text einspaltig zentriert steht. */}
          <div className="xl:grid xl:grid-cols-[16rem_minmax(0,1fr)] xl:gap-12">
            <ChapterNav />
            {/* xl:col-start-2, weil ChapterNav bei leerer Kapitelliste null
                zurückgibt und keinen DOM-Knoten für die erste Spalte beisteuert –
                ohne das würde der Artikel in die 16rem-Sidebar-Spalte rutschen. */}
            <article className="mx-auto mb-16 max-w-3xl sm:mb-20 xl:col-start-2 xl:mx-0">
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
              <div className="mt-16">
                <NewsletterForm variant="highlight" />
              </div>
              <ChapterPagination />
            </article>
          </div>
        </div>
      </Container>
    </>
  )
}
