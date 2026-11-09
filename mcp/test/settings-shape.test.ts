// Checks the settings shape the tools expect, using the fake platform so it runs anywhere, CI included.
import assert from "node:assert/strict";
import { test } from "node:test";
import { fakePlatform } from "./fake-platform.ts";

test("the platform's settings have the shape the tools expect", async () => {
  fakePlatform();
  const recorded = await (await fetch("http://localhost:4010/admin/v1/settings")).json();
  assert.ok(Array.isArray(recorded.access));
  assert.ok(recorded.access.every((a: { group: string; apps: string[] }) => typeof a.group === "string" && Array.isArray(a.apps)));
  assert.ok(recorded.policies.every((p: { id: string }) => typeof p.id === "string"));
});
