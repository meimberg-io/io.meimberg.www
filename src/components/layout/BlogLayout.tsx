'use client'

import React, { useContext, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { ContainerOuter } from '@/components/layout/Container.tsx'
import { formatDate } from '@/lib/formatDate.ts'
import { AppContext } from '@/lib/providers.tsx'
import { BlogStoryblok } from '@/types/component-types-sb'
import { ArrowLeftIcon } from '@/components/util/Svg.tsx'
import HeaderPicture from '@/components/global/HeaderPicture.tsx'
import { storyblokEditable } from '@storyblok/react/rsc'
import Pagetitle from '@/components/elements/Pagetitle.tsx'
import NewsletterFormSticky from '@/components/elements/NewsletterFormSticky.tsx'


export function BlogLayout({ blog, children }: {
  blog: BlogStoryblok
  children: React.ReactNode
}) {
  const router = useRouter()
  const { previousPathname } = useContext(AppContext)
  const articleRef = useRef<HTMLElement>(null)

  return (
    <>
      <HeaderPicture headerpicture={blog.headerpicture} />
      <ContainerOuter className="mt-16 lg:mt-32">
        <div className="relative">

          <div className="relative mx-auto max-w-3xl px-4 sm:px-8 lg:px-12">
            {previousPathname && (
              <button
                type="button"
                onClick={() => router.back()}
                aria-label="Go back to blogs"
                className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white ring-1 shadow-md shadow-zinc-800/5 ring-zinc-900/5 transition lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20"
              >
                <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
              </button>
            )}

            <article ref={articleRef}>
              <header className="flex flex-col">
                {blog.pagetitle && (<div {...storyblokEditable(blog)}>
                    <Pagetitle blok={{ pagetitle: blog.pagetitle, pageintro: blog.pageintro, whitetitle: true }} />
                  </div>
                )}
                <time dateTime={blog.date} className="order-first mb-8 flex items-center text-base text-subtle-foreground">
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                  <span className="ml-3">{formatDate(blog.date)}</span>
                </time>
              </header>

              {children}
            </article>
          </div>

          {/* Sticky newsletter card straddling the surface panel's right border (xl and up).
              Mobile/tablet fallback is a follow-up (responsive step 2). */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-0 xl:block">
            <div className="pointer-events-auto sticky top-28 w-[340px] -translate-x-1/2">
              <NewsletterFormSticky articleRef={articleRef} />
            </div>
          </div>

        </div>
      </ContainerOuter>
    </>
  )
}
