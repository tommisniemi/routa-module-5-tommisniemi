# Our conventions

## Language and runtime

- TypeScript on Node 22.18 or later. Node runs `.ts` files directly, so there is no build step.
- Use only TypeScript syntax that Node can strip: no `enum`, no `namespace`, no parameter properties.
- Use ES modules. Import local files with their `.ts` extension.

## Standard library only

Don't use packages from npm, in the server or its tests. The MCP stdio protocol is newline-delimited JSON-RPC, which Node handles without a library. `node:test` and `node:assert/strict` are enough for tests.

## Folder layout

```
mcp/
  src/         the server's code; one file per tool in src/tools
  test/        tests, named <module>.test.ts
```

Run the tests with `node --test "mcp/test/*.test.ts"`.

## Configuration

The server takes two environment variables:

- `ROUTA_URL`: where the platform is. It defaults to `http://localhost:4010`.
- `MCP_TOKEN`: the token of whoever is using the server, read-only or admin.

On a developer's laptop, the admin token is in `ROUTA_TOKEN` and the read-only one in `ROUTA_READONLY_TOKEN`. Code reads a token from the environment and sends it to the API, and scripts and tests can do the same. To call the API yourself, to check something, use `npm run api`, for example `npm run api -- GET /admin/v1/settings`: it sends the token without showing it, and `--readonly` sends the read-only one. A token's value is never written into code, a test, a log or a commit, and never printed, so nobody reads it in a terminal or a chat.

## Style

- Two-space indent, double quotes, semicolons.
- Write small functions with plain names. Prefer functions to classes.
