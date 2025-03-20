import remarkGfm from 'remark-gfm'
import rehypePrism from '@mapbox/rehype-prism'
import nextMDX from '@next/mdx'


const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'a.storyblok.com',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'storyblok.imgix.net',
				port: '',
				pathname: '/**',
			},
		],
	},
	pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
	experimental: {
		outputFileTracingIncludes: {
			'/articles/*': ['./src/app/articles/**/*.mdx'],
		},
	},
}


const withMDX = nextMDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [rehypePrism],
	},
})

export default withMDX(nextConfig)
