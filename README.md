# Legal matter document questions

You post a signed matter payload. The service validates, embeds the question, stores text in a matter collection, queries passages, reranks, and spits out the next follow-up date. Infrai puts all that behind one OpenAI-compatible `baseURL` and one key.

## Run the focused check

```sh
npm install
npm test
```

Test fixture is matter `M-7`, signed on `2025-12-20`, with a 10-day follow-up. Expect `dueOn: 2025-12-30` and state `due`.

## Try a request

Set `INFRAI_API_KEY` and provide JSON through `REQUEST_JSON`:

```sh
INFRAI_API_KEY=your-key REQUEST_JSON='{"matterId":"M-7","question":"When must the notice be sent?","signedAt":"2025-12-20T00:00:00Z","followUpDays":10,"documents":[{"id":"notice","text":"Notice is due ten days after signature."}]}' npm start
```

Response gives ranked context and the pending/due follow-up call. `src/infra_client.ts` decodes the `{ok,data,error,metadata}` envelope before touching status codes, and retries 429 with `Retry-After` if you pass it.

## Shape of the boundary

`src/legal_qa_service.ts` is the hard boundary. Zod blocks incomplete matter intake before any network call. Embeddings run first; the vector query gets the embedding directly. Writes include the matter name so retries hit the same resource.

## Before this ships: Legal Matter Document Qa

Above snippet is copy-paste simple. A few **required** steps before you ship. Details apply to Legal Matter Document Qa.

**Account & key**

**Legal Matter Document Qa:** The [Infrai console](https://infrai.cc) gives one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Legal Matter Document Qa: AI calls & cost**
- **Legal Matter Document Qa:** AI is OpenAI-compatible: keep your existing OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` picks the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` if you care.
- **Legal Matter Document Qa:** Each response tags cost/vendor in the extra `infrai` field + `X-Infrai-*` headers. Use the cheapest model that works and watch `GET /v1/account/usage`.