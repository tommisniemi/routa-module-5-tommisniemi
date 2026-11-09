import { readFileSync } from "node:fs";
import { getSettings } from "../platform.ts";
import type { Settings } from "../platform.ts";
import { requireToken } from "../token-check.ts";

type Baseline = { access: Record<string, string[]>; policies: Record<string, boolean | number | string> };

const baselineFile = new URL("../../../client/security-baseline.json", import.meta.url);
const show = (value: unknown) => JSON.stringify(value);

export function differences(settings: Settings, baseline: Baseline): string[] {
  const found: string[] = [];
  const groups = new Set([...settings.access.map((a) => a.group), ...Object.keys(baseline.access)]);
  for (const group of [...groups].sort()) {
    const reaches = settings.access.find((a) => a.group === group)?.apps ?? [];
    const should = baseline.access[group] ?? [];
    for (const app of reaches.filter((a) => !should.includes(a))) found.push(`${group} reaches ${app}, but the baseline says it must not.`);
    for (const app of should.filter((a) => !reaches.includes(a))) found.push(`${group} doesn't reach ${app}, but the baseline says it should.`);
  }
  const ids = new Set([...settings.policies.map((p) => p.id), ...Object.keys(baseline.policies)]);
  for (const id of ids) {
    const policy = settings.policies.find((p) => p.id === id);
    if (!policy) found.push(`${id} is missing from the platform, and the baseline says ${show(baseline.policies[id])}.`);
    else if (!(id in baseline.policies)) found.push(`${id} is ${show(policy.value)}, and the baseline doesn't mention it.`);
    else if (policy.value !== baseline.policies[id]) found.push(`${id} is ${show(policy.value)}, but the baseline says ${show(baseline.policies[id])}.`);
  }
  return found;
}

export const baselineDifferencesTool = {
  name: "baseline_differences",
  description: "List every setting that differs from Routa's security baseline, in plain words. Only reads: it changes nothing, and works with a read-only token. To fix a difference, use preview_change.",
  inputSchema: { type: "object", properties: {} },
  async handler() {
    await requireToken();
    const baseline = JSON.parse(readFileSync(baselineFile, "utf8")) as Baseline;
    const found = differences(await getSettings(), baseline);
    if (!found.length) return "Every setting matches the baseline.";
    return [`${found.length} settings differ from the baseline:`, ...found.map((line) => `- ${line}`), "Nothing has been changed."].join("\n");
  },
};
