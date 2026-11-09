// Every change is shown before it is applied: a tool that calls patchSettings
// must also call showChange. apply-change.ts applies a change that was shown
// when it was previewed, so it is the one exception.
import { readdirSync, readFileSync } from "node:fs";

const DIR = "mcp/src/tools";
const EXEMPT = ["apply-change.ts", "index.ts"];

const withoutComments = (code: string) =>
  code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
const calls = (code: string, name: string) => new RegExp(`\\b${name}\\s*\\(`).test(code);

const failures = readdirSync(DIR)
  .filter((file) => file.endsWith(".ts") && !EXEMPT.includes(file))
  .filter((file) => {
    const code = withoutComments(readFileSync(`${DIR}/${file}`, "utf8"));
    return calls(code, "patchSettings") && !calls(code, "showChange");
  });

for (const file of failures) {
  console.error(`${DIR}/${file}: calls patchSettings without calling showChange`);
}
process.exit(failures.length ? 1 : 0);
