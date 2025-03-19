'use client'

import { useState } from 'react'
import { useStoryblokBridge } from '@storyblok/react'
import { StoryblokStory } from '@storyblok/react/rsc'
import { RESOLVE_RELATIONS } from '@/lib/storyblok.ts'

const StoryClient = ({ initialStory }) => {
	// State für die Live-Story
	const [story, setStory] = useState(initialStory)

	// Storyblok Bridge für Live-Editing aktivieren
	useStoryblokBridge(story.id, (updatedStory) => {
			setStory(updatedStory)
		},
		{
			resolveRelations: 'linklist.links,sociallink.icon'
		}
	)

	return <StoryblokStory story={story} />
}

export default StoryClient
