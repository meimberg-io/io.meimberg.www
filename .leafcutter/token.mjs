/**
 * The token line: the registry's read token, read by Node without echo and written into npm's own configuration, the
 * same line on every host (C5 of SRC-2026-1106-cross-examination-windows-host, CORE-FUN-script-fetched-public-url-first
 * 0.5.0). It replaces `read -s T && npm config set …`, which only bash and zsh read.
 *
 * The line runs where nothing of the product is installed — a fresh clone, a machine before its first setup, a setup
 * whose registry refused it — so it cannot start a command of the CLI. It has two forms, the same on every host:
 *
 * - **Where a repository exists**, the setup copies this file, byte for byte, into it as `.leafcutter/token.mjs` (in a
 *   local colony that is its own folder), and `--update` renews the copy. The line is `node .leafcutter/token.mjs
 *   <host>`, short enough to paste, and the copy runs with nothing installed: it imports Node's built-in modules only.
 * - **Where no repository exists yet** — the collection question `npm create` puts in an empty folder — the line is
 *   `node -e` with the function below as its text, and the host as its one argument. That text has to reach Node
 *   unchanged through every shell a person types it into: inside double quotes, bash and zsh read `$`, the backquote
 *   and `!`, PowerShell `$` and the backquote, cmd.exe `%`, and a double quote ends the argument in all of them. So the
 *   function holds none of those characters and no line comment, and a test holds it to that; its comments stand here,
 *   above it.
 *
 * What it does, in order:
 *
 * - Without a host it reads nothing, writes nothing, names the missing host and exits 2, rather than writing a line for
 *   the host `undefined`.
 * - Where its input is no terminal — a line run through an agent's command input — it reads nothing, writes nothing
 *   and says that the line is run in the person's own terminal (CORE-FUN-script-fetched-public-url-first).
 * - It reads the token in raw mode, so nothing typed is echoed; Backspace takes the last character back, Ctrl-C stops
 *   without writing, and Enter ends the token. Raw mode works in the terminals of macOS, Linux, WSL and Windows alike.
 *   An escape sequence a key sends, an arrow or another key that moves the cursor, is skipped whole, also when it arrives
 *   in two chunks: after the escape character, `[` opens a control sequence that ends at its final character, `@` to
 *   `~`, and `O` takes one character more; any other character after it is read as typed.
 * - It asks npm which file is its user configuration (`npm config get userconfig`, the file `npm config set` writes),
 *   and writes the line `//<host>/:_authToken=<token>` there itself, replacing one for the same host, with the mode
 *   600 where it creates the file. npm is asked through the host's shell with a command line that holds no token: the
 *   token never stands on a command line, neither the person's nor a child process's, and on Windows it never passes
 *   through cmd.exe. A line written by hand is the line npm writes; this repeats nothing npm decides.
 * - It prints the host and the file it wrote, never the token.
 *
 * The function reads the host only through the process it is given, so a test gives it a stand-in; the text is a
 * generated string for Node to run, not a reading of the host by the CLI (CORE-CON-commands-tooling-run-node-macos).
 *
 * @typedef {object} TokenInput
 * @property {boolean} [isTTY]
 * @property {(raw: boolean) => unknown} setRawMode
 * @property {(encoding: 'utf8') => unknown} setEncoding
 * @property {(event: 'data', listener: (chunk: string) => void) => unknown} on
 * @property {() => unknown} resume
 * @property {() => unknown} pause
 *
 * @typedef {object} TokenProcess
 * @property {string[]} argv
 * @property {TokenInput} stdin
 * @property {{ write: (text: string) => unknown }} stderr
 * @property {number | string | null | undefined} [exitCode]
 */

import { realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

/**
 * @param {TokenProcess} proc
 * @param {(name: string) => any} load
 */
export function readToken(proc, load) {
  const host = proc.argv[1];
  const input = proc.stdin;
  const say = (/** @type {string} */ text) => proc.stderr.write(text + '\n');
  const write = (/** @type {string} */ token) => {
    const key = '//' + host + '/:_authToken';
    if (token.trim() === '') {
      say('No token was typed, so nothing was written.');
      proc.exitCode = 1;
      return;
    }
    const asked = load('node:child_process').spawnSync('npm config get userconfig', { shell: true, encoding: 'utf8' });
    const file = String(asked.stdout ?? '').trim();
    if (asked.status === 0 && file) {
      const fs = load('node:fs');
      /** @type {string[]} */
      let lines;
      try {
        lines = fs.readFileSync(file, 'utf8').split(/\r?\n/u);
      } catch {
        lines = [];
      }
      lines = lines.filter((line) => line.trim().startsWith(key + '=') === false);
      while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
      fs.writeFileSync(file, lines.concat(key + '=' + token.trim()).join('\n') + '\n', { mode: 0o600 });
      say('Wrote the read token for ' + host + ' into ' + file + ', without showing it.');
    } else {
      say('npm named no configuration file to write into, so nothing was written. Is npm on the path?');
      proc.exitCode = 1;
    }
  };
  if (host === undefined || host.trim() === '') {
    say(
      'No registry host was given, so nothing was read and nothing was written. Name the host after the script, as the line the setup prints does.',
    );
    proc.exitCode = 2;
  } else if (input.isTTY) {
    let token = '';
    let done = false;
    let escape = '';
    proc.stderr.write('Read token for ' + host + ', typed or pasted, not shown: ');
    input.setRawMode(true);
    input.setEncoding('utf8');
    input.on('data', (chunk) => {
      for (const key of chunk) {
        if (done) return;
        if (escape === 'sequence') {
          if (key >= '@' && key <= '~') escape = '';
          continue;
        }
        if (escape === 'one') {
          escape = '';
          continue;
        }
        if (escape === 'started') {
          escape = key === '[' ? 'sequence' : key === 'O' ? 'one' : '';
          if (escape) continue;
        }
        if (key === '\u001b') escape = 'started';
        else if (key === '\u0003' || key === '\r' || key === '\n') {
          done = true;
          input.setRawMode(false);
          input.pause();
          proc.stderr.write('\n');
          if (key === '\u0003') {
            say('Stopped, so nothing was written.');
            proc.exitCode = 130;
          } else write(token);
        } else if (key === '\b' || key === '\u007f') token = token.slice(0, -1);
        else if (key >= ' ') token += key;
      }
    });
    input.resume();
  } else {
    say(
      'There is no terminal to read the token in, so nothing was read and nothing was written. Run this line in your own terminal, not through the command input of an agent.',
    );
    proc.exitCode = 2;
  }
}

/**
 * The function's text as one line: its block comments, the type annotations, dropped, and every line break with the
 * indent around it made one space. Strings hold no line break, so none of them changes.
 */
const ONE_LINE = String(readToken)
  .replace(/\/\*.*?\*\//gsu, '')
  .replace(/\s*\n\s*/gu, ' ');

/** The text `node -e` runs: the function, called with the process and `require` of the script Node makes of it. */
export const TOKEN_SCRIPT = `(${ONE_LINE})(process,require)`;

/**
 * Started as the copy in a repository, `node .leafcutter/token.mjs <host>`: Node puts the file's path before the host,
 * where `node -e` puts nothing, so the function is given the arguments from the file's path on, and the exit code it
 * sets is the process's.
 *
 * @param {NodeJS.Process} [proc]
 * @param {(name: string) => any} [load]
 */
export function main(proc = process, load = createRequire(import.meta.url)) {
  readToken(
    {
      argv: proc.argv.slice(1),
      stdin: /** @type {TokenInput} */ (/** @type {unknown} */ (proc.stdin)),
      stderr: proc.stderr,
      /** @param {number | string | null | undefined} code */
      set exitCode(code) {
        proc.exitCode = code;
      },
    },
    load,
  );
}

/**
 * Whether this file is the script node was started with, both sides compared as real paths.
 *
 * @param {string[]} [argv]
 */
export function startedAsScript(argv = process.argv) {
  try {
    return argv[1] !== undefined && fileURLToPath(import.meta.url) === realpathSync(argv[1]);
  } catch {
    return false;
  }
}

if (startedAsScript()) main();
