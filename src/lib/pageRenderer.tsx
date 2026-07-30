import { notFound } from 'next/navigation'
import { fetchStory, fetchSpecialFolder } from '@/lib/storyblokApi'
import StoryClient from '@/components/global/StoryClient.tsx'
import { StoryblokStory } from '@storyblok/react/rsc'
import { getStoryblokApi } from '@/lib/storyblok'
import { COMPONENTTYPE_SPECIAL, COMPONENTTYPE_SPECIALCHAPTER } from '@/lib/storyblokShared'
import { buildSpecialContext, specialPathFromSlug } from '@/lib/specials'
import { SpecialProvider } from '@/components/special/SpecialContext.tsx'
import { isEditorRequest, isPreviewRequest } from '@/lib/preview'


export async function renderPage( slug?:string[],  secret?: string | undefined ) {
	const full_slug = slug?.join('/') ?? 'home'
	const isPreview = isPreviewRequest(secret)
	getStoryblokApi()
	let data: Awaited<ReturnType<typeof fetchStory>>['data']
	try {
		const result = await fetchStory(full_slug, isPreview)
		data = result.data
	} catch (err: unknown) {
		const status = (err as { status?: number; response?: { status?: number } })?.status
				?? (err as { status?: number; response?: { status?: number } })?.response?.status
		if (status === 404 || status === 422) {
			notFound()
		}
		throw err
	}

	// Defense-in-depth (MICM-7): Content-Manager-only LinkedIn posts must never
	// render on the public site, even if one were accidentally published. They
	// live in the `linkedin/` folder and use the `linkedin_post` component.
	// Draft-only persistence already keeps them out via 404, this is a second guard.
	const component = data.story?.content?.component
	const storyFullSlug = data.story?.full_slug ?? full_slug
	if (component === 'linkedin_post' || storyFullSlug === 'linkedin' || storyFullSlug?.startsWith('linkedin/')) {
		notFound()
	}

	// Zwei getrennte Fragen: `isPreview` bestimmt den Inhaltsstand (oben beim
	// Fetch), `isEditorRequest` den Renderpfad. Nur im Visual Editor braucht es
	// StoryClient samt Bridge; sonst rendert die Seite server-seitig wie im
	// Produktivbetrieb — was async Server-Komponenten im Body voraussetzen.
	const rendered = isEditorRequest(secret)
		? <StoryClient initialStory={data.story} />
		: <StoryblokStory story={data.story} />

	// Special-Übersicht und Kapitel brauchen beide die Kapitelliste ihres
	// Ordners: die Übersicht fürs Verzeichnis, das Kapitel für Sidebar und
	// Zurück/Weiter. Einmal hier laden und über Context bereitstellen erspart
	// die sonst nötige Server/Client-Doppelung der Blöcke (vgl.
	// BlogteaserlistServer/BlogteaserlistClient) und funktioniert im Editor
	// genauso wie live.
	if (component === COMPONENTTYPE_SPECIAL || component === COMPONENTTYPE_SPECIALCHAPTER) {
		const specialPath = specialPathFromSlug(storyFullSlug)
		try {
			const stories = await fetchSpecialFolder(specialPath, isPreview)
			const fallbackTitle =
				component === COMPONENTTYPE_SPECIAL
					? (data.story.content?.pagetitle ?? data.story.name ?? '')
					: ''
			const specialContext = buildSpecialContext(specialPath, stories, fallbackTitle)
			return <SpecialProvider value={specialContext}>{rendered}</SpecialProvider>
		} catch (err: unknown) {
			console.error(`fetchSpecialFolder failed for special path "${specialPath}":`, err)
			return rendered
		}
	}

	return rendered
}
