---
status: diagnosed
trigger: "Investigate issue: bsp-chat-not-working"
created: 2026-07-14T00:00:00Z
updated: 2026-07-14T00:40:00Z
---

## Current Focus

CONFIRMED - two independent, verified root causes, both required to produce exact observed symptom.

1. `match_bsp_documents` Postgres RPC (deployed in Supabase project qcohcaavhwujvagmpbdp) always returns 0 rows whenever `filter_category` is NULL - which is every real call from route.ts, since the chat client never sends `categoryFilter`. This causes `sources:[]`.
2. Hardcoded model id `claude-sonnet-4-20250514` (route.ts:154) is retired - Anthropic API returns `404 not_found_error: model: claude-sonnet-4-20250514`. The `.stream()` call itself resolves without throwing; the error only surfaces during the `for await` iteration inside the ReadableStream's `start()` handler (route.ts:187), which is caught at line 212-217 and emits the literal SSE `{"type":"error","error":"Failed to generate response"}` with HTTP 200 already sent - exactly matching the reported behavior.

next_action: report root cause (find_root_cause_only mode - do not fix)

## Symptoms

expected: POST /api/bsp-rag/chat with {"query":"What are your hours?","chatHistory":[]} streams SSE with retrieved sources and an LLM-generated answer.
actual: HTTP 200, but the SSE stream emits exactly:
  data: {"type":"sources","sources":[]}
  data: {"type":"error","error":"Failed to generate response"}
errors: Client-visible error "Failed to generate response". Server logs not yet inspected.
reproduction: curl -s -X POST "https://www.montanaparasail.com/api/bsp-rag/chat" -H "Content-Type: application/json" -d '{"query":"What are your hours?","chatHistory":[]}'
started: Reported broken today 2026-07-14. Unknown when it last worked.

## Eliminated

- hypothesis: OpenAI API key expired/revoked or embeddings failing
  evidence: Local probe `openai.embeddings.create({model:'text-embedding-3-small', input:'What are your hours?'})` with the .env.local OPENAI_API_KEY succeeded, returned a valid 1536-dim embedding. Eliminated.
  timestamp: 2026-07-14T00:10:00Z

- hypothesis: bsp_documents table empty (embeddings never uploaded / wiped)
  evidence: `select count(*) from bsp_documents` via service-role client returned count=10. Fetched embedding for id=4 directly: valid 1536-length float array, L2 norm ~= 1.0 (properly normalized real embedding), not null/zero/corrupted. Eliminated.
  timestamp: 2026-07-14T00:15:00Z

- hypothesis: RLS blocking access to bsp_documents or the RPC
  evidence: Called match_bsp_documents RPC directly via curl with SUPABASE_SERVICE_ROLE_KEY (service_role bypasses RLS entirely in Postgres/Supabase) - still returned 0 rows at match_threshold -1. RLS cannot be the cause since service_role ignores RLS policies altogether. Eliminated.
  timestamp: 2026-07-14T00:20:00Z

- hypothesis: Anthropic API key invalid/revoked or out of credits
  evidence: Direct call to Anthropic API with ANTHROPIC_API_KEY returns a well-formed `{"type":"error","error":{"type":"not_found_error","message":"model: claude-sonnet-4-20250514"}}` - this is a 404 model-not-found response, not a 401 auth error. `GET https://api.anthropic.com/v1/models` with the same key succeeds (200) and lists valid available models, confirming the key itself is valid and active. Eliminated as an auth/credit issue - it is a model-id issue.
  timestamp: 2026-07-14T00:35:00Z

## Evidence

- timestamp: 2026-07-14T00:00:00Z
  checked: src/app/api/bsp-rag/chat/route.ts full read
  found: |
    Code path analysis for observed output (HTTP 200 + SSE sources:[] + SSE error "Failed to generate response"):
    - Step 1 (OpenAI embedding) must NOT have thrown - a throw there produces `throw new Error('Failed to generate query embedding')` caught by outer try/catch, which returns Response.json(...) with status 500 (NOT an SSE 200 response). Since actual behavior is HTTP 200 SSE, embedding step succeeded.
    - Step 2 (Supabase RPC match_bsp_documents) must also NOT have thrown for the same reason (a throw returns 500 JSON, not SSE). So RPC call succeeded, but returned documents.length === 0 - either genuinely no matches (match_threshold 0.1 is permissive) or empty bsp_documents table.
    - Step 5 (`await anthropic.messages.stream(...)`) must have resolved without throwing (a throw there also hits outer catch -> 500 JSON, not SSE).
    - The only place that produces exactly `data: {type:"sources",sources:[]}` followed by `data: {type:"error","error":"Failed to generate response"}` with overall HTTP 200 is: readable stream's `start()` handler - sources event enqueued first (line 172-184), then the for-await loop over `stream` (line 187) throws, caught at line 212, enqueuing the literal error string "Failed to generate response" (line 215).
    - Conclusion: root cause is at least two things: (a) documents retrieval returns 0 results (needs separate check: empty table vs bad match), and (b) the Anthropic stream iteration itself fails (auth failure, invalid/retired model id, quota/credit exhaustion, or network issue when actually consuming the SSE stream from Anthropic's API).
  implication: Need to test OpenAI, Supabase RPC/table contents, and Anthropic independently.

- timestamp: 2026-07-14T00:25:00Z
  checked: match_bsp_documents RPC behavior with varying filter_category values, via direct REST calls to Supabase project qcohcaavhwujvagmpbdp with service-role key
  found: |
    - filter_category omitted (SQL DEFAULT NULL applies), match_threshold=-1 (should match every row since cosine similarity is always >= -1): returns [] (0 rows)
    - filter_category: null explicitly, match_threshold=-1: returns [] (0 rows)
    - filter_category: 'general' explicitly, match_threshold=-1: returns real matches (e.g. id 5 "Location and Directions", similarity computed correctly), consistent with genuine cosine similarity search working correctly
    - Confirmed via /rest/v1/ OpenAPI introspection that only ONE overload of match_bsp_documents exists, with the expected 4-parameter signature (query_embedding, match_threshold, match_count, filter_category) - no ambiguous overload issue.
  implication: |
    The deployed match_bsp_documents Postgres function does NOT correctly implement the documented `(filter_category IS NULL OR bd.category = filter_category)` OR-logic from supabase/bsp-schema.sql. In real SQL, that clause would short-circuit to TRUE for every row when filter_category is NULL - but the observed behavior is the opposite (0 rows when NULL, correct filtered rows when a value is passed). This means the ACTUAL function body deployed in Supabase differs from the bsp-schema.sql file in the repo (schema drift / stale documentation vs. live database state) - the file in the repo does not reflect what's actually running in production. Since chat/route.ts (line 54) defaults categoryFilter to null and NO UI code anywhere in src/ ever sets categoryFilter (verified via grep), every real chat request always passes filter_category: null, so retrieval ALWAYS returns 0 documents in production. This fully explains the observed `data: {"type":"sources","sources":[]}`.

- timestamp: 2026-07-14T00:32:00Z
  checked: src/app/api/bsp-rag/chat/route.ts:154 hardcoded model 'claude-sonnet-4-20250514' against live Anthropic API using ANTHROPIC_API_KEY from .env.local
  found: |
    - anthropic.messages.create({model:'claude-sonnet-4-20250514', ...}) -> throws 404 not_found_error: "model: claude-sonnet-4-20250514"
    - anthropic.messages.stream({model:'claude-sonnet-4-20250514', ...}): the `await` on `.stream(...)` itself resolves WITHOUT throwing (confirmed via staged probe separating the .stream() call from the for-await loop). The 404 not_found_error only throws when iterating the stream via `for await (const chunk of stream)`.
    - GET https://api.anthropic.com/v1/models with the same key returns 200 and a list of currently valid models: claude-sonnet-5, claude-fable-5, claude-opus-4-8, claude-opus-4-7, claude-sonnet-4-6, claude-opus-4-6, claude-opus-4-5-20251101, claude-haiku-4-5-20251001, claude-sonnet-4-5-20250929, claude-opus-4-1-20250805. claude-sonnet-4-20250514 is NOT in this list - it has been retired.
    - grep across src/ confirms this is the ONLY hardcoded Claude model reference in the codebase (route.ts:154).
  implication: |
    This exactly reproduces route.ts's structure: `const stream = await anthropic.messages.stream(...)` at line 153 is inside the OUTER try/catch (line 46-233), and does not throw. The failure only happens inside the ReadableStream's start() handler during `for await (const chunk of stream)` at line 187, which is caught by the INNER try/catch at line 212-217 - this inner catch enqueues the literal SSE payload `data: {"type":"error","error":"Failed to generate response"}` and closes the stream, with HTTP 200 status/headers already sent (line 222-229, before the stream body was iterated). This is the exact, byte-for-byte match of the reported production symptom's second SSE line.

## Resolution

root_cause: |
  TWO independent root causes combine to produce the exact reported symptom:

  1. SUPABASE RPC BUG (causes empty sources): The deployed `match_bsp_documents` Postgres function in Supabase project qcohcaavhwujvagmpbdp does not correctly handle a NULL `filter_category` parameter - it returns zero rows whenever filter_category is NULL/omitted, even at match_threshold as low as -1 (which should match every row). It only returns correct results when filter_category is explicitly set to a real category string. This contradicts the `(filter_category IS NULL OR bd.category = filter_category)` logic documented in supabase/bsp-schema.sql:96, indicating the live deployed function differs from the repo's schema file (schema drift). Since chat/route.ts:54 defaults `categoryFilter` to `null` and no UI code ever sets it, EVERY production chat request retrieves 0 documents, producing `sources:[]`.

  2. RETIRED ANTHROPIC MODEL (causes generation failure): src/app/api/bsp-rag/chat/route.ts:154 hardcodes `model: 'claude-sonnet-4-20250514'`, which Anthropic's API now rejects with `404 not_found_error`. This is confirmed independent of API key validity (the key works fine against /v1/models and other endpoints; it's specifically this model ID that's gone). Because `anthropic.messages.stream()` resolves its initial promise without throwing and only surfaces the error during the `for await` iteration (inside route.ts's ReadableStream start() handler, line 187), the failure is swallowed by the inner catch (line 212-217) and reported to the client as the generic SSE event `{"type":"error","error":"Failed to generate response"}` - with HTTP 200 already committed, hiding the real 404 from the client entirely.

  Both bugs are necessary and sufficient, independently, to explain each half of the observed two-line SSE output. They are unrelated to each other (different services, different failure mechanisms) - not a shared single root cause.
fix: (not applied - goal is find_root_cause_only per mode)
verification: (pending - not in scope for this mode)
files_changed: []

## RESOLUTION (2026-07-14)

**Correction to root cause #1:** Follow-up probes showed the `filter_category IS NULL` theory
was wrong — the deployed function's null handling is fine. The same null-filter query
flip-flops between correct rows and 0 rows across runs: the **ivfflat index**
(`idx_bsp_documents_embedding`) was built before `bsp_documents` was seeded, so its
centroids are garbage and index scans return empty. Which plan a request gets depends on
the pooled backend, so prod consistently returned empty sources while some local probes
succeeded. (Debugger's category-filtered probes took a different plan — red herring.)

**Fixes applied:**
1. `route.ts`: model `claude-sonnet-4-20250514` (retired, 404) → `claude-sonnet-5`;
   removed `temperature: 0.7` (non-default sampling params return 400 on Sonnet 5).
2. `route.ts`: replaced the `match_bsp_documents` RPC with in-process cosine ranking over
   the full document set (10 docs) — deterministic, no dependence on the broken index.

**Deferred:** `REINDEX INDEX idx_bsp_documents_embedding` (or drop it) in the Supabase SQL
editor if the corpus grows and RPC retrieval is restored. Requires dashboard access.

**Verified:** local dev server streams sources (top sim 0.255) + full Claude response + done event.
