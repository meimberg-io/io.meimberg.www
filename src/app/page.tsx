import { renderPage } from '@/lib/pageRenderer.tsx'


export default async function StoryPage({ params, searchParams }: any) {
	const secret = Array.isArray(searchParams?.secret) ? searchParams.secret[0] : searchParams?.secret
	return renderPage(params?.slug, secret)
}
