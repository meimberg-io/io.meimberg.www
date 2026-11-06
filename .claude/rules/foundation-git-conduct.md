# Git conduct

This foundation sets how an agent handles version control: a finished task ends with a local, precisely staged commit on the branch that is checked out, the commit names its AI co-author, a branch whose pull request is merged is cleaned up, and everything else beyond the local commit stays with the user. It guards against finished work left uncommitted, commits that sweep up other sessions' changes, branch sprawl, merged branches left standing, hidden or vague AI attribution, and pushes the user did not ask for.

Pushes stay with the user unless a marker allows pushing: the agent never pushes unless the repository holds the marker file `.leafcutter/allow-agent-push`, and no marker ever permits a force push or any other destructive operation. The one exception without a marker is deleting a branch whose pull request is merged, as the section on merged branches sets.

## Commit when a task is complete

### The commit belongs to the delivery

- When a task is finished, meaning the changes are written and the repository's gate is green (lint and tests, as `delivery-conduct` sets), the local commit is part of the delivery, also for ad-hoc jobs without a ticket such as "have a look at X", "fix Y" or "tidy up Z".
- Unfinished work is not committed but reported as open: an open question, a refactoring chain left half-way, or deliberate work in progress.
- Editorial texts, such as drafts, manuscripts, posts and other prose written for readers, are never committed by the agent, even when finished; `@author` commits them. The agent leaves them in the working tree and names them in its report. The tools, scripts and configuration of such a repository are committed as usual.
- When a project's own rules say in effect that the user controls version control, that means pushing and destructive operations; the local commit still remains part of the delivery.
- A skill that carries its own commit logic, such as `git-workflow` or `implement`, takes precedence for the work it covers; resolving the ticket key for the message is the business of `git-workflow`.

### Push and destructive operations stay with the user

- The agent never pushes, not even for small things, because in many setups the deploy hangs on a push to the main branch. Force-pushes, tags, remote branches, merge or pull requests stay with the user, and so do destructive operations: hard resets, discarding working-tree changes, cleaning untracked files and force-deleting branches. The cleanup of a branch whose pull request is merged is the exception, local and remote, as the section on merged branches sets.
- The one exception is the push marker. A repository that holds `.leafcutter/allow-agent-push` lets the agent push its own commits, the tags of a release included. A repository carries it when a push there triggers no deploy, such as a library that consumers pull through a pinned tag, and when stopping before the push would break a release flow half-way.
- The marker is set by the user only; the agent never creates it. The old place `.claude/allow-agent-push` counts as well until the repository is migrated; the agent offers the move with `migrate-project` and never sets a marker there.
- When the client still refuses the push, for example because the session runs from another repository whose settings deny it, the agent leaves the push to the user instead of looking for another way.

### Staging precisely

- The agent stages precisely the files it changed and commits only those paths, never the whole index. Parallel sessions in the same working tree may already have staged files, and a commit without a path carries them along; this has happened more than once. Committing by path makes the commit immune to it.
- Changes the agent did not make are never discarded, stashed or reset. When it is unclear whom dirty files belong to, the agent shows the list and asks.

### A clean history before reporting done

- Committing after every step is right but leaves chains in which several commits carry the same thing. Before reporting done, the agent looks at the commits not yet pushed and combines those on the same topic into one. With more than two commits, or when it is unclear whether they belong together, it proposes the combination with the list instead of doing it unasked. What is already pushed stays untouched.
- The message follows the repository: with a ticket `<PREFIX>-<n> <title>`, a follow-up fix `<PREFIX>-<n>-followup <short>`, without a ticket a short subject line in German. In every case the pattern is taken from the repository's own history.
- A failing commit hook is never bypassed. The agent fixes the cause, stages again and makes a new commit rather than amending the previous one.

## No automatic branches

### Working on the current branch

- The agent never creates a branch by itself: not silently, not "to be safe", normally not even after asking, and never as a side effect of another step. It does not switch away from the user's branch unasked either; switching between existing branches is the user's business.
- Commits go onto the branch that is checked out, the main branch included. That is safe because only the user pushes. This takes precedence over any instruction to "branch first when on the default branch".
- Only when a separate branch really seems necessary, such as a risky rebuild the user would want to keep apart, does the agent ask and give its reason instead of creating it. The default remains no branch.

### Why

- A new branch per session or task, typical when a session starts on the main branch and a "branch first" default applies, produces a flood of short-lived branches nobody wants and the user has to clean up. The user steers branching.
- Since pushing stays manual, a commit on the current branch is local and reversible; an automatic branch adds no protection the missing push does not already give, only bookkeeping.
- After the work, the user knows that everything lies where they were, not on a surprisingly created feature branch.

### Boundaries

- Worktrees and isolated agent runs the user explicitly requests are not automatic branches; the principle forbids branching on the agent's own initiative, not an isolated setup the user wants.
- A project with a different convention, such as "never commit on main here, always on branch X", wins through its own rules, a foundation of the project.

## Cleaning up merged branches

### A merged branch goes

- A branch whose pull request is merged is not needed any more, and the agent cleans it up: the local branch, the branch on the remote and a worktree that has it checked out. It applies to every branch whose pull request is merged, whoever created it.
- Merged is read from the pull request, `gh pr view <branch> --json state,headRefOid`, with the context's token as `secrets` sets. `git branch --merged` does not show it: a squash merge leaves the branch's commits outside the main branch, so the branch looks open although its content is in.
- A pull request closed without a merge is no reason to delete. The agent names the branch and asks.

### What is checked first

- Only what the merge contains is deleted. The local branch goes only when its tip is the merged head or an ancestor of it (`git merge-base --is-ancestor <branch> <headRefOid>`), the remote branch only when it still points at that head (`git ls-remote origin refs/heads/<branch>`). A branch with commits beyond the merged head is named and kept.
- The default branch is never deleted, nor a branch checked out in a worktree with uncommitted changes, nor the worktree the session runs in. A merged branch the user has checked out in the main worktree is named, not deleted; the agent does not switch away from it.

### The order

1. A clean worktree that has the branch checked out is removed with `git worktree remove <path>`, without `--force`.
1. The local branch is deleted with `git branch -D <branch>`. After a squash merge `git branch -d` refuses although nothing is lost; the check above is what makes `-D` safe.
1. The remote branch is deleted with `git push origin --delete <branch>`, unless GitHub has already removed it because the repository deletes head branches on merge. When the client refuses the push, the agent leaves the remote branch to the user with its name, as for any push.

### When it runs

- Right after a merge the agent carries out at the user's word, as the last step of that merge.
- Whenever the agent works with a repository's branches or worktrees anyway, such as in a worktree cleanup audit, when it pushes a branch for a pull request, or when the user returns to the main branch. Merged leftovers it finds there are cleaned up the same way and named in the report.
- Not as a scan at the start of every session.

### Why

A branch left standing after its merge leaves nobody able to tell later whether it is still open, and with squash merges git itself cannot tell either; only the pull request knows. The merge is the branch's final action, so the cleanup belongs to it. Deleting a merged branch loses nothing the main branch does not hold, which is why it is the one deletion and the one push that do not wait for the user.

## AI attribution in commits

### The trailer

- Every commit made with an AI agent ends with a `Co-Authored-By:` trailer that names the concrete model the agent ran as, with its version, for example `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. A family name alone, a product name or a vague "AI" is not enough; the trailer names the model that actually produced the change in that session.
- The trailer stands in the trailer block at the end of the message, after a blank line, one line per co-author. It does not change the subject line.
- Real human co-authors are named as before, each in a trailer of their own, next to the model's.
- A commit the user makes by hand, without an agent producing the change, carries no AI trailer.

### Why

That a change came about agentically is part of the work and is not hidden. A concrete model name keeps the history useful: it shows which model produced which change, which matters when results are compared or a change has to be judged later.

### When a repository says otherwise

- A repository with an explicit rule of its own on attribution, written in its contributing guide or agent instructions or enforced by a commit hook, keeps that rule. A hook that rejects the trailer is not bypassed; the agent follows the repository's rule and names the difference to the user.
- In a customer-visible or otherwise protected repository, no trace of AI use is committed, as `knowledge-in-repo` sets out; there the trailer is left out unless the repository's own rule asks for it.
