#!/usr/bin/env bash
set -euo pipefail

SPACE_ID=330326
GENERATED=".storyblok/types/${SPACE_ID}/storyblok-components.d.ts"
TARGET="src/types/component-types-sb.d.ts"

# 1. Generate types from Storyblok
npx storyblok types --space "$SPACE_ID" generate

# `sed -i` ohne Suffix ist GNU-Syntax und scheitert auf macOS (BSD sed).
# Über eine temporäre Datei zu gehen funktioniert auf beiden.
sed_inplace() {
  sed "$1" "$2" > "$2.tmp" && mv "$2.tmp" "$2"
}

# 2. Fix index signature: [k: string]: unknown → [k: string]: SbBlokKeyDataTypes
sed_inplace 's/\[k: string\]: unknown/[k: string]: SbBlokKeyDataTypes/g' "$GENERATED"

# 3. Add SbBlokKeyDataTypes to import
sed_inplace "s/import type { ISbStoryData } from '@storyblok\/js'/import type { ISbStoryData, SbBlokKeyDataTypes } from '@storyblok\/js'/" "$GENERATED"

# 4. Generate type aliases from all exported interfaces
{
  echo ""
  echo "// Type aliases with \"Storyblok\" suffix for compatibility"
  grep '^export interface ' "$GENERATED" | sed 's/export interface \([^ ]*\) .*/export type \1Storyblok = \1/'
  echo ""
  echo "// Storyblok base types"
  echo "export type AssetStoryblok = StoryblokAsset"
  echo "export type MultiassetStoryblok = StoryblokMultiasset"
  echo ""
  echo "// Re-export Storyblok types for convenience"
  echo "export type { StoryblokAsset, StoryblokMultiasset, StoryblokRichtext, StoryblokMultilink }"
} >> "$GENERATED"

# 5. Copy to target
cp "$GENERATED" "$TARGET"

echo "✓ Types generated and post-processed → $TARGET"
