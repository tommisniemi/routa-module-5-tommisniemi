import assert from "node:assert/strict";
import { test } from "node:test";
import { baselineDifferencesTool, differences } from "../src/tools/baseline-differences.ts";
import { fakePlatform } from "./fake-platform.ts";

const baseline = { access: { staff: ["documents", "timesheets"], contractors: ["timesheets"] }, policies: { "session-length-hours": 8 } };
const settings = {
  access: [{ group: "contractors", apps: ["timesheets", "crm"] }, { group: "staff", apps: ["documents"] }],
  policies: [{ id: "session-length-hours", label: "Session length in hours", value: 24 }, { id: "guest-access", label: "Guest access", value: "open" }],
};

test("differences says each one in plain words", () => {
  assert.deepEqual(differences(settings, baseline), [
    "contractors reaches crm, but the baseline says it must not.",
    "staff doesn't reach timesheets, but the baseline says it should.",
    "session-length-hours is 24, but the baseline says 8.",
    "guest-access is \"open\", and the baseline doesn't mention it.",
  ]);
});

test("differences finds none when the settings match", () => {
  const same = { access: [{ group: "staff", apps: ["timesheets", "documents"] }, { group: "contractors", apps: ["timesheets"] }], policies: [{ id: "session-length-hours", label: "", value: 8 }] };
  assert.deepEqual(differences(same, baseline), []);
});

test("baseline_differences works with a read-only token and changes nothing", async () => {
  const { patches } = fakePlatform("read");
  const text = await baselineDifferencesTool.handler();
  assert.match(text, /differ from the baseline/);
  assert.match(text, /session-length-hours is 24, but the baseline says 8\./);
  assert.match(text, /Nothing has been changed\./);
  assert.equal(patches.length, 0);
});
