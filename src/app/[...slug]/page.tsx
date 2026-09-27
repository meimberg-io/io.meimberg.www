import { renderPage } from '@/lib/pageRenderer.tsx'
import type { Metadata } from 'next'
import { fetchStory } from '@/lib/storyblokApi'
import { buildCanonical, buildOgTwitter, deriveDescription, deriveTitle, selectOgImage } from '@/lib/metadata.ts'
import { isPreviewRequest } from '@/lib/preview'


export default async function StoryPage({ params, searchParams }: any) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const secret = Array.isArray(resolvedSearchParams?.secret) ? resolvedSearchParams.secret[0] : resolvedSearchParams?.secret
  return renderPage(resolvedParams?.slug, secret)
}

export async function generateMetadata({ params, searchParams }: any): Promise<Metadata> {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const secret = Array.isArray(resolvedSearchParams?.secret) ? resolvedSearchParams.secret[0] : resolvedSearchParams?.secret
  const isPreview = isPreviewRequest(secret)

  const slugParts: string[] = resolvedParams?.slug ?? []
  const slug = Array.isArray(slugParts) ? slugParts.join('/') : 'home'
  const { data } = await fetchStory(slug, isPreview)
  const story = data.story

  const title = deriveTitle(story)
  const description = deriveDescription(story)
  const canonical = buildCanonical(story.full_slug)
  const image = selectOgImage(story)
  const { openGraph, twitter } = buildOgTwitter({ title, description, canonical, image })

  return {
    title,
    description,
    alternates: { canonical },
    openGraph,
    twitter,
    // Versteckte Stories (siehe NOT_HIDDEN_FILTER) sind nur per direktem Link gedacht.
    ...(story.content?.hidden ? { robots: { index: false, follow: false } } : {})
  }
}
