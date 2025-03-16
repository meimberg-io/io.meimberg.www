import { Container } from '@/components/spotlight/Container.tsx'

export function SimpleLayout({ title, intro, layout, children }: {
	title: string
	intro: string
	layout: string
	children?: React.ReactNode
}) {



	const containerClass = layout === "home" ? 'mt-9 sm:mt-9' : 'mt-16 sm:mt-32'
	return (
		<Container className={containerClass}>

			{children && <div className="mt-16 sm:mt-20">{children}</div>}
		</Container>
	)
}
