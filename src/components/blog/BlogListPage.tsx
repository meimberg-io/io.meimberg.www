import { Container } from '@/components/layout/Container'
import {
  COMPONENTTYPE_ARTICLE,
  COMPONENTTYPE_BLOG,
  STORYBLOK_FOLDER_ARTICLES,
  STORYBLOK_FOLDER_BLOG
} from '@/lib/storyblokShared'
import { fetchStories } from '@/lib/storyblokApi'
import { BlogCardList } from '@/components/elements/blogteaserlist/BlogCardList'
import Link from 'next/link'

const BLOG_LIST_LIMIT = 50

export type BlogListPageProps = {
  title: string
  basePath: '/blog' | '/artikel'
  tag?: string | null
  contentType?: 'blog' | 'article'
}

export async function BlogListPage({
  title,
  basePath,
  tag,
  contentType = 'blog',
}: BlogListPageProps) {
  const componentType =
    contentType === 'article' ? COMPONENTTYPE_ARTICLE : COMPONENTTYPE_BLOG
  const folder =
    contentType === 'article' ? STORYBLOK_FOLDER_ARTICLES : STORYBLOK_FOLDER_BLOG

  const { data } = await fetchStories(BLOG_LIST_LIMIT, componentType, {
    folder,
    tag: tag ?? undefined
  })
  const stories = data.stories

  return (
    <Container className="mt-16 lg:mt-32">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          {title}
        </h1>
        {tag && (
          <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
            Gefiltert nach:{' '}
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{tag}</span>
            {' · '}
            <Link href={basePath} className="text-interactive hover:underline">
              Filter entfernen
            </Link>
          </p>
        )}
      </header>
      <div className="mt-16">
        <BlogCardList blogs={stories} layout="one-column" />
      </div>
    </Container>
  )
}
