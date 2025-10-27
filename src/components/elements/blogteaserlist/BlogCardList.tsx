import { ISbStoryData } from '@storyblok/react'
import { BlogStoryblok } from '@/types/component-types-sb'
import { Card } from '@/components/elements/articleteaserlist/Card.tsx'
import { formatDate } from '@/lib/formatDate.ts'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'


export function BlogCardList(props: { blogs: ISbStoryData<BlogStoryblok>[], layout: string }) {

  if (props.layout === 'small') {

    return (
      <ElementWrapper  >
        {
          props.blogs.map((blog) => (

            <article key={blog.id} className="mt-16 sm:mt-20">
              <Card as="article">
                <Card.Title href={`/${blog.full_slug}`}>{blog.content.teasertitle}</Card.Title>
                <Card.Eyebrow as="time" dateTime={blog.content.date} decorate>
                  {blog.content.date && formatDate(blog.content.date)}
                </Card.Eyebrow>
                <Card.Description>{blog.content.abstract}</Card.Description>
                <Card.Cta>{blog.content.readmoretext ?? 'Weiterlesen'}</Card.Cta>
              </Card>
            </article>
          ))
        }

      </ElementWrapper>
    )
  } else {
    return (
      <ElementWrapper spacing="large">

        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="flex max-w-3xl flex-col space-y-16">
            {props.blogs.map((blog) => (
              <article key={blog.id} className="md:grid md:grid-cols-4 md:items-baseline ">
                <Card className="md:col-span-3">
                  <Card.Title href={`/${blog.full_slug}`}>
                    {blog.content.teasertitle}
                  </Card.Title>
                  <Card.Eyebrow as="time" dateTime={blog.content.date} className="md:hidden" decorate>
                    {'xx' + formatDate(blog.content.date)}
                  </Card.Eyebrow>
                  <Card.Description>{blog.content.abstract}</Card.Description>
                  <Card.Cta>{blog.content.readmoretext ?? 'Weiterlesen'}</Card.Cta>
                </Card>
                <Card.Eyebrow as="time" dateTime={blog.content.date} className="mt-1 max-md:hidden">
                  {formatDate(blog.content.date)}
                </Card.Eyebrow>
              </article>
            ))}
          </div>
        </div>
      </ElementWrapper>
    )

  }
}

