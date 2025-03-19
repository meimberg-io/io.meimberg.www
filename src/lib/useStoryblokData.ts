import { useState, useEffect } from "react";
import { fetchStory, RESOLVE_RELATIONS } from "@/lib/storyblok";
import { useStoryblokBridge, ISbStoryData } from "@storyblok/react/rsc";

export function useStoryblokData(params: { slug: string } | null, isPage: boolean = false) {
	const [story, setStory] = useState<ISbStoryData<any> | null>(null);

	useEffect(() => {
		if (!params || !params.slug) {
			console.warn("⚠️ useStoryblokData: params.slug ist nicht verfügbar!");
			return;
		}

		console.log(`🔍 Loading Story: ${params.slug}, isPage: ${isPage}`);
		fetchStory(params.slug, isPage).then((story) => {
			if (!story) {
				console.error(`⚠️ No story found for slug: ${params.slug}`);
			}
			setStory(story);
		});
	}, [params?.slug]); // ✅ Sicherstellen, dass `params` existiert, bevor `.slug` genutzt wird

	useStoryblokBridge(story?.id ?? 0, (newStory: ISbStoryData<any>) => setStory(newStory), {
		resolveRelations: RESOLVE_RELATIONS,
	});

	return story;
}
