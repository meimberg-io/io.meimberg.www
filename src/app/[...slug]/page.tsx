import { renderPage } from '@/lib/pageRenderer.tsx'


export default async function StoryPage({ params, searchParams }: {
  params: { slug: string[] }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return renderPage(params.slug, Array.isArray(searchParams.secret) ? searchParams.secret[0] : searchParams.secret)
}
