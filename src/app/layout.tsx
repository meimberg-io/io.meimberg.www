import type { Metadata } from 'next'
import { Layout } from '@/components/layout/Layout.tsx'
import { Providers } from '@/lib/providers.tsx'
import { StoryblokProvider } from '@/provider'
import { fetchGlobalsettings } from '@/lib/storyblokApi'
import '@/styles/tailwind.css'
import { MatomoTracker } from '@/components/util/MatomoTracker.tsx'
import { headlineFont } from '@/styles/fonts'
import { isPreviewRequest } from '@/lib/preview'


export const revalidate = 0

export const metadata: Metadata = {
	metadataBase: new URL('https://www.meimberg.io'),
	title: {
		default: 'meimberg.io',
		template: '%s | meimberg.io'
	},
	description: 'Olis Blick auf eine digitalisierte Welt',
	alternates: {
		types: {
			'application/rss+xml': [
				{ url: '/api/rss.xml', title: 'Blog' },
				{ url: '/api/artikel/rss.xml', title: 'Artikel' }
			]
		}
	}
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	// Ein Root-Layout bekommt keine searchParams, kann den Query-Parameter also
	// nicht sehen. Über den Env-Schalter folgen Navigation und Footer der
	// Preview jetzt trotzdem — im Visual Editor bleiben sie wie bisher
	// veröffentlicht.
	const globalsettings = await fetchGlobalsettings(isPreviewRequest())

	return (
		<html lang="en" className={`h-full antialiased ${headlineFont.variable}`} suppressHydrationWarning>
			<body className="flex h-full bg-background" suppressHydrationWarning>
			<Providers>
				<div className="flex w-full">
					<Layout globalsettings={globalsettings}>
						{children}
					</Layout>
				</div>
				<StoryblokProvider />
			</Providers>
			<MatomoTracker />
			</body>
		</html>
	)
}
