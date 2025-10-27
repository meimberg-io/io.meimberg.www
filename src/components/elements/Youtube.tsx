'use client'
import { YoutubeStoryblok } from '@/types/component-types-sb'
import ReactPlayer from 'react-player'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { storyblokEditable } from '@storyblok/react/rsc'


export default function Youtube({ blok }: { blok: YoutubeStoryblok }) {
	return (
		<ElementWrapper>
			{blok.format === 'square' ? (
				<div {...storyblokEditable(blok)} className="relative w-full pb-[100%]">
					<div className="absolute top-0 left-0 w-full h-full">
						<ReactPlayer url={'https://www.youtube.com/watch?v=' + blok.youtubeid} width="100%" height="100%"/>
					</div>
				</div>
			) : (
				<div {...storyblokEditable(blok)} className="w-full overflow-hidden rounded-lg">
					<ReactPlayer url={'https://www.youtube.com/watch?v=' + blok.youtubeid} width="100%" />
				</div>
			)}


		</ElementWrapper>
	)

}
