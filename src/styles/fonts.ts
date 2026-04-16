/* ============================================================================
 * Font loading (Next.js build-time concern)
 *
 * This is the SINGLE place where font files are configured. next/font
 * handles self-hosting, preloading, subsetting, and font-metrics fallback.
 *
 * Change the HEADLINE font here (e.g. DM_Sans -> Inter -> Manrope).
 * The loaded font is exposed as a raw CSS variable (--_headline-raw),
 * which is wired into the design system as --font-headline in
 * src/styles/tailwind.css (@theme). Do not reference --_headline-raw
 * directly in components; use the design token (utility: font-headline,
 * or var(--font-headline) in custom CSS).
 * ============================================================================ */

import localFont from 'next/font/local'

export const headlineFont = localFont({
	src: [
		{
			path: '../../node_modules/@fontsource-variable/zalando-sans-semiexpanded/files/zalando-sans-semiexpanded-latin-wght-normal.woff2',
			style: 'normal',
			weight: '200 900'
		},
		{
			path: '../../node_modules/@fontsource-variable/zalando-sans-semiexpanded/files/zalando-sans-semiexpanded-latin-wght-italic.woff2',
			style: 'italic',
			weight: '200 900'
		}
	],
	variable: '--_headline-raw',
	display: 'swap'
})
