import { ISbStoryData } from '@storyblok/react'
import { BlogStoryblok, StoryblokAsset } from '@/types/component-types-sb'
import { Card } from '@/components/elements/Card.tsx'
import { formatDate } from '@/lib/formatDate.ts'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import Image from 'next/image'

function getTeaserImageUrl(blog: BlogStoryblok): string | null {
  const asset: StoryblokAsset | undefined = blog.teaserimage?.filename
    ? blog.teaserimage
    : blog.headerpicture?.filename
      ? blog.headerpicture
      : undefined

  if (!asset?.filename) return null

  return `${asset.filename}/m/300x225/smart/filters:quality(80)`
}

export function BlogCardList(props: { blogs: ISbStoryData<BlogStoryblok>[], layout: string }) {

  if (props.layout === 'small') {

    return (
      <ElementWrapper  >
        {
          props.blogs.map((blog) => {
            const imageUrl = getTeaserImageUrl(blog.content)
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
              const imageUrl = getTeaserImageUrl(blog.content)
              return (
                <article key={blog.id} className="md:grid md:grid-cols-4 md:items-baseline">
                  <Card className="md:col-span-3">
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
                        <Card.Title href={`/${blog.full_slug}`}>
                          {blog.content.teasertitle}
                        </Card.Title>
                        <Card.Eyebrow as="time" dateTime={blog.content.date} className="md:hidden" decorate>
                          {'' + formatDate(blog.content.date)}
                        </Card.Eyebrow>
                        <Card.Description>{blog.content.abstract}</Card.Description>
                        <Card.Cta>{blog.content.readmoretext ?? 'Weiterlesen'}</Card.Cta>
                      </div>
                    </div>
                  </Card>
                  <Card.Eyebrow as="time" dateTime={blog.content.date} className="mt-1 max-md:hidden">
                    {formatDate(blog.content.date)}
                  </Card.Eyebrow>
                </article>
              )
            })}
          </div>
        </div>
      </ElementWrapper>
    )
  }
}
