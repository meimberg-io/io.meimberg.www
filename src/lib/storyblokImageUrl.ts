import type { StoryblokAsset } from '@/types/component-types-sb'

export type ProcessedStoryblokImage = {
  src: string
  unoptimized: boolean
}

function normalizeProtocol(url: string): string {
  const t = url.trim()
  if (t.startsWith('//')) return `https:${t}`
  return t
}

function isStoryblokHosted(url: string): boolean {
  try {
    const host = new URL(normalizeProtocol(url)).hostname
    return host === 'a.storyblok.com' || host === 'pagetypes.imgix.net'
  } catch {
    return false
  }
}

/**
 * Storyblok CDN image with optional focal; external assets use raw URL (Next/Image unoptimized).
 */
export function storyblokImageForCard(
  asset: StoryblokAsset | undefined,
  width: number,
  height: number,
  quality: number
): ProcessedStoryblokImage | null {
  if (!asset) return null
  const raw = (asset.filename ?? '').trim()
  if (!raw) return null

  if ('is_external_url' in asset && asset.is_external_url && !isStoryblokHosted(raw)) {
    return { src: normalizeProtocol(raw), unoptimized: true }
  }

  const base = normalizeProtocol(raw)
  const hasFocal = Boolean(asset.focus && String(asset.focus).length > 0)
  const src = hasFocal
    ? `${base}/m/${width}x${height}/filters:focal(${asset.focus}):quality(${quality}):format(webp)`
    : `${base}/m/${width}x${height}/smart/filters:quality(${quality}):format(webp)`
  return { src, unoptimized: false }
}
