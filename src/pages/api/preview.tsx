import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Einstiegspunkt des Storyblok Visual Editors. Prüft das Secret und leitet auf
 * die eigentliche Seite weiter, wobei die Query-Parameter erhalten bleiben —
 * darunter `secret`, an dem der App Router die Preview erkennt
 * (siehe src/lib/pageRenderer.tsx).
 *
 * Bewusst OHNE res.setPreviewData(): das ist die Preview-Mode-API des Pages
 * Routers, und niemand in dieser App liest deren Cookie. Der Aufruf brachte
 * also nichts und warf unter Next 15 sogar (`jsonwebtoken.sign is not a
 * function` aus der gebündelten Dev-Runtime).
 */
export default async function preview(req: NextApiRequest, res: NextApiResponse) {
	const { slug = "" } = req.query;

	if (req.query.secret !== process.env.NEXT_PUBLIC_STORYBLOK_EDITOR_SECRET) {
		return res.status(401).json({ message: 'Invalid token' });
	}

	const query = req.url?.split("?")[1] ?? '';

	res.redirect(query ? `/${slug}?${query}` : `/${slug}`);
}
