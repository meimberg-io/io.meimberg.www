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
