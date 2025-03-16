import { storyblokEditable } from '@storyblok/react/rsc'
import { PictureStoryblok } from '@/types/component-types-sb'
import Image from 'next/image'



export default function Picture({ blok }: PictureStoryblok) {
	return (
		<div {...storyblokEditable(blok)} className="">
			<div className="max-w-xs px-2.5 lg:max-w-none">
				<Image
					src={blok.image.filename}
					width={420}
					height={420}
					alt=""
					sizes="(min-width: 1024px) 32rem, 20rem"
					className="aspect-square rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
				/>

			</div>
		</div>
	)}
