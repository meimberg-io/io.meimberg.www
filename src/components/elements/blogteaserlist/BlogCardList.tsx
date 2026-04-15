import { ISbStoryData } from '@storyblok/react'
import {
  ArticleStoryblok,
  BlogStoryblok,
  StoryblokAsset
} from '@/types/component-types-sb'
import { Card } from '@/components/elements/Card.tsx'
import { formatDate } from '@/lib/formatDate.ts'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import {
  storyblokImageForCard,
  type ProcessedStoryblokImage
} from '@/lib/storyblokImageUrl.ts'
import Image from 'next/image'
import Link from 'next/link'

function resolveAsset(
  content: BlogStoryblok | ArticleStoryblok
): StoryblokAsset | undefined {
  if (content.teaserimage?.filename) return content.teaserimage
  if (content.headerpicture?.filename) return content.headerpicture
  return undefined
}

function getImage(
  content: BlogStoryblok | ArticleStoryblok,
  width: number,
  height: number,
  quality = 80
): ProcessedStoryblokImage | null {
  return storyblokImageForCard(resolveAsset(content), width, height, quality)
}

export function BlogCardList(props: {
  blogs: ISbStoryData<BlogStoryblok | ArticleStoryblok>[]
  layout: string
}) {

  if (props.layout === 'cards') {
    return (
      <ElementWrapper spacing="large">
        <div
          className="not-prose grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2"
        >
          {props.blogs.map((blog) => {
            const headerImage = getImage(blog.content, 1260, 420, 90)
            const href = `/${blog.full_slug}`
            const title = blog.content.teasertitle ?? 'Beitrag'
            return (
              <article
                key={blog.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-zinc-100 shadow-md dark:bg-zinc-800"
              >
                <div
                  className="relative h-32 w-full shrink-0 overflow-hidden bg-zinc-200 sm:h-36 dark:bg-zinc-700"
                >
                  <Link
                    href={href}
                    className="absolute inset-0 z-10"
                    aria-label={title}
                  />
                  {headerImage ? (
                    <Image
                      src={headerImage.src}
                      alt={title}
                      fill
                      unoptimized={headerImage.unoptimized}
                      quality={90}
                      className="absolute inset-0 z-0 object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6 dark:text-zinc-100">
                  <time
                    dateTime={blog.content.date}
                    className="text-xs font-medium text-zinc-500 dark:text-zinc-400 sm:text-sm"
                  >
                    {formatDate(blog.content.date)}
                  </time>
                  <h2 className="mt-2 line-clamp-2 text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    <Link
                      href={href}
                      className="text-zinc-900 transition hover:text-teal-500 dark:text-zinc-100 dark:hover:text-teal-400"
                    >
                      {blog.content.teasertitle}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {blog.content.abstract}
                  </p>
                  <Link
                    href={href}
                    className="mt-auto inline-flex items-center pt-4 text-sm font-medium text-teal-500 transition hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-400"
                  >
                    {blog.content.readmoretext ?? 'Weiterlesen'}
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="ml-1 h-4 w-4 stroke-current"
                    >
                      <path
                        d="M6.75 5.75 9.25 8l-2.5 2.25"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </ElementWrapper>
    )
  }

  const isTwoColumn = props.layout === 'two-column'

  const listItem = (blog: ISbStoryData<BlogStoryblok | ArticleStoryblok>) => {
    const imageData = getImage(blog.content, 256, 192)
    return (
      <article key={blog.id}>
        <Card>
          <div className="flex gap-6">
            {imageData && (
              <div className="relative h-[80px] w-[106px] shrink-0 overflow-hidden rounded-lg sm:h-[105px] sm:w-[140px]">
                <Image
                  src={imageData.src}
                  alt={blog.content.teasertitle ?? ''}
                  fill
                  unoptimized={imageData.unoptimized}
                  quality={88}
                  className="object-cover"
                  sizes="(min-width: 640px) 140px, 106px"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-x-4">
                <Card.Title href={`/${blog.full_slug}`}>
                  {blog.content.teasertitle}
                </Card.Title>
                <Card.Eyebrow as="time" dateTime={blog.content.date} className="shrink-0">
                  {formatDate(blog.content.date)}
                </Card.Eyebrow>
              </div>
              <Card.Description>{blog.content.abstract}</Card.Description>
              <Card.Cta>{blog.content.readmoretext ?? 'Weiterlesen'}</Card.Cta>
            </div>
          </div>
        </Card>
      </article>
    )
  }

  if (isTwoColumn) {
    return (
      <ElementWrapper spacing="large">
        <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2">
          {props.blogs.map(listItem)}
        </div>
      </ElementWrapper>
    )
  }

  return (
    <ElementWrapper>
      <div className="flex max-w-3xl flex-col space-y-16">
        {props.blogs.map(listItem)}
      </div>
    </ElementWrapper>
  )
}
