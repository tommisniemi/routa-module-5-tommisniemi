import { getSettings } from "../platform.ts";
import { showChange } from "../preview.ts";
import { requireAdmin } from "../token-check.ts";

export const setSessionLengthTool = {
  name: "set_session_length",
  description: "Show what setting the session length to a number of hours would do, without changing anything. Returns an id for apply_change.",
  inputSchema: { type: "object", properties: { hours: { type: "number" } }, required: ["hours"] },
  async handler({ hours }: { hours: number }) {
    await requireAdmin();
    return showChange([{ type: "policy", id: "session-length-hours", value: hours }], await getSettings());
  },
};
