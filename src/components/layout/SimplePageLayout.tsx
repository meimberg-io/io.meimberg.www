import { Container } from '@/components/layout/Container.tsx'

export function SimplePageLayout({ layout, children }: {

	layout: string
	children?: React.ReactNode
}) {



	const containerClass = layout === "home" ? 'mt-9 sm:mt-9' : 'mt-16 sm:mt-32'
	return (
		<Container className={containerClass}>
			{children && <div className="mb-16 sm:mb-20">{children}</div>}
		</Container>
	)
}
