// PreToolUse hook: refuse any change to mcp/src/token-check.ts.
// Exit 2 blocks the call and sends stderr back to Claude.
import { resolve } from "node:path";

const PROTECTED = "mcp/src/token-check.ts";
const NAME = /token-check\.ts/;

// A shell segment that mentions the file and does one of these writes to it.
const WRITES = [
  />\s*["']?[^\s;&|"']*token-check\.ts/, // > and >> redirection
  /\btee\b/,
  /\bsed\b[^;&|]*\s-[a-zA-Z]*i/,
  /\bperl\b[^;&|]*\s-[a-zA-Z]*i/,
  /\b(mv|cp|rm|truncate|install|ln|chmod|chown|patch|dd|rsync)\b/,
  /\bgit\s+(checkout|restore|reset|rm|mv|apply|revert|stash|clean|am|cherry-pick|merge|rebase|switch)\b/,
  /\b(writeFile|writeFileSync|appendFile|appendFileSync|createWriteStream|rename|unlink|open)\b/,
];

function block(why: string): never {
  console.error(`Blocked: ${PROTECTED} must not be changed (${why}).`);
  process.exit(2);
}

function isProtectedPath(path: string, cwd: string): boolean {
  return resolve(cwd, path).endsWith(`/${PROTECTED}`);
}

function writesToProtected(command: string): boolean {
  return command
    .split(/&&|\|\||[;|\n]/)
    .some((segment) => NAME.test(segment) && WRITES.some((write) => write.test(segment)));
}

const input = JSON.parse(await new Promise<string>((done) => {
  let text = "";
  process.stdin.on("data", (chunk) => (text += chunk));
  process.stdin.on("end", () => done(text));
}));

const { tool_name: tool, tool_input: args = {}, cwd = process.cwd() } = input;

if (tool === "Bash") {
  if (writesToProtected(args.command ?? "")) block("shell command writes to it");
} else {
  const path = args.file_path ?? args.notebook_path ?? "";
  if (path && isProtectedPath(path, cwd)) block(`${tool} on it`);
}
