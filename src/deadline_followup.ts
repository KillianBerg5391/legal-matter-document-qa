export type Matter = { matterId: string; signedAt: string; followUpDays: number };
export type FollowUp = { matterId: string; dueOn: string; state: "pending" | "due" };

export function nextFollowUp(matter: Matter, now = new Date("2026-01-01T00:00:00Z")): FollowUp {
  const due = new Date(matter.signedAt);
  due.setUTCDate(due.getUTCDate() + matter.followUpDays);
  return { matterId: matter.matterId, dueOn: due.toISOString().slice(0, 10), state: due <= now ? "due" : "pending" };
}
