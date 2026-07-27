import { NextApiRequest, NextApiResponse } from 'next';

/**
 * Verlässt die Preview, indem ohne `secret` zurückgeleitet wird — daran und nur
 * daran erkennt der App Router den veröffentlichten Stand.
 *
 * Bewusst OHNE res.clearPreviewData(): siehe die Begründung in preview.tsx.
 * Es gibt keinen Preview-Cookie, der zu löschen wäre.
 */
export default async function exit(req: NextApiRequest, res: NextApiResponse) {
  const { slug = "" } = req.query;

  res.redirect(`/${slug}`);
}
