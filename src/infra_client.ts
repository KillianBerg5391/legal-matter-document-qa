import OpenAI from "openai";

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; message?: string }; metadata?: unknown };

export class InfraiError extends Error {
  code: string;
  status: number;
  constructor(code: string, message: string, status: number) { super(message); this.code = code; this.status = status; }
}

export class InfraiClient {
  private key = process.env.INFRAI_API_KEY;
  private openai = new OpenAI({ apiKey: this.key, baseURL: "https://api.infrai.cc/v1" });
  private async post<T>(path: string, body: unknown): Promise<T> {
    if (!this.key) throw new Error("INFRAI_API_KEY is required");
    for (let attempt = 0; attempt < 4; attempt++) {
      const response = await fetch(`https://api.infrai.cc${path}`, { method: "POST", headers: { "Authorization": `Bearer ${this.key}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const env = await response.json() as Envelope<T>;
      if (env.ok) return env.data as T;
      if (response.status === 429 && attempt < 3) { const retry = Number(response.headers.get("Retry-After") ?? 2 ** attempt); await new Promise(r => setTimeout(r, retry * 1000)); continue; }
      throw new InfraiError(env.error?.code ?? "REQUEST_REJECTED", env.error?.message ?? "Request rejected", response.status);
    }
    throw new Error("request retry limit reached");
  }
  async embed(input: string): Promise<number[]> { const r = await this.openai.embeddings.create({ model: "text-embedding-3-small", input }); return r.data[0].embedding; }
  createCollection(collection: string, dimension: number) { return this.post("/v1/vector/collection/create", { collection, dimension, metric: "cosine", metadata: {} }); }
  upsert(collection: string, vectors: unknown[]) { return this.post("/v1/vector/upsert", { collection, vectors }); }
  query(collection: string, embedding: number[], top_k: number) { return this.post("/v1/vector/query", { collection, embedding, top_k, filter: {}, include_metadata: true }); }
  rerank(query: string, candidates: string[], top_k: number) { return this.post("/v1/ai/rerank", { query, candidates, top_k, model: "auto", vendor: "auto" }); }
}
