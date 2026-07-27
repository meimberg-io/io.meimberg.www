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
