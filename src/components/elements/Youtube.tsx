"use client"
import { YoutubeStoryblok } from '@/types/component-types-sb'
import ReactPlayer from 'react-player'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import { storyblokEditable } from '@storyblok/react/rsc'


export default function Youtube({ blok }: YoutubeStoryblok) {
console.log("bdvf",blok);
	return (
		<ElementWrapper>
			<div {...storyblokEditable(blok)} className="w-full overflow-hidden rounded-lg ">


				<ReactPlayer
					url={'https://www.youtube.com/watch?' + blok.youtubeid}
					width="100%"

				/>


			</div>
		</ElementWrapper>
	)

}
