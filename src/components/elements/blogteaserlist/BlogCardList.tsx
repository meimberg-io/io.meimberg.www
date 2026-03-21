import { ISbStoryData } from '@storyblok/react'
import {
  ArticleStoryblok,
  BlogStoryblok,
  StoryblokAsset
} from '@/types/component-types-sb'
import { Card } from '@/components/elements/Card.tsx'
import { formatDate } from '@/lib/formatDate.ts'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { storyblokImageForCard } from '@/lib/storyblokImageUrl.ts'
import Image from 'next/image'
import Link from 'next/link'

function getTeaserImageUrl(
  blog: BlogStoryblok | ArticleStoryblok
): string | null {
  const asset: StoryblokAsset | undefined = blog.teaserimage?.filename
    ? blog.teaserimage
    : blog.headerpicture?.filename
      ? blog.headerpicture
      : undefined

  if (!asset?.filename) return null

  return `${asset.filename}/m/300x225/smart/filters:quality(80)`
}

function getCardHeaderImage(
  blog: BlogStoryblok | ArticleStoryblok
): ReturnType<typeof storyblokImageForCard> {
  const asset: StoryblokAsset | undefined = blog.headerpicture?.filename
    ? blog.headerpicture
    : blog.teaserimage?.filename
      ? blog.teaserimage
      : undefined

  return storyblokImageForCard(asset, 1200, 400, 85)
}

export function BlogCardList(props: {
  blogs: ISbStoryData<BlogStoryblok | ArticleStoryblok>[]
  layout: string
  showImage?: boolean
}) {
  const showImage = props.showImage !== false

  if (props.layout === 'cards') {
    return (
      <ElementWrapper spacing="large">
        <div
          className="not-prose grid grid-cols-1 gap-x-12 gap-y-12 lg:grid-cols-2"
        >
          {props.blogs.map((blog) => {
            const headerImage = getCardHeaderImage(blog.content)
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
                    // eslint-disable-next-line @next/next/no-img-element -- Next/Image fill had parent height 0 (only abs. children)
                    <img
                      src={headerImage.src}
                      alt={title}
                      className="absolute inset-0 z-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
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

  if (props.layout === 'small') {
    return (
      <ElementWrapper  >
        {
          props.blogs.map((blog) => {
            const imageUrl = showImage ? getTeaserImageUrl(blog.content) : null
            return (
              <article key={blog.id} className="mt-16 sm:mt-20">
                <div className="flex gap-6">
                  {imageUrl && (
                    <div className="hidden sm:block shrink-0 w-[140px] h-[105px] relative rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={blog.content.teasertitle ?? ''}
                        fill
                        className="object-cover"
                        sizes="140px"
                      />
                    </div>
                  )}
                  <Card as="article" className="flex-1">
                    <Card.Title href={`/${blog.full_slug}`}>{blog.content.teasertitle}</Card.Title>
                    <Card.Eyebrow as="time" dateTime={blog.content.date} decorate>
                      {blog.content.date && formatDate(blog.content.date)}
                    </Card.Eyebrow>
                    <Card.Description>{blog.content.abstract}</Card.Description>
                    <Card.Cta>{blog.content.readmoretext ?? 'Weiterlesen'}</Card.Cta>
                  </Card>
                </div>
              </article>
            )
          })
        }
      </ElementWrapper>
    )
  } else {
    return (
      <ElementWrapper spacing="large">
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex max-w-3xl flex-col space-y-16">
            {props.blogs.map((blog) => {
              const imageUrl = showImage ? getTeaserImageUrl(blog.content) : null
              return (
                <article key={blog.id}>
                  <Card>
                    <div className="flex gap-6">
                      {imageUrl && (
                        <div className="hidden sm:block shrink-0 w-[140px] h-[105px] relative rounded-lg overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={blog.content.teasertitle ?? ''}
                            fill
                            className="object-cover"
                            sizes="140px"
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
            })}
          </div>
        </div>
      </ElementWrapper>
    )
  }
}
