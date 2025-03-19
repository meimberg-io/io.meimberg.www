"use client";

import { StoryblokStory, useStoryblokBridge } from "@storyblok/react/rsc";
import { ISbStoryData } from "@storyblok/react";
import { useState } from "react";

export default function StoryblokWrapper({ story }: { story: ISbStoryData<any> }) {
	const [liveStory, setLiveStory] = useState(story);

	// ✅ Sicherstellen, dass `useStoryblokBridge` nur im Client läuft
	if (typeof window !== "undefined") {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useStoryblokBridge(story.id, (newStory) => {
			// console.log("🔄 Story updated in Editor:", newStory);
			setLiveStory(newStory);
		}, { resolveRelations: "linklist.links,sociallink.icon" });
	}

	return <StoryblokStory story={liveStory} />;
}
