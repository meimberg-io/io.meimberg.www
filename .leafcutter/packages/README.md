# Packages

## Purpose

The artifacts of this local colony's own lie here, one package per artifact under the family its type
belongs to: a foundation, a skill, an adapter or a data pool that holds only in this repository. They are
workspace packages, never published, checked by `pnpm check` and compiled by `pnpm compile` together with
the installed ones. An artifact that holds in other repositories as well belongs in the colony instead.

```text
packages/<family>/
├── README.md            what belongs in this family here
└── <name>/
    ├── package.json     named under the scope of the colony, private, with its keywords and repository
    └── <name>.<type>.md
```

The families are those of Leafcutter OS: `adapters`, `agents`, `datapools`, `foundations`, `methods`, `playbooks`, `roles`, `skills`, `targets`. A family folder gets its
README when its first artifact is written; the check asks for one in every folder.
