'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export function StoryblokProvider() {
	const searchParams = useSearchParams()
	const isStoryblokPreview = searchParams?.has('_storyblok') ?? false

	useEffect(() => {
		if (!isStoryblokPreview) return
		import('@/lib/storyblok').then(({ getStoryblokApi }) => {
			getStoryblokApi()
		})
	}, [isStoryblokPreview])

	return null
}
