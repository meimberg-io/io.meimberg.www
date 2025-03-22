import { PageProps, renderPage } from '@/lib/pageRenderer.tsx'


export default async function StoryPage(pagePropsPromise: Promise<PageProps>) {
	const { params, searchParams } = await pagePropsPromise
	return renderPage(params.slug, searchParams.secret)
}
