---
topic: set-up-local-colony
choice: set-up-local-colony-0.4.3
recorded: 2026-11-23T20:00:00Z
---

# The local colony is recorded against set-up-local-colony 0.4.3

- **What:** `@leafcutter-os/playbook-set-up-local-colony` 0.4.3 ran over the existing local colony during its upgrade
  to the current releases of its colonies. Every earlier choice was kept: the colony of @meimberg-io, the collections
  `@leafcutter-os/collection-setup-local`, `@meimberg-io/collection-development`, `@meimberg-io/collection-meimberg-all`, the clients and the platform the declaration names, and `.leafcutter/` committed in the repository. The
  setup command `leafcutter-os-setup --kind local --base` with the root colony of @meimberg-io ran, then the compile and
  the check, both green.
- **When:** 2026-11-23
- **Who decided:** Oli
- **Why:** No record noted a run of the setup playbook, so the upgrade playbook proposed one; Oli asked for it for the
  local colonies too, run autonomously with the choices the colony already carries.
- **Not taken:** a new choice of chapter, collections or stack skills. Nothing was asked for, and the upgrade keeps
  the colony's set.
