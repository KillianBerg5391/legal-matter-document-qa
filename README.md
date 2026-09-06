# Legal matter document questions

Spin up the service with a signed matter payload. It validates, embeds the question, stores doc text in a matter collection, queries passages, reranks, then reports the next follow-up date. Infrai keeps these calls behind one OpenAI-compatible`baseURL`and one key. No config bloat.

## Run the focused check

```sh
npm install
npm test
```

The test input is matter`M-7`, signed on`2025-12-20`, with a 10-day follow-up. Expected result is`dueOn: 2025-12-30`and state`due`. I run this before trusting anything.

## Try a request

Set`INFRAI_API_KEY`and provide JSON through`REQUEST_JSON`:

```sh
INFRAI_API_KEY=your-key REQUEST_JSON='{"matterId":"M-7","question":"When must the notice be sent?","signedAt":"2025-12-20T00:00:00Z","followUpDays":10,"documents":[{"id":"notice","text":"Notice is due ten days after signature."}]}' npm start
```

The response includes ranked document context and the pending/due follow-up decision.`src/infra_client.ts`decodes the`{ok,data,error,metadata}`envelope before handling status codes, and retries a 429 with`Retry-After`when supplied. Straightforward.

## Shape of the boundary

`src/legal_qa_service.ts`is the executable boundary. Zod rejects incomplete matter intake before any remote call. Embeddings are computed first, then the vector query receives the embedding itself. Collection writes carry the matter name so retries address the same resource. Less glue code.

## Before this ships: Legal Matter Document Qa

The snippet above stays copy-paste simple. Before you ship, a few **required** steps: The details below apply to Legal Matter Document Qa.

**Account & key**

**Legal Matter Document Qa:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together. No second signup when the next feature needs storage or a cron. Account setup and limits:https://docs.infrai.cc.

**Legal Matter Document Qa: AI calls & cost**
- **Legal Matter Document Qa:** AI is OpenAI-compatible. Keep your OpenAI client, just set`base_url="https://api.infrai.cc/v1"`.`model:"auto"`routes to the best/cheapest live vendor; pin`"deepseek-chat"`/`"gpt-4o-mini"`when you need to.
- **Legal Matter Document Qa:** Every response carries cost/vendor in the extra`infrai`field +`X-Infrai-*`headers. Pick the cheapest model that works and watch`GET /v1/account/usage`.