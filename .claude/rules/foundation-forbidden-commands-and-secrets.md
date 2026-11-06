# Forbidden commands and secrets

This foundation sets the commands an agent never runs, the files it never edits or commits, how it handles secrets and where they lie, and how it logs in by SSH to servers protected by fail2ban. It guards against irreversible damage to repositories, hosts and clusters, against secrets leaking into a repository, a log or a conversation, from where they cannot be taken back, and against locking the user out of a server through careless login attempts. Force pushes, other destructive git operations and pushing in general stay with the user as `git-conduct` sets; security conventions for code that talks to a database live in `coding-rules`, and the handling of a private package registry token in `build-and-ci`.

## Forbidden commands and secrets

### Commands that never run

- The agent never runs `git push --force` or any other force push, `rm -rf /`, `chmod 777`, `docker system prune -af`, `kubectl delete namespace`, or any flag that skips the hooks of a repository, such as `--no-verify`. When the user really wants one of them, the user runs it.
- Each of them destroys something that cannot be rebuilt from the agent's side: the remote history others have built on, a file system, the permissions of a whole tree, every image, volume and cache of a host, every resource of a namespace, or the protection a hook gives. None of them is needed to finish a task.
- The rule covers the intent, not one spelling of it. A recursive delete of a root or home directory, a world-writable mode on a tree, or a prune of all volumes in another form is the same command.

### Files that are never touched

- The agent never edits or commits environment files such as `.env` and `.env.local`, keys and certificates such as `*.pem` and `*.key`, anything under a `secrets/` folder, secret manifests such as `*-secret.yml`, kubeconfig files, and anything under `.ssh/`. It does not read their values into the conversation either. An example file that holds only placeholders and no values is a template, not a secret file.
- The agent does not edit installed dependencies such as `node_modules/` or the internals of `.git/`. Both are written by their tools, and a hand edit there is lost or corrupts the repository.

### Secrets

- API keys, secrets, passwords and tokens are never written in plain text into code, configuration, a commit, an issue, a log or a reply. Code and configuration reference them through environment variables or a secret store, and sensitive values in output are redacted. A token is never printed, echoed into a log or written into a file inside the repository.
- When a login needs a password or a passphrase, the human types it in their own terminal. The agent never handles it, never puts it on a command line, into a file or into a log, and never invents credentials to get past a login. It asks the user to run the login and waits.

## Where secrets lie

### Name, resolver, store

- An adapter, a script or a configuration names a secret, never holds it. A concrete adapter gives the name in its `token-variable`, and the compile writes it into the focus. The name carries its context as a suffix, following `<SERVICE>_<PURPOSE>_<CONTEXT>`, such as `GITHUB_TOKEN_MEIMBERG` or `SEVDESK_TOKEN_LEAFCUTTER`. There is no global account of a service: the context an agent works in names the secret, and so the account.
- A call reaches a secret through the resolver of the skill `secrets`: `secret.mjs run VAR=NAME -- <command>` starts the command with the value in `VAR`, and only when the value is there. A missing or ambiguous name stops the call; it never runs without the value, and never under a login a tool has stored for itself, such as the account of `gh auth login`, because that login belongs to no context.
- The resolver reads the environment variable of the name first, which is how a cloud session, a pipeline or a coding agent gets the secret, under the same name as on the machine. Otherwise it reads the one file `~/.config/colonies/secrets.<context>.conf` that holds the line `NAME=value`: `secrets.base.conf` for the base colony, `secrets.<chapter>.conf` for each chapter, the folder with mode `700` and each file `600`, on Windows under `%USERPROFILE%\.config\colonies`.
- The user writes the values, in their own terminal. An agent never opens a context file and never asks for a value in the conversation; it names the file and the line that is missing. Only a token the service replaces on every use, such as a refresh token, is written back by the script that uses it, through the resolver's `store`.

### Where it does not reach

- An adapter's MCP server reaches its token through the resolver too: its `headers-helper` runs the installed copy `~/.config/colonies/secret.mjs headers …` when the client connects. Only a server whose client runs no such helper reads its value from the client's own environment.
- A chat without a shell, such as the chat of claude.ai, has neither store nor resolver; a service reaches it only through a connector whose login the client holds.
- Credentials that are files, such as a service-account key, keep their place under `~/.config/<organisation>/`, and a registry token stays in `~/.npmrc`, because the tools read them only there.
- The store is this section's choice, not the adapters'. A tenant that keeps its secrets elsewhere, such as in a password manager with a vault per context, changes this section and the resolver behind the same `run VAR=NAME` contract; adapters and focus stay as they are.

## SSH login to protected servers

Servers such as the owner's hosts (for example `hc-02.meimberg.io`) typically run fail2ban on SSH: two to three failed attempts ban the session's IP address for at least ten minutes, during which no SSH operation on the host is possible and the running task breaks off. Without `IdentitiesOnly`, SSH tries every key in the user's SSH directory before falling back to a password, each a separate failed attempt in the server's log, so one connection can produce four or five failures without looking like it. The deploy user and key are always findable, and a second spent asking stands against ten minutes of lockout plus the user's intervention; guessing is never more efficient.

### The order of checks before connecting

1. First the configuration: the agent looks for a matching host entry in the user's SSH configuration. If there is one, it connects through that entry and nothing else.
1. Then a suitably named key: if there is no entry but a key lies in the SSH directory named after the host, the project's deploy key or simply the deploy key, the agent writes a host entry before the very first attempt, naming the host and a short alias, the user and the key file, and restricting the connection to that one key through `IdentitiesOnly`. Only then does it try a single harmless test connection.
1. Then the repository's documentation: if neither exists, the agent derives user, host and key from the README, the `docs/` folder, `AGENTS.md`, a deploy configuration, the Makefile or the CI workflows, which often name the deploy user at the host, and then proceeds as with a found key.
1. If the user or the key remains unclear after these checks, the agent asks instead of guessing.

### What never happens

- The agent never connects straight to a user and host without checking the configuration first, and never runs non-interactive batch mode (`BatchMode`) over the default keys.
- After a "permission denied", it does not carry on blindly with another user or another key; it goes back to the configuration, corrects its assumption and asks if needed.
- When the host is reachable on the network but port 22 answers "connection refused", the IP address is banned. The agent stops trying, reports it, and waits or asks for the ban to be lifted.

### The passphrase prompt

- A prompt for a key's passphrase means the decrypted key is missing from the SSH agent; in a non-interactive shell the answer can never come, and every further attempt counts towards the ban. The agent aborts at the first prompt and does not repeat the attempt by any other route, neither in batch mode nor through another command that reaches the same goal a different way. A second attempt brings no new information, only another count.
- It reports that the key at its path (taken from the prompt or from the key file in the host entry) is not loaded in the SSH agent, asks the user to load it once in a terminal with its passphrase and to check the VPN, both together because both are forgotten together, and to say when both are in place; it ends with the promise to carry on then.
- Then it waits: no polling and no substitute. When the user confirms, it first asks only the local SSH agent which keys it holds, which touches no server. If the key is still missing there, it reports that instead of connecting again; usually the user's terminal does not share its SSH agent with the agent's shell.

### No workaround without an explicit mandate

A missing precondition is established, not bypassed. Falling back to an outdated local state, skipping a check or looking for a second way to the same goal produces a result that looks complete and is not. This has happened: after three failed passphrase attempts, work was based on a two-day-old local state of the remote main branch, which hid that the actual step had not been possible at all.

### Scope

- It applies to every SSH connection to such hosts: servers, virtual machines, network storage and the like. A bastion or jump host (`ProxyJump`) goes into the same host entry, with the same logic.
- It does not apply to localhost, to hosts whose authentication obviously runs without fail2ban, such as ad-hoc lab machines without public exposure, or to executing into containers, which is not an SSH authentication path. When in doubt, the agent takes the safe path anyway.
