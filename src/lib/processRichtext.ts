import { BlockTypes } from "@storyblok/react/rsc";
import { richTextResolver } from "@storyblok/richtext";
import { unified } from "unified";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";

// **Server Action, um Code-Highlighting durchzuführen**
export async function processRichtext(blok: any) {
	console.log("Server: Processing Richtext", blok);

	const rawHtml = richTextResolver({
		resolvers: {
			[BlockTypes.CODE_BLOCK]: (node) => {
				const language = node.attrs?.class?.replace("language-", "") || "plaintext";
				const codeContent = node.content?.map((child) => child.text).join("\n") || "";

				return `<pre class="language-${language}"><code class="language-${language}">${codeContent}</code></pre>`;
			},
		},
	}).render(blok.content);

	const highlightedHtml = await unified()
		.use(rehypeParse, { fragment: true })
		.use(rehypePrettyCode, {
			theme: "one-dark-pro",
			keepBackground: false,
		})
		.use(rehypeStringify)
		.process(rawHtml);

	return highlightedHtml.toString();
}
