import type { Metadata } from 'next'
import { Layout } from '@/components/layout/Layout.tsx'
import { Providers } from '@/lib/providers.tsx'
import { StoryblokProvider } from '@/provider'
import '@/styles/tailwind.css'
import { Analytics } from "@vercel/analytics/react"
import { MatomoTracker } from '@/components/util/MatomoTracker.tsx'


// export const revalidate = 0
// export const fetchCache = 'force-no-store'

export const metadata: Metadata = {
	title: 'meimberg.io',
	description: 'Olis Blick auf eine digitalisierte Welt'
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<StoryblokProvider>
			<html lang="en" className="h-full antialiased" suppressHydrationWarning>
			<body className="flex h-full bg-zinc-50 dark:bg-black">
			<Providers>
				<div className="flex w-full">
					<Layout>
						{children}
					</Layout>
				</div>
			</Providers>
			<Analytics />
			<MatomoTracker />
			</body>
			</html>

		</StoryblokProvider>
	)
}
