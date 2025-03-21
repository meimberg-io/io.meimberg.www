import { PageProps, renderPage } from '@/lib/pageRenderer.tsx'


export default async function StoryPage({ params, searchParams }: PageProps) {
	(await params).folder = "p"
  return renderPage({ params, searchParams })
}
