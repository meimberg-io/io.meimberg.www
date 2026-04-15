import { storyblokEditable } from '@storyblok/react/rsc'
import { LinklistStoryblok, SociallinkStoryblok } from '@/types/component-types-sb'
import { Icon } from '@/components/util/Icon.tsx'
import Link from 'next/link'
import { ISbStoryData } from '@storyblok/react'

const PLATFORM_LABELS: Array<{ pattern: RegExp, label: string }> = [
	{ pattern: /(^|\.)linkedin\.com$/i, label: 'LinkedIn' },
	{ pattern: /(^|\.)github\.com$/i, label: 'GitHub' },
	{ pattern: /(^|\.)youtube\.com$/i, label: 'YouTube' },
	{ pattern: /(^|\.)youtu\.be$/i, label: 'YouTube' }
]

function normalizeLabel(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined
	const trimmed = value.trim()
	return trimmed.length > 0 ? trimmed : undefined
}

function resolveSocialAriaLabel(link: ISbStoryData<SociallinkStoryblok>): string {
	const explicitLabel = normalizeLabel(link.content.text)
	if (explicitLabel) return explicitLabel

	const rawHref = normalizeLabel(link.content.url?.url)
	if (!rawHref) return 'Social profile'

	if (rawHref.toLowerCase().startsWith('mailto:')) return 'E-Mail'

	try {
		const parsedUrl = new URL(rawHref)
		const host = parsedUrl.hostname.toLowerCase()
		const mappedPlatform = PLATFORM_LABELS.find(({ pattern }) => pattern.test(host))
		if (mappedPlatform) return mappedPlatform.label
		return host.replace(/^www\./, '')
	} catch {
		return 'Social profile'
	}
}

export default function Linklist({ blok }: { blok: LinklistStoryblok }) {
	// Type guard to filter out string entries
	const isStoryData = (item: any): item is ISbStoryData<SociallinkStoryblok> => {
		return typeof item === 'object' && item !== null && 'content' in item
	}

	const resolvedLinks = blok.links?.filter(isStoryData) || []

	// Falls style "icontext" ist, eine Liste rendern
	if (blok.style === 'icontext') {
		return (
			<ul role="list" className="space-y-4" {...storyblokEditable(blok)}>
				{resolvedLinks.map((link) => (
					<li key={link.slug} className="flex">
						<Link
							className="group flex text-sm font-medium text-zinc-800 transition hover:text-teal-500 dark:text-zinc-200 dark:hover:text-teal-500"
							href={link.content.url.url}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon svgText={typeof link.content.icon === 'object' ? (link.content.icon.content.svg || '') : ''} className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500" />
							<span className="ml-4">{link.content.text}</span>
						</Link>
					</li>
				))}
			</ul>
		)
	}

	// Standardfall: Nur Icons
	return (
		<div className="mt-6 flex gap-6" {...storyblokEditable(blok)}>
			{resolvedLinks.map((link) => (
				<Link
					key={link.slug}
					className="group -m-1 p-1"
					href={link.content.url.url}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={resolveSocialAriaLabel(link)}
				>
					<Icon svgText={typeof link.content.icon === 'object' ? (link.content.icon.content.svg || '') : ''} className="h-6 w-6 flex-none fill-zinc-500 transition group-hover:fill-teal-500"/>
				</Link>
			))}
		</div>
	)
}
