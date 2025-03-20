'use client'

import { useState, useEffect } from 'react'
import { ISbStoryData, useStoryblokBridge } from '@storyblok/react'
import { StoryblokStory } from '@storyblok/react/rsc'
import { RESOLVE_RELATIONS } from '@/lib/storyblok.ts'

const StoryClient = ({ initialStory }: { initialStory: ISbStoryData }) => {
	const [story, setStory] = useState(initialStory)
	const [isMounted, setIsMounted] = useState(false)

	// Markiere den Client-Mount, um SSR-Probleme zu vermeiden
	useEffect(() => {
		setIsMounted(true)
	}, [])

	useEffect(() => {
		setStory(initialStory)
	}, [initialStory])

	// Storyblok Live-Editing Bridge aktivieren
	useEffect(() => {
		if (story?.id) {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			return useStoryblokBridge(story.id, (updatedStory) => {
					setStory(updatedStory)
				},
				{ resolveRelations: RESOLVE_RELATIONS })
		}
	}, [isMounted, story?.id])

	if (!isMounted) return null // Verhindert Hydration-Probleme
	return story ? <StoryblokStory story={story} /> : <p>Loading...</p>
}

export default StoryClient
