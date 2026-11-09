# Plan

- [x] Speak MCP over stdio
- [x] get_settings and who_can_reach
- [x] preview_change and apply_change
- [x] The token check on every tool
- [x] set_session_length: IT asked for a quick way
- [x] copy_group_access: IT asked for a way to line one group up with another
- [x] set_session_length only shows the change; apply_change applies it (lint gate)
- [x] copy_group_access checks for an admin token and only shows the change; apply_change applies it (verify: two high findings)
- [x] settings-shape test uses the fake platform, not an ignored local fixture (CI failure on PR 1)
- [x] baseline_differences: a read-only tool that lists, in plain words, every setting that differs from client/security-baseline.json (IT asked; works with a read-only token, changes nothing)
