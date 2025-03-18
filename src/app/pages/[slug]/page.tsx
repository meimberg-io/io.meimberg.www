import { fetchStory } from "@/lib/storyblok";
import { ISbStoryData } from "@storyblok/react";
import StoryblokWrapper from "@/components/StoryblokWrapper";
import { use } from "react";

export default function StoryPage({ params }: { params: Promise<{ slug?: string }> }) {
	// ✅ `params` wird hier synchron entpackt
	const resolvedParams = use(params);
	const slug = resolvedParams?.slug ?? "home";

	console.log(`🔄 SSR: Fetching story for slug: ${slug}`);
	return <StoryPageContent slug={slug} />;
}

// ✅ Story-Loading bleibt async, aber nur in einer separaten Funktion
async function StoryPageContent({ slug }: { slug: string }) {
	const story: ISbStoryData<any> | null = await fetchStory(slug, slug !== "home");

	if (!story) {
		console.error("❌ Story not found on server:", slug);
		return <p>❌ Fehler: Story nicht gefunden.</p>;
	}

	return <StoryblokWrapper story={story} />;
}
