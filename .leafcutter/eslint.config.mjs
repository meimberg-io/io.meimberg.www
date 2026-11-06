import { defineGovernanceConfig } from '@leafcutter-os/rules/eslint';

/**
 * The artifact rule set, composed by the engine from the governance packs installed here.
 *
 * Without this file `lint-artifacts` and `lint-links` stop in the underlying tool with
 * `Error: Could not find config file.` and a stack trace, which names neither the file nor the way out
 * (CORE-FUN-missing-governance-configuration). Nothing repository-specific belongs here: that is governance.config.mjs.
 */
export default [...(await defineGovernanceConfig())];
