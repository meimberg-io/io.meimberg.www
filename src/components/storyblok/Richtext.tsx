import { storyblokEditable } from '@storyblok/react/rsc'
import { RichtextStoryblok } from '@/types/component-types-sb'
import { richTextResolver } from '@storyblok/richtext'



export default function Richtext({ blok }: RichtextStoryblok) {

	const { render } = richTextResolver()

	const html = render(blok.content) as string
	return (<div {...storyblokEditable(blok)}>
			<div className="space-y-7 text-base text-zinc-600 dark:text-zinc-400" dangerouslySetInnerHTML={{ __html: html }} ></div>
	</div>
)}
