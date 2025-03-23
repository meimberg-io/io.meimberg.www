"use client"

import { SoundcloudStoryblok } from '@/types/component-types-sb'
import ElementWrapper from '@/components/layout/ElementWrapper.tsx'
import SoundCloudPlayer from 'react-player/soundcloud'


export default function Soundcloud({ blok }: SoundcloudStoryblok) {

	return (
		<ElementWrapper>
		<div className="rounded-lg overflow-hidden">

			<SoundCloudPlayer
				width="100%"
				height="160px"
				light={false}
				url={blok.url}
				config={{
					soundcloud: {
						options: {
							visual: false, // zeigt das kleine Widget
							color: '#00ff00'  ,         // HEX-Farbcode für Player-Elemente (nur bei visual: false wirksam!)
							liking: true,             // Like-Button

						}
					}
				}as any}

			/>


		</div>
	</ElementWrapper>
	)

}
