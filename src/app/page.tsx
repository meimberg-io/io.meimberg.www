import { renderPage } from '@/lib/pageRenderer.tsx'


export default async function StoryPage({ params, searchParams }: any) {
	const resolvedParams = await params
	const resolvedSearchParams = await searchParams
	const secret = Array.isArray(resolvedSearchParams?.secret) ? resolvedSearchParams.secret[0] : resolvedSearchParams?.secret
	return renderPage(resolvedParams?.slug, secret)
}
