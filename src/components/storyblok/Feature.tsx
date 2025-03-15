import { storyblokEditable } from '@storyblok/react/rsc'
import { FeatureStoryblok } from '@/types/component-types-sb'
import { StoryblokRichText } from '@storyblok/react'

interface FeatureProps {
	blok: FeatureStoryblok
}

export default function Feature({ blok }: FeatureProps) {
	return <div {...storyblokEditable(blok)}>
		<p>Feature: {blok.name}</p>
		<div>	{blok.rt?.text}cc</div>


	</div>
}
