import { NextResponse } from 'next/server'
import { fetchAllStories } from '@/lib/storyblok.ts'
import { ISbStoryData } from '@storyblok/react'


const generateSitemap = (pages: { data: { stories: ISbStoryData[] } }) => {
    const baseUrl = "https://meimberg.io/"; // Deine Domain

    const entry = (url: string, date: string) => {
        return `<url>
                    <loc>${baseUrl}${url}</loc>
                    <lastmod>${new Date(date).toISOString()}</lastmod>
                    <changefreq>weekly</changefreq>
                    <priority>0.8</priority>
                </url>`;
    }

    const urls = pages.data.stories.map(story => {
        return entry("" + story.full_slug, story.published_at ?? "");
    }).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                <url>
                  <loc>${baseUrl}</loc>
                  <changefreq>daily</changefreq>
                  <priority>1.0</priority>
                </url>
                ${urls}
          </urlset>`;
};

export async function GET() {
	const articles = await fetchAllStories()


    return new NextResponse(generateSitemap(articles), {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
        },
    })
}
