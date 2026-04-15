import type { Metadata } from 'next'
import { Layout } from '@/components/layout/Layout.tsx'
import { Providers } from '@/lib/providers.tsx'
import { StoryblokProvider } from '@/provider'
import { fetchGlobalsettings } from '@/lib/storyblokApi'
import '@/styles/tailwind.css'
import { MatomoTracker } from '@/components/util/MatomoTracker.tsx'


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
	const globalsettings = await fetchGlobalsettings(false)

	return (
		<html lang="en" className="h-full antialiased" suppressHydrationWarning>
			<body className="flex h-full bg-zinc-50 dark:bg-black" suppressHydrationWarning>
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
