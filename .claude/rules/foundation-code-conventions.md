# Code conventions

This foundation sets two conventions every piece of code obeys, in every repository and stack: code is written in English, and a comment states only what holds. It guards against code bases in mixed languages and against comments that pile up history until they hide what really matters. The other conventions every code change must hold live in `coding-rules`.

## Code is written in English

### What counts as code

- Everything a developer reads in the code is English: identifiers, comments, log and error messages, test names and test descriptions, story names, configuration keys and the output of scripts. In infrastructure code the same holds for task names and the messages a task prints, such as the names and `msg:` lines of Ansible tasks.
- Text addressed to people outside the code stays in their language: the text of a user interface, content, and the labels of an editing interface that an editorial team reads, such as the titles and descriptions of fields in a content schema. The conversation with the user follows the user. Commit messages and documentation follow the language of the repository's own history.

### Changing existing code

- A new file is written in English from its first line, also in a repository that still holds code in another language.
- When the agent changes a file in another language, it translates what the change touches anyway. It does not rename across the whole repository along the way; such a rename is a piece of work of its own, proposed to the user.
- A name that is a contract with the outside, such as a database column, an API field or a stored key, keeps its language until a migration changes it deliberately; `coding-rules` holds the rule against renaming external identifiers in passing.

### Why

A code base in mixed languages makes every reader switch with every line, and a non-English name in an exported type carries the mix into every repository that depends on it. English is the language every developer and every tool shares.

## Comments state what holds

### What a comment carries

- A comment states something lasting that the code cannot show by itself: an invariant, a constraint that is not obvious, a trap that breaks something elsewhere when the line is changed. Its reason may stand beside it when the reason holds as long as the code does. Code that explains itself needs no comment.
- A comment never derives a decision the code already shows, never defends the code against questions the author expects, never says that it used to be different, and never carries the date of an incident.

### Where history goes

When a comment exists only because something was changed, it belongs in the commit message. The history of a file lives in version control, next to the change it explains, not in the file.

### The test

Before writing a comment, the agent asks whether someone who opens the file for the first time would be worse off without this line. If not, the line is not written, and an existing line of that kind is removed when the code around it is changed anyway.

### Scope

The principle holds for application code, configuration, infrastructure code such as Ansible roles, scripts and tests. Documents under `docs/` are not comments and follow their own conventions.
