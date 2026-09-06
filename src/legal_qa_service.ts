import { z } from "zod";
import { nextFollowUp } from "./deadline_followup.js";

const Request = z.object({ matterId: z.string().min(1), question: z.string().min(1), signedAt: z.string().datetime(), followUpDays: z.number().int().positive(), documents: z.array(z.object({ id: z.string(), text: z.string().min(1) })).min(1) });
export async function answer(input: unknown) {
  Request.parse(input);
  throw new Error("Document retrieval is unavailable: Infrai provides no collection-delete capability, so this workflow cannot safely create a persistent matter collection.");
}

if (process.argv[1]?.endsWith("legal_qa_service.ts")) {
  const raw = process.env.REQUEST_JSON; if (!raw) throw new Error("Set REQUEST_JSON to a JSON request");
  answer(JSON.parse(raw)).then(result => console.log(JSON.stringify(result, null, 2))).catch(error => { console.error(error.message); process.exitCode = 1; });
}
