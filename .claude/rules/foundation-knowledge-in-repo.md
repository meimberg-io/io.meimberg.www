# Knowledge in the repository

This foundation sets where lasting knowledge lives: project knowledge committed in the project's repository, rules the user wants to last captured as versioned artifacts, and a repository's documents kept under `docs/` in a form every reader can navigate. It guards against knowledge that vanishes with a change of session, surface or machine, against traces of AI use in repositories a customer sees, and against roots full of scattered notes.

## Project memory belongs in the repository

### Committed, not remembered privately

- A fact bound to a repository is committed into that repository: ongoing work, goals, constraints, conventions, pointers and decisions, as well as knowledge and context such as architecture, setup and operations. It does not go into the agent's automatic memory (`~/.claude/projects/<repo>/memory/`), which exists per user and per machine and is invisible to the team.
- A rule that holds only in this project becomes a foundation of the project; knowledge goes into a file under `docs/`; a skill, agent or playbook of its own goes into the project's `packages/`. For that the project is set up as a Leafcutter colony, as the content hub and the publication projects are, and `pnpm compile` writes its foundations and artifacts into every client the project names.
- Nobody writes a client's instruction file, or the rules, skills and agents in a client's folder, by hand (`CLAUDE.md`, `.claude/rules/`, `.github/instructions/`, …); only the compile writes those. The project's `AGENTS.md` is its entry point for every client that reads one, not a place for rules.
- A configuration the colony's artifacts read from a project, such as its ticket system or its worktree manifest, lies in `.leafcutter/` at the project root and is committed; it belongs to no client, so it works whichever agent runs. What is a client's own, its settings and hooks, stays in that client's folder and is written only when the user asks for it.
- The automatic memory store is gone when the session, the surface or the machine changes. For knowledge about a project it does not scale; only the repository carries it to everyone who works on it.

### The hard exception for customer-visible repositories

- In customer-visible or otherwise protected repositories, even an `AGENTS.md`, a client's instruction file, a client folder such as `.claude/` or `.leafcutter/` reveals the use of AI permanently. Such knowledge is never committed there. It goes into the internal context repository instead, the hidden sister repository set up and described by `customer-hidden-context`. If that does not exist yet, it is set up first. When in doubt, the agent asks rather than committing into the customer's repository.
- The internal context repository is itself a repository, so versioning and visibility for the team are preserved. A committed line in the customer's repository, by contrast, is practically impossible to erase.

### What this does not cover

Rules that apply across projects are captured as colony artifacts, as the next section sets. Facts that are personal to the user stay in the user's memory. Secrets never go into any repository, the internal one included; they lie where `forbidden-commands-and-secrets` sets.

## Capturing rules for good

### Recognising the request

- When the user says that something should apply in future, taking it into account for the current session is not enough. Typical phrasings are "remember this", "from now on …", "add this to your rules", "always do it this way in future", "I want you to … from now on", "this should apply generally" and "pay attention to … from now on".
- This is only the awareness that such a request calls for a lasting rule. The way there, from scope and artifact type to checking, committing without pushing and confirming back to the user, is the business of the `tenant-intake` playbook.

### Where the rule goes

- A rule meant to apply across projects becomes an artifact of this colony under `packages/`, brought in through the `tenant-intake` playbook. The colony's check gate validates it, and settling delivers the new state to every client.
- `tenant-intake` runs only in the colony repository. In a session anywhere else, the agent does not write the artifact itself but hands the finding over with the `colony-handoff` skill: a self-contained prompt for a session in the colony repository, where `tenant-intake` decides.
- A rule that applies only in one repository becomes a foundation of that repository, not of the colony, through the same playbook run in that repository; a repository without its own foundations is set up as a colony for it first. When it is unclear whether the user means a general or a project-specific rule, the agent asks briefly.
- A lasting rule is never written into the private user memory, into a client's own configuration such as `~/.claude/`, or into an instruction file by hand. What lives there is invisible to everyone else and does not travel with the colony.

### Why

- Version control: every rule gets a commit with its reason, so it can be discussed, refactored and deprecated.
- Shared with everyone: a rule in the colony reaches every client that settles from it, with no manual copying.
- Protection against drift: behavioural rules that exist only as conversation memory disappear at the next session or when switching between surfaces, such as from the desktop app to the command line. In the colony the rule lives in one place and takes effect everywhere.
- Auditable: the curated set of artifacts is a lasting asset, and rules are part of it. They belong under version control, not remembered ad hoc.

### Boundaries

- A request for hard automation, such as "run X before every commit" or "notify me when you stop", is not a behavioural rule but calls for a hook in the client's configuration; a project-local hook goes into that project's own settings.
- When the request concerns how one particular skill behaves, such as "the `git-workflow` skill should do X differently", the change belongs in that skill's artifact, not in a general foundation.

## Documents under docs

### The root stays lean

- The root of a repository holds only the files that tools or platforms look for at the root: the `README.md`, the entry file `AGENTS.md` and what a compile writes there for a client, `CONTRIBUTING.md`, the licence and the `CHANGELOG.md`, plus configuration files. Everything else written for people to read is a document and belongs under `docs/`.
- A root full of notes buries the files that explain how to start. A document in the root is also read as more important than it is, and the next note lands beside it until nobody can tell setup from scratch work.

### How docs is organised

- `docs/README.md` lists what the folder holds, each entry with one line saying what it is for, and where it helps, the order in which to read. Whoever adds a document adds its line to the index in the same change.
- A group of related documents gets its own subfolder, such as `product/`, `requirements/`, `frontend/` or `techstack/`. Single operational documents such as a deployment guide, a GitHub setup or an incident report sit directly in `docs/`.
- Code, configuration, generated output and the artifacts of an agent OS are not documents and keep their own places. A document under `docs/` describes; it is not read by a tool.

### Living documents and records

- A document is either living or a record. A living document describes the current state, is maintained along with every change it describes, and may be cited as the current state at any time. A record documents what held at one moment, such as a decision paper, an analysis, a report, minutes, an order or an invoice, and may be cited only with its date and the caveat that the statement held at that time.
- Every Markdown document says which kind it is in its frontmatter, `validity: living` or `validity: record`. A record also carries the prefix `YYYY-MM-DD_` in its file name, or, when it consists of several files, in the name of its folder; the date stands only there and not again in the frontmatter. Where a repository splits `docs/` into areas by kind, such as one for living documentation and one for decisions, the area decides the kind and the stamp agrees with it; files that cannot carry frontmatter, such as spreadsheets or exports, are classified by their area alone.
- When documents contradict each other, the living document wins over the record, and in the last instance the code wins over both. A record never proves the current state, however precise it sounds.
- A record is not rewritten to bring it up to date; what changed goes into the living document. A record that has lost its relevance is archived unchanged, where the repository keeps its archive, rather than deleted or edited.

### Every folder explains itself

- Every folder of a repository carries a `README.md` that says why the folder exists and what it holds, and where it helps, how to read or change what is in it. `docs/README.md` is the index this applies to at the entrance of `docs/`; the same holds for its subfolders and for the folders of the code. Folders written by tools, such as installed dependencies and build output, are exempt.
- A change that creates, removes, moves or substantially changes the content of a folder checks the affected READMEs and updates them in the same change: purpose, contents and usage notes, with stale references removed. A new folder gets its README in the change that creates it. A README update is part of the change, never a later follow-up.

### When it does not apply

- A repository whose own instructions place documents elsewhere, or a framework that requires a document at a fixed path, keeps that place.
- In a repository a customer sees, internal notes about the work do not go into its `docs/` at all; they belong in the hidden internal context, as the first section sets.
