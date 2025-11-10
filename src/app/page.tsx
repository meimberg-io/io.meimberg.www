import { renderPage } from '@/lib/pageRenderer.tsx'
import type { Metadata } from 'next'
import { fetchStory } from '@/lib/storyblok.ts'
import { buildCanonical, buildOgTwitter, deriveDescription, deriveTitle, selectOgImage } from '@/lib/metadata.ts'


export default async function StoryPage({ params, searchParams }: any) {
	const resolvedParams = await params
	const resolvedSearchParams = await searchParams
	const secret = Array.isArray(resolvedSearchParams?.secret) ? resolvedSearchParams.secret[0] : resolvedSearchParams?.secret
	return renderPage(resolvedParams?.slug, secret)
}

export async function generateMetadata({ searchParams }: any): Promise<Metadata> {
	const resolvedSearchParams = await searchParams
	const secret = Array.isArray(resolvedSearchParams?.secret) ? resolvedSearchParams.secret[0] : resolvedSearchParams?.secret
	const isPreview = secret === process.env.NEXT_PUBLIC_STORYBLOK_EDITOR_SECRET
	const { data } = await fetchStory('home', isPreview)
	const story = data.story

	const title = 'Oliver Meimberg'
	const description = deriveDescription(story)
	const canonical = buildCanonical(story.full_slug)
	const image = selectOgImage(story)
	const { openGraph, twitter } = buildOgTwitter({ title, description, canonical, image })

	return {
		title,
		description,
		alternates: { canonical },
		openGraph,
		twitter
	}
}
