# Agents

## Purpose

This file is the entry point for an agent working in this repository, which has a local colony: Leafcutter
OS artifacts are installed in its `.leafcutter/` folder and compiled into the paths each agent tool reads
here, together with the artifacts of this repository's own in `.leafcutter/packages/`. What is compiled
must not be edited, and one command regenerates it.

## Read first

- [.leafcutter/README.md](.leafcutter/README.md) — what the local colony is and how it is set up.

## Compile after every change to the colony

Run in `.leafcutter/`; the compile writes into this repository:

```bash
cd .leafcutter
pnpm install
pnpm check
pnpm compile
```

## Artifacts of this repository's own

An artifact that holds only in this repository — a foundation, a skill, an adapter, a data pool — is written as
a package in `.leafcutter/packages/<family>/<name>/` with the authoring skill of its type, named under the
scope of the colony; [.leafcutter/packages/README.md](.leafcutter/packages/README.md) shows the layout.
`pnpm check` in `.leafcutter/` checks it, and must pass before the change is done; `pnpm compile` then
writes it into this repository. An artifact that holds in other repositories as well belongs in the colony.

## What not to do

- Do not edit a compiled file; add or remove a package in `.leafcutter/` and run `pnpm compile` again.
- Do not add a Leafcutter package to the root `package.json` — the colony lives in `.leafcutter/`.
- Do not add a `@leafcutter-strict/*` package to `.leafcutter/` — STRICT's tooling and its collections live in `.strict/`, which the compile reads as well; `leafcutter-os-doctor` reports one here as an error.
- Say what you could not do, in the words the command used.
