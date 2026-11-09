# Project brain

## What this is

Routa's IT configures its identity platform by asking Claude, through this MCP server. The brief is in `client/brief.md`.

## What we found out

- The admin API applies a PATCH at once and has no preview, so the server keeps its own.
- The API doesn't enforce scope: any valid token can PATCH. `whoami` says what a token is, and the server must refuse.
- `session-length-hours` takes a number, `guest-access` a string, and the `mfa.*` policies true or false.

## Rules that cost us if we break them

- A read-only token never changes a setting.
- Every change is shown before it is applied, and what is applied is what was shown.

## The baseline

- `client/security-baseline.json` holds the agreed access per group and the 20 policies. `baseline_differences` compares live settings with it, in plain words.
- It reads with `requireToken` (a read-only token is enough), calls only `getSettings`, and never `patchSettings`. It names what differs and doesn't offer to fix it: fixing goes through preview_change and apply_change.
- Against the seeded test environment it finds 9 differences (3 groups reaching apps they shouldn't, 2 MFA policies off, session length, legacy sign-in, guest access).
