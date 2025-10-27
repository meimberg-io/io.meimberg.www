'use client'

import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'

import { Container } from '@/components/layout/Container.tsx'
import { formatDate } from '@/lib/formatDate.ts'
import { AppContext } from '@/lib/providers.tsx'
import { BlogStoryblok } from '@/types/component-types-sb'
import { ArrowLeftIcon } from '@/components/util/Svg.tsx'
import HeaderPicture from '@/components/global/HeaderPicture.tsx'
import { storyblokEditable } from '@storyblok/react/rsc'
import Pagetitle from '@/components/elements/Pagetitle.tsx'


export function BlogLayout({ blog, children }: {
  blog: BlogStoryblok
  children: React.ReactNode
}) {
  const router = useRouter()
  const { previousPathname } = useContext(AppContext)
  return (
    <>
      <HeaderPicture headerpicture={blog.headerpicture} />
      <Container className="mt-16 lg:mt-32">

        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
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

            <article>
              <header className="flex flex-col">
                {blog.pagetitle && (<div {...storyblokEditable(blog)}>
                    <Pagetitle blok={{ pagetitle: blog.pagetitle, pageintro: blog.pageintro, whitetitle: true }} />
                  </div>
                )}
                <time dateTime={blog.date} className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500 mb-8">
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                  <span className="ml-3">{formatDate(blog.date)}</span>
                </time>
              </header>

              {children}

            </article>
          </div>

        </div>
      </Container>
    </>
  )
}

