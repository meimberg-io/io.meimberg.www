import Page from '@/components/pagetypes/Page'
import FallbackComponent from '@/components/FallbackComponent.tsx'
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc'
import Blog from '@/components/pagetypes/Blog.tsx'
import Linklist from '@/components/elements/Linklist.tsx'
import Grid2Column from '@/components/layout/Grid2Column.tsx'
import Picture from '@/components/elements/Picture.tsx'
import dynamic from 'next/dynamic'
import Divider from '@/components/elements/Divider.tsx'
import Photos from '@/components/elements/Photos.tsx'
import Blogteaserlist from '@/components/elements/blogteaserlist/Blogteaserlist.tsx'
import Articleteaserlist from '@/components/elements/blogteaserlist/Articleteaserlist.tsx'
import Stuff from '@/components/pagetypes/Stuff.tsx'
import Stuffteaserlist from '@/components/elements/stuffteaser/Stuffteaserlist.tsx'
import Hyperlink from '@/components/elements/Hyperlink.tsx'
import Pagetitle from '@/components/elements/Pagetitle.tsx'
import Grouping from '@/components/elements/Grouping.tsx'
import Tool from '@/components/elements/Tool.tsx'
import Soundcloud from '@/components/elements/Soundcloud.tsx'
import Newsfeedlist from '@/components/elements/NewsfeedlistBlock.tsx'
import NewsletterBlock from '@/components/elements/NewsletterBlock.tsx'
export {
	COMPONENTTYPE_ARTICLE,
	COMPONENTTYPE_BLOG,
	COMPONENTTYPE_PAGE,
	COMPONENTTYPE_STUFF,
	STORYBLOK_FOLDER_ARTICLES,
	STORYBLOK_FOLDER_BLOG,
	RESOLVE_RELATIONS,
	RESOLVE_RELATIONS_NAV
} from '@/lib/storyblokShared'

const Richtext = dynamic(() => import('@/components/elements/Richtext.tsx'))
const Gallery = dynamic(() => import('@/components/elements/Gallery.tsx'))
const Youtube = dynamic(() => import('@/components/elements/Youtube.tsx'))
const Video = dynamic(() => import('@/components/elements/Video.tsx'))
const LuxarisePictureSlideshow = dynamic(
	() => import('@/components/elements/LuxarisePictureSlideshow.tsx')
)


export const getStoryblokApi = storyblokInit({
	accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
	use: [apiPlugin],
	bridge: true,
	enableFallbackComponent: true,
	customFallbackComponent: FallbackComponent,
	apiOptions: {
		region: 'eu',
		cache: {
			type: 'none'
		}
	},
	components: {
		page: Page,
		article: Blog,
		blog: Blog,
		stuff: Stuff,
		linklist: Linklist,
		picture: Picture,
		richtext: Richtext,
		divider: Divider,
		hyperlink: Hyperlink,
		grouping: Grouping,
		pagetitle: Pagetitle,
		gallery: Gallery,
		tool: Tool,
		photos: Photos,
		video: Video,
		soundcloud: Soundcloud,
		youtube: Youtube,
		blogteaserlist: Blogteaserlist,
		articleteaserlist: Articleteaserlist,
		newsfeedlist: Newsfeedlist,
		newsletter: NewsletterBlock,
		stuffteaserlist: Stuffteaserlist,
		grid_2column: Grid2Column,
		luxarise_picture_slideshow: LuxarisePictureSlideshow
	}
})
