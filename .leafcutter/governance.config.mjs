import { defineConfig } from '@leafcutter-os/rules/config';

/**
 * What the governance engine checks in this local colony: the artifacts of its own in packages/, one package per
 * artifact under its family. The installed artifacts are checked where they are released, not here.
 *
 * The AGENTS.md of this colony lies at the repository root, one level up, and nothing here is published, so the
 * folder needs no CONTRIBUTING.md, no AGENTS.md of its own, no workflow and no changesets.
 */
export default defineConfig({
  // The scope the packages of your own carry: the one of the colony this folder installs.
  scope: '@meimberg-io',
  repository: { kind: 'tenant', packageRoot: 'packages' },
  conventions: { contributing: { root: false }, agents: { root: 'off' } },

  // The caches are transient and never committed.
  ignores: ['cache/**'],

  // Paths that must exist for this local colony to be considered intact.
  structure: ['package.json', 'pnpm-workspace.yaml', 'LICENSE.md', 'packages/README.md'],

  // Folders whose INDEX.yaml lists every artifact with its frontmatter.
  indexes: [],

  artifacts: { roles: 'packages/roles', agents: 'packages/agents' },

  // No role bindings yet. Write a topology.yaml and name it here when this local colony binds roles to agents.
  topology: null,

  workflows: null,
  changesets: null,
});
