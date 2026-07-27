import React from 'react'
import { storyblokEditable } from '@storyblok/react/rsc'

import { ContainerOuter } from '@/components/layout/Container.tsx'
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
      <ContainerOuter className="mt-16 lg:mt-32">
        <div className="relative px-4 sm:px-8 lg:px-12">
          {/* Bei 1280px (xl-Breakpoint) nutzbar: 1280 − 64 (ContainerOuter sm:px-8)
              − 64 (ContainerOuter-Inner lg:px-8) − 96 (eigenes lg:px-12) = 1056px.
              Davon 16rem Sidebar + 3rem Gap ab bleiben 752px für den Text —
              max-w-3xl (768px) bindet also erst etwas oberhalb des xl-Breakpoints.
              Deshalb greift der Zweispalter erst ab xl. */}
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
      </ContainerOuter>
    </>
  )
}
