## Development

### Storyblok: Pull components and generate types

Use the shell script to pull components from Storyblok and regenerate local TypeScript typedefs.

Prerequisites:
- Node.js
- No global install required; script uses `npx`
- Logged in: `npx storyblok login`

Script location: `scripts/pull-components.sh`

Usage:

```bash
# default space (328928)
scripts/pull-components.sh
```

Outputs:
- Components JSON: `components.328928.json`
- Types: `src/types/component-types-sb.d.ts`


