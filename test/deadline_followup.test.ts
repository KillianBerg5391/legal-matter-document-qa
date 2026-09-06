import assert from "node:assert/strict";
import { nextFollowUp } from "../src/deadline_followup.js";
const result = nextFollowUp({ matterId: "M-7", signedAt: "2025-12-20T00:00:00Z", followUpDays: 10 }, new Date("2026-01-01T00:00:00Z"));
assert.deepEqual(result, { matterId: "M-7", dueOn: "2025-12-30", state: "due" });
console.log("deadline decision test passed");
