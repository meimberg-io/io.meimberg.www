import { DividerStoryblok } from '@/types/component-types-sb'


export default function Divider({ blok }: { blok: DividerStoryblok }) {
	return <hr key={blok._uid}/>
}
