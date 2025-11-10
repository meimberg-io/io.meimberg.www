import type { ISbStoryData } from '@storyblok/react'

type AnyStory = ISbStoryData<any>

export function stripHtml(input?: string): string {
	if (!input) return ''
	return input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function clamp(input: string, max: number): string {
	if (input.length <= max) return input
	const truncated = input.slice(0, max + 1)
	const lastSpace = truncated.lastIndexOf(' ')
	return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated.slice(0, max)).trimEnd() + '…'
}

export function deriveTitle(story: AnyStory): string {
	const raw =
		(story?.content?.pagetitle as string | undefined) ||
		(story?.content?.teasertitle as string | undefined) ||
		(story?.name as string | undefined) ||
		'meimberg.io'
	return clamp(stripHtml(raw), 70)
}

export function deriveDescription(story: AnyStory): string {
	const raw =
		(story?.content?.abstract as string | undefined) ||
		(story?.content?.pageintro as string | undefined) ||
		''
	const cleaned = clamp(stripHtml(raw), 160)
	return cleaned.length > 0 ? cleaned : 'Olis Blick auf eine digitalisierte Welt'
}

export function selectOgImage(story: AnyStory): string | undefined {
	const header = (story?.content as any)?.headerpicture?.filename as string | undefined
	const teaser = (story?.content as any)?.teaserimage?.filename as string | undefined
	return header || teaser
}

export function buildCanonical(fullSlug?: string): string {
	if (!fullSlug || fullSlug === 'home') return '/'
	return `/${fullSlug}`
}

export function buildOgTwitter(params: {
	title: string
	description: string
	canonical: string
	image?: string
}) {
	const { title, description, canonical, image } = params
	const openGraph: any = {
		title,
		description,
		url: canonical
	}
	if (image) {
		openGraph.images = [{ url: image, alt: title }]
	}
	const twitter: any = {
		card: image ? 'summary_large_image' : 'summary',
		title,
		description
	}
	if (image) {
		twitter.images = [image]
	}
	return { openGraph, twitter }
}


