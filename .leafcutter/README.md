# io.meimberg.www

## Purpose

This folder is the local colony of this repository. It is the place Leafcutter OS artifacts are installed
into, and the place the few artifacts that hold only in this repository are written, in `packages/`. Both
are compiled from here into the paths each agent tool reads in the repository above it, so that the agent
tools working there share one set of skills, agents and foundations. It is a workspace of its own: the repository's root manifest names nothing of it, and the
repository keeps whatever package manager it uses.

It is a living folder, and it holds the colony only. It never holds a package of STRICT: a repository with
a STRICT specification keeps STRICT's tooling in its own `.strict/` folder beside this one, or as a root
devDependency, and its `spec/` stays beside both. STRICT's collections of agents, skills and playbooks are
installed in `.strict/` too; the compile reads what is installed there as well and writes it into the
repository with the colony's own, and where one artifact is installed in both folders the one here wins.

Every command below runs in this folder; the compile writes into the repository one level up.

## Setup

```bash
read -s T && npm config set //packages.leafcutteros.ai/:_authToken="$T"   # the token issued in the customer area at leafcutteros.ai; once per machine
npm whoami --registry https://packages.leafcutteros.ai   # prints the account the registry accepts it for, never the token
pnpm install
pnpm compile
```

The first line reads the token without showing it, so it stays out of your shell history. Run it
in your own terminal, not through an agent's command input, which gives it nothing to read.

Add an artifact or a collection with `pnpm add -w -D @leafcutter-library/<package>`, then run `pnpm compile`
again. `pnpm doctor` reports what an installed adapter still needs; it installs nothing.

## Artifacts of its own

An artifact that holds only in this repository, such as an adapter for a service only it uses, is written
here as a workspace package in `packages/<family>/<name>/`, with the authoring skill of its type, named
under the scope of the colony and never published; [packages/README.md](packages/README.md) shows the layout.
Then:

```bash
pnpm install
pnpm check
pnpm compile
```

`pnpm check` runs the governance checks over the artifacts of its own; `pnpm compile` writes them into the
repository with the installed ones. An artifact that holds in other repositories as well belongs in the colony.

## Where things are

| Path | What it holds |
| --- | --- |
| `package.json` | the artifacts installed here, the check, and the commands that compile and diagnose them |
| `.leafcutter-os.json` | the declaration: this is a local colony, and the scope of its colony |
| `.gitignore` | the installed packages and `cache/`, which are never committed |
| `.npmrc` | the scopes `@leafcutter-library`, `@leafcutter-os`, `@leafcutter-governance` pointed at the registry; the token is in your own npm configuration |
| `pnpm-workspace.yaml` | the artifacts of its own as workspace packages, and pnpm's release-age setting, with the reason in it |
| `packages/` | the artifacts of its own, one package per artifact under its family |
| `governance.config.mjs` | what `pnpm check` checks the artifacts of its own against |

The compiled files are generated from the packages here and are never edited by hand.

## Changing it

An agent starts at `AGENTS.md`, at the root of the repository; the check of this folder reads no link that
leaves it.
