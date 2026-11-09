---
name: verify
description: Check whether the MCP server is done. Use after each build step, and before saying the work is done.
---

Run the checks below. Report each failing check with its error, or say that every check passed. Don't fix anything here, and don't reset anything.

## The checks

1. **The tests pass:** `npm test`.
2. **A live run, as IT would:** `npm run live-check`, with the test environment running. It takes the two tokens from `ROUTA_TOKEN` and `ROUTA_READONLY_TOKEN`, which are already in the environment. Don't read the token files.
3. **The security judge:** a fresh agent, one that didn't build the server, reads the server against a file of criteria and rates what it finds. See below.

## The security judge

The criteria file is an input. It is `client/security-criteria.md` unless the user names another file when asking for the check; use that file instead, unchanged. Don't summarise or edit the criteria, and don't write findings into them.

Start the judge with the Agent tool as a new agent (`general-purpose`, not a fork), so it carries none of this conversation. Give it only:

- the path of the criteria file, and the folder to read: `mcp/` (`src` and `test`);
- these instructions: read the code against every rule in the criteria and rate each finding with the criteria's own levels, `low`, `medium`, `high` or `critical`; for every finding quote the file and line you saw (`path:line` and the line's text) and say in one sentence which rule it breaks; don't report a finding you can't quote; don't edit, run or fix anything; don't read `~/.routa`, `.env*` or any token file; if you find nothing, say so.

Don't pass it the plan, the build summary or your opinion of the code: it should judge what is there, not what we meant. Ask it to answer as a list, one finding per line: `level | path:line | quoted text | rule broken`.

Then check each finding for yourself: open the quoted file and line, and drop or flag any quote that isn't there. Report the findings by level. The check **fails if any finding is high or critical**; say so, with those findings first. Low and medium findings are listed as notes and don't fail the check. Don't fix anything here.
