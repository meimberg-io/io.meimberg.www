import { ToolStoryblok } from '@/types/component-types-sb'
import { Card } from '@/components/elements/articleteaserlist/Card.tsx'


export default function Tool({ blok }: {blok:ToolStoryblok}) {
	return (

		<Card as="li">
			<Card.Title as="h3" href={blok.link?.url}>
				{blok.title}
			</Card.Title>
			<Card.Description>{blok.description}</Card.Description>
		</Card>

	)
}
