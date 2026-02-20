import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	output: 'standalone',
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
				hostname: 'meimberg.io',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'a.pagetypes.com',
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
			hostname: 'pagetypes.imgix.net',
			port: '',
			pathname: '/**',
		},
		{
			protocol: 'https',
			hostname: '*.meimberg.io',
			port: '',
			pathname: '/**',
		},
		{
			protocol: 'https',
			hostname: 'cdn.brandfetch.io',
			port: '',
			pathname: '/**',
		},
	],

	},
}

export default nextConfig
