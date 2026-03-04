---
title: "Architecture Overview"
description: "System architecture of the IPKit MCP server -- entry points, provider pattern, service container, caching, and error handling."
---

IPKit is a Node.js server that exposes intellectual property search and analysis capabilities via the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). It normalizes data from 10 different IP offices into consistent schemas, handles authentication, rate limiting, caching, and error recovery for each provider.

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        AI Clients                           │
│  Claude Desktop  │  ChatGPT  │  HTTP API  │  Other MCP     │
└────────┬─────────┴─────┬─────┴──────┬─────┴────────────────┘
         │ stdio         │ SSE        │ HTTP
         ▼               ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Transport Layer                           │
│  StdioServerTransport │ SSEServerTransport │ StreamableHTTP │
│                       │   (ChatGPT)        │   (Hosted)     │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     MCP Server (server.ts)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Tool Registry│  │  Dispatcher  │  │ Analytics        │  │
│  │ (declarative)│  │ (validation  │  │ (per-tool stats, │  │
│  │              │  │  + execution │  │  latency P50/95) │  │
│  │              │  │  + errors)   │  │                  │  │
│  └──────────────┘  └──────┬───────┘  └──────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
┌──────────────────┐ ┌────────────┐ ┌────────────────┐
│   Tool Layer     │ │   Cache    │ │ Service        │
│ (trademarkSearch,│ │ (memory or │ │ Container      │
│  clearance,      │ │  file)     │ │ (services.ts)  │
│  designSearch,   │ │            │ │                │
│  patentSearch,   │ │ TTLs:      │ │ Lazy singletons│
│  monitoring...)  │ │ search: 5m │ │ Three-state:   │
│                  │ │ status: 1h │ │ undefined→null  │
│                  │ │ class: 24h │ │ →instance       │
└────────┬─────────┘ └────────────┘ └────────┬───────┘
         │                                    │
         ▼                                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    Provider Layer                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  USPTO   │ │  EUIPO   │ │IP Aust.  │ │  EPO     │ ...  │
│  │(REST/Key)│ │(REST/    │ │(REST/    │ │(REST/    │      │
│  │          │ │ OAuth2)  │ │ OAuth2)  │ │ OAuth2)  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                             │
│  Each provider:  client.ts → transformer.ts → types.ts      │
│  With: RateLimiter, CircuitBreaker, withRetry()             │
└─────────────────────────────────────────────────────────────┘
```

## Entry Point Flow

The server starts in `src/index.ts`:

1. **Configuration** -- `src/config.ts` loads environment variables, validates them with Zod, and exports a typed `Config` object.
2. **Transport selection** -- Based on `config.transport`, the entry point invokes one of three startup functions:
   - `runStdioServer()` for local Claude Desktop usage
   - `runHttpServer(config)` for hosted or self-hosted HTTP deployment
   - `runChatGptServer(config)` for ChatGPT Apps SDK via SSE
3. **Server creation** -- `createServer()` in `src/server.ts` instantiates an MCP `Server`, registers all tools, and connects the transport.
4. **Graceful shutdown** -- Signal handlers (`SIGINT`, `SIGTERM`) call `destroyServices()` to clean up cache intervals, analytics emitters, and active sessions.

## Tool Registration and Dispatch

Tools are registered declaratively in a `toolRegistry` map inside `server.ts`. Each entry binds a tool name, Zod input schema, description, and executor function.

The centralized dispatcher handles all tool calls:

1. **Validation** -- Input arguments are parsed against the tool's Zod schema. Invalid input returns a structured `INVALID_INPUT` error.
2. **Execution** -- The tool's executor function is called with validated arguments.
3. **Analytics** -- A `ToolCallEvent` is recorded in the `Analytics` collector (in a `finally` block) with tool name, duration, success/failure, cache hit, and error details.
4. **Error formatting** -- If the executor throws a `TrademarkError`, it is converted to an MCP error response via `toMcpError()`. Unexpected errors are wrapped as `INTERNAL_ERROR`.

Adding a new tool requires a single `registerTool()` call -- no routing or middleware changes needed.

## Provider Pattern

### TrademarkProvider Interface

Every trademark jurisdiction implements the `TrademarkProvider` interface:

```typescript
interface TrademarkProvider {
  jurisdiction: Jurisdiction;
  isConfigured(): boolean;
  search(params: SearchParams): Promise<SearchResult>;
  getDetails(identifier: string): Promise<TrademarkDetail>;
  getStatus(identifier: string, options?): Promise<StatusResponse>;
}
```

### ProviderRegistry

The `ProviderRegistry` is a `Map<Jurisdiction, TrademarkProvider>` that stores all registered providers. Tools call `registry.getConfigured()` to get the list of providers that have valid credentials, and `registry.get(jurisdiction)` to retrieve a specific provider.

### Provider File Structure

Each provider lives in `src/providers/{jurisdiction}/` with three files:

- **`types.ts`** -- TypeScript interfaces for the raw API response shapes
- **`client.ts`** -- Implements `TrademarkProvider` with rate limiting, retries, and error handling
- **`transformer.ts`** -- Normalizes API-specific response shapes into `TrademarkSummary` and `TrademarkDetail`

Design and patent providers follow the same pattern but do not implement `TrademarkProvider` (they are separate IP domains with different schemas, classifications, and lifecycles).

### Resilience

Each provider client wraps API calls with:

- **`RateLimiter`** -- Token bucket that enforces per-provider request limits (configurable via env vars)
- **`withRetry()`** -- Automatic retry with exponential backoff for transient errors (5xx, timeouts)
- **`CircuitBreaker`** -- Shared circuit breakers for providers with common OAuth infrastructure (EUIPO, IP Australia, EPO). Opens after repeated failures to avoid cascading timeouts.
- **`TrademarkError`** -- All errors are wrapped with error codes, provider name, and retry metadata

## Service Container

`src/services.ts` is the shared service container. It provides lazy singletons for:

- Provider registry
- Search and status caches
- EUIPO sub-clients (G&S, Designs, Persons)
- IP Australia sub-clients (Designs, Patents)
- EPO client
- Analytics collector and emitter
- Trademark watcher and webhook dispatcher
- API key store, quota tracker, rate limiter

### Three-State Singleton Pattern

Optional services (like EUIPO sub-clients) use a three-state pattern:

```typescript
let _euipoGSClient: EUIPOGSClient | null | undefined = undefined;

export function getEUIPOGSClient(): EUIPOGSClient | null {
  if (_euipoGSClient === undefined) {           // unchecked
    const client = new EUIPOGSClient();
    _euipoGSClient = client.isConfigured()
      ? client                                   // ready
      : null;                                    // not configured
  }
  return _euipoGSClient;
}
```

- `undefined` -- not yet checked
- `null` -- checked, not configured (credentials missing or provider disabled)
- instance -- checked, configured, ready to use

Tools check for `null` and return a clear error message like "EUIPO provider is not configured" instead of throwing.

## Caching

IPKit uses an in-memory or file-based cache with configurable TTLs:

| Cache | Default TTL | Purpose |
|-------|-------------|---------|
| Search results | 5 minutes | Avoid re-querying upstream APIs for identical searches |
| Status lookups | 1 hour | Trademark status changes infrequently |
| Nice class / G&S | 24 hours | Classification data is essentially static |

The cache backend is selected by configuration:
- **`CACHE_DIR` unset** -- `MemoryCache` (volatile, lost on restart)
- **`CACHE_DIR` set** -- `FileCache` (persists to disk as JSON)

Both backends implement the same `Cache` interface and support `getStats()` for analytics integration.

## Error Handling

All errors flow through the `TrademarkError` class:

```typescript
throw new TrademarkError({
  code: ErrorCode.PROVIDER_ERROR,
  message: 'EUIPO service error (HTTP 500)',
  provider: 'EUIPO',
  retryable: true,
  retryAfterMs: 5000,
});
```

The `handleProviderError()` utility maps HTTP status codes to appropriate error codes:
- 401/403 -> `AUTH_FAILED`
- 404 -> `TRADEMARK_NOT_FOUND`
- 429 -> `RATE_LIMITED` (with `retryAfterMs` from `Retry-After` header)
- 5xx -> `PROVIDER_ERROR`
- Timeouts -> `PROVIDER_TIMEOUT`
- DNS/connection errors -> `PROVIDER_UNAVAILABLE`

### Multi-Jurisdiction Graceful Degradation

When searching across multiple jurisdictions, individual provider failures do not abort the entire search. IPKit uses `Promise.allSettled()` to collect results from all providers, returns data from successful providers, and reports per-jurisdiction errors in the response metadata.

## OAuth Pre-warming

On HTTP server startup, `prewarmOAuth()` eagerly fetches OAuth tokens for configured providers (IP Australia, EUIPO, EPO) in a fire-and-forget pattern. This avoids cold-start latency on the first user request after deployment. If pre-warming fails, the normal lazy initialization path still works.
