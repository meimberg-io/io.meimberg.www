import { PageProps, renderPage } from '@/lib/pageRenderer.tsx'


export default async function StoryPage({ params, searchParams }: PageProps) {
	(await params).folder = "a"
  return renderPage({ params, searchParams })
}
