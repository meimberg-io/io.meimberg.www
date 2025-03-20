import { PageProps, renderPage } from '@/lib/pageRenderer.tsx'


export default async function StoryPage({ params, searchParams }: PageProps) {
	return renderPage({ params, searchParams })
}
