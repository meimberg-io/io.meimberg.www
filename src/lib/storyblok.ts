import Page from '@/components/storyblok/Page'
import Teaser from '@/components/storyblok/Teaser'
import Grid from '@/components/storyblok/Grid'
import Feature from '@/components/storyblok/Feature'
import FallbackComponent from '@/components/storyblok/FallbackComponent'
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc'
import Article from '@/components/storyblok/Article.tsx'

export const getStoryblokApi = storyblokInit({
	accessToken: 'cDI6mUwrC5dKWFsPWD6s8Att',
	use: [apiPlugin],
	components: {
		teaser: Teaser,
		page: Page,
		grid: Grid,
		feature: Feature,
		article: Article,
	},
	apiOptions: {
		region: 'eu',
		cache: {
			type: 'none',
		},
	},

	enableFallbackComponent: true,
	customFallbackComponent: FallbackComponent,
})
