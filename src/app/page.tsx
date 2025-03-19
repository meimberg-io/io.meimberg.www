import { PageProps, renderPage } from '@/app/pageRenderer.tsx'


export default async function StoryPage({ params, searchParams }: PageProps) {
	return renderPage({ params, searchParams })
}
