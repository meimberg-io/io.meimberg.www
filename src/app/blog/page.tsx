import type { Metadata } from 'next'
import { BlogListPage } from '@/components/blog/BlogListPage'
import { buildCanonical, buildOgTwitter } from '@/lib/metadata'

type Props = {
  searchParams: Promise<{ tag?: string | string[] }>
}

export default async function BlogPage({ searchParams }: Props) {
  const resolved = await searchParams
  const tag = Array.isArray(resolved.tag) ? resolved.tag[0] : resolved.tag

  return <BlogListPage title="Blog" basePath="/blog" tag={tag ?? null} />
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolved = await searchParams
  const tag = Array.isArray(resolved.tag) ? resolved.tag[0] : resolved.tag
  const title = tag ? `Blog · ${tag}` : 'Blog'
  const description = tag
    ? `Blogbeiträge zum Thema ${tag}`
    : 'Blog und Artikel von meimberg.io'
  const canonical = tag ? buildCanonical(`blog?tag=${encodeURIComponent(tag)}`) : buildCanonical('blog')
  const { openGraph, twitter } = buildOgTwitter({ title, description, canonical })

  return {
    title,
    description,
    alternates: { canonical },
    openGraph,
    twitter
  }
}
