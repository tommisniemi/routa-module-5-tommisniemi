# Routa identity MCP server

An MCP server for Routa's identity platform. Routa's files are in `client/` and the project brain is in `brain/`.

`npm test` runs the tests. `npm run test-environment` starts a copy of Routa's platform on http://localhost:4010, with its settings page at http://localhost:4010/admin/settings. `npm run api -- GET /admin/v1/settings` calls its API with the token from your shell, without showing it.
