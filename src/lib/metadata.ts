import type { ISbStoryData } from '@storyblok/react'

type AnyStory = ISbStoryData<any>
const DEFAULT_META_DESCRIPTION = 'Olis Blick auf eine digitalisierte Welt'
const HOME_META_DESCRIPTION =
	'Oliver Meimberg schreibt ueber digitale Kommunikation, Technologie und Medien - persoenlich, kritisch und praxisnah.'

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

export function deriveDescription(story: AnyStory, fallback: string = DEFAULT_META_DESCRIPTION): string {
	const raw =
		(story?.content?.abstract as string | undefined) ||
		(story?.content?.pageintro as string | undefined) ||
		''
	const cleaned = clamp(stripHtml(raw), 160)
	return cleaned.length > 0 ? cleaned : fallback
}

export function deriveHomeDescription(story: AnyStory): string {
	return deriveDescription(story, HOME_META_DESCRIPTION)
}

export function selectOgImage(story: AnyStory): string | undefined {
	const header = (story?.content as any)?.headerpicture?.filename as string | undefined
	const teaser = (story?.content as any)?.teaserimage?.filename as string | undefined
	return header || teaser
}

const OG_SHARE_W = 1200
const OG_SHARE_H = 630

/**
 * Link-preview crawlers (Meta in particular) are picky about og:image size.
 * Raw Storyblok asset URLs can be mis-validated; the Image Service yields a
 * known 1200×630 raster that matches common og:image expectations.
 */
export function resolveSocialShareImage(imageUrl: string): {
	url: string
	width?: number
	height?: number
} {
	try {
		const u = new URL(imageUrl)
		const isStoryblok = u.hostname.endsWith('storyblok.com')
		if (!isStoryblok || /\/m\/\d+x\d+/.test(u.pathname)) {
			return { url: imageUrl }
		}
		const url = `${imageUrl.replace(/\/$/, '')}/m/${OG_SHARE_W}x${OG_SHARE_H}/smart/filters:quality(90)`
		return { url, width: OG_SHARE_W, height: OG_SHARE_H }
	} catch {
		return { url: imageUrl }
	}
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
	const resolvedImage = image ? resolveSocialShareImage(image) : undefined
	if (resolvedImage) {
		openGraph.images = [
			{
				url: resolvedImage.url,
				alt: title,
				...(resolvedImage.width != null && resolvedImage.height != null
					? { width: resolvedImage.width, height: resolvedImage.height }
					: {})
			}
		]
	}
	const twitter: any = {
		card: image ? 'summary_large_image' : 'summary',
		title,
		description
	}
	if (resolvedImage) {
		twitter.images = [resolvedImage.url]
	}
	return { openGraph, twitter }
}


