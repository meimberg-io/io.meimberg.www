import type { Metadata } from 'next'
import { BlogListPage } from '@/components/blog/BlogListPage'
import { buildCanonical, buildOgTwitter } from '@/lib/metadata'

type Props = {
  searchParams: Promise<{ tag?: string | string[] }>
}

export default async function ArtikelPage({ searchParams }: Props) {
  const resolved = await searchParams
  const tag = Array.isArray(resolved.tag) ? resolved.tag[0] : resolved.tag

  return (
    <BlogListPage
      title="Artikel"
      basePath="/artikel"
      tag={tag ?? null}
      contentType="article"
      showImage
    />
  )
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolved = await searchParams
  const tag = Array.isArray(resolved.tag) ? resolved.tag[0] : resolved.tag
  const title = tag ? `Artikel · ${tag}` : 'Artikel'
  const description = tag
    ? `Artikel zum Thema ${tag}`
    : 'Artikel von meimberg.io'
  const canonical = tag ? buildCanonical(`artikel?tag=${encodeURIComponent(tag)}`) : buildCanonical('artikel')
  const { openGraph, twitter } = buildOgTwitter({ title, description, canonical })

  return {
    title,
    description,
    alternates: { canonical },
    openGraph,
    twitter
  }
}
