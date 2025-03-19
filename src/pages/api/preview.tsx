import { NextApiRequest, NextApiResponse } from 'next';

export default async function preview(req: NextApiRequest, res: NextApiResponse) {
	const { slug = "" } = req.query;

	const params = req.url?.split("?");

	if (req.query.secret !== "WUTZ") {
		return res.status(401).json({ message: "Invalid token" });
	}

	// Enable Preview Mode by setting the cookies
	res.setPreviewData({});

	// Set cookie to None, so it can be read in the Storyblok iframe
	const cookies = res.getHeader("Set-Cookie") as string[];
	res.setHeader(
		"Set-Cookie",
		cookies.map((cookie) =>
			cookie.replace("SameSite=Lax", "SameSite=None;Secure")
		)
	);

	// Redirect to the path from entry
	res.redirect(`/${slug}?${params ? params[1] : ''}`);
}
