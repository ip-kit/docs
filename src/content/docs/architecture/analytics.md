---
title: "Analytics & Observability"
description: "In-memory analytics, structured logging, latency percentiles, and the metrics endpoint in IPKit."
---

IPKit includes a zero-dependency, in-memory analytics module that tracks tool call performance, cache efficiency, rate limiter pressure, and per-API-key usage. No external services or databases are required.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Tool Dispatcher (server.ts)             │
│  Every tool call records a ToolCallEvent in finally {}   │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Analytics Collector (collector.ts)          │
│                                                         │
│  Per-tool:    count, errors, cache hits, latency array  │
│  Per-provider: error counts                             │
│  Per-key:     call counts, error counts, tool breakdown │
│  Caches:      hits, misses, size (pull-based)           │
│  Rate limiters: waits, total wait time (pull-based)     │
│                                                         │
│  Cumulative totals survive reset()                      │
│  Window counters cleared on reset()                     │
└──────────────┬───────────────────────┬──────────────────┘
               │                       │
               ▼                       ▼
┌──────────────────────┐  ┌───────────────────────────────┐
│  Emitter (emitter.ts)│  │  GET /metrics (http.ts)       │
│  Periodic flush to   │  │  Returns MetricsSnapshot JSON │
│  structured logs     │  │  Requires API key auth        │
│  (configurable       │  │                               │
│   interval)          │  │  GET /usage (http.ts)          │
│                      │  │  Per-key usage stats           │
└──────────────────────┘  └───────────────────────────────┘
```

## Components

### Collector (`src/analytics/collector.ts`)

The `Analytics` class is the central data store. It receives `ToolCallEvent` objects from the dispatcher and computes aggregated statistics.

**Per-tool metrics:**
- Call count
- Error count
- Cache hit count
- Latency percentiles (P50, P95, P99) using reservoir sampling

**Per-provider metrics:**
- Error counts by provider name (e.g., `EUIPO`, `USPTO`)

**Per-key metrics:**
- Total calls and errors per API key
- Per-tool call breakdown
- First and last seen timestamps

**Reservoir sampling:** When a tool accumulates more than 1,000 latency samples, new samples probabilistically replace existing ones (reservoir sampling). This bounds memory while preserving statistical accuracy.

**Cumulative vs. window counters:** The `totalCalls` and `totalErrors` counters survive `reset()` (they represent lifetime totals). Per-tool window counters are cleared on each reset, which happens after every metrics flush.

### Emitter (`src/analytics/emitter.ts`)

The `AnalyticsEmitter` flushes the collector at a configurable interval:

1. Calls `analytics.getMetrics()` to build a snapshot
2. Emits the snapshot as a structured log via `logger.info('metrics_window', snapshot)`
3. Calls `analytics.reset()` to clear window counters

The interval timer is `unref()`'d so it does not keep the Node.js process alive during shutdown.

On `destroy()`, the emitter performs a final flush before stopping.

### Hash (`src/analytics/hash.ts`)

The `hashQuery()` function produces a SHA-256 truncated hash of search queries. This enables deduplication and trending analysis without storing plaintext user queries in logs or metrics.

```typescript
hashQuery('BRIGHTPATH') // -> 'a3f2b1c4d5e6f7a8'
```

IPKit never logs plaintext search queries. All query references in structured logs use hashed values.

## Structured Logs

IPKit emits two types of structured log entries for observability:

### `tool_call` (per-call)

Emitted after every tool call completes. Written to stderr as a JSON line.

```json
{
  "level": "info",
  "message": "tool_call",
  "tool": "trademark_search",
  "sessionId": "a1b2c3d4-e5f6-...",
  "durationMs": 342,
  "success": true,
  "cacheHit": false,
  "transport": "http",
  "timestamp": "2026-03-04T10:15:30.000Z",
  "apiKeyId": "f7a8b9c0"
}
```

On failure, additional fields are included:

```json
{
  "level": "info",
  "message": "tool_call",
  "tool": "trademark_search",
  "success": false,
  "errorCode": "RATE_LIMITED",
  "errorProvider": "EUIPO",
  "durationMs": 15023,
  ...
}
```

### `metrics_window` (periodic)

Emitted at the configured interval (default: every 60 seconds). Contains the full `MetricsSnapshot`.

```json
{
  "level": "info",
  "message": "metrics_window",
  "uptimeSeconds": 3600,
  "totalCalls": 1247,
  "totalErrors": 23,
  "activeSessions": 3,
  "tools": {
    "trademark_search": {
      "count": 89,
      "errors": 2,
      "cacheHits": 34,
      "p50Ms": 450,
      "p95Ms": 1200,
      "p99Ms": 2800
    }
  },
  "providerErrors": {
    "EUIPO": 15,
    "USPTO": 8
  },
  "caches": {
    "search": {
      "hits": 234,
      "misses": 456,
      "size": 189,
      "hitRate": 0.339
    }
  },
  "rateLimiters": {
    "euipo": {
      "waits": 12,
      "totalWaitMs": 4500
    }
  }
}
```

## Metrics Endpoint

The `GET /metrics` endpoint on the HTTP transport returns a `MetricsSnapshot` as JSON. It requires API key authentication (same key used for MCP requests).

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://ipkit.fly.dev/metrics
```

### Response Schema

| Field | Type | Description |
|-------|------|-------------|
| `uptimeSeconds` | number | Seconds since the server process started |
| `totalCalls` | number | Total tool calls since server start |
| `totalErrors` | number | Total tool call errors since server start |
| `activeSessions` | number | Currently active MCP sessions |
| `tools` | Record | Per-tool stats (count, errors, cacheHits, p50Ms, p95Ms, p99Ms) |
| `providerErrors` | Record | Error counts by provider name |
| `caches` | Record | Cache stats (hits, misses, size, hitRate) |
| `rateLimiters` | Record | Rate limiter stats (waits, totalWaitMs) |
| `keyUsage` | Record? | Per-API-key usage stats (when keys have been tracked) |

### Per-Key Usage Endpoints

```bash
# All key usage
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://ipkit.fly.dev/usage

# Specific key usage
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://ipkit.fly.dev/usage/f7a8b9c0
```

Each key entry includes:

| Field | Type | Description |
|-------|------|-------------|
| `keyId` | string | Hashed API key identifier (SHA-256 truncated to 16 chars) |
| `totalCalls` | number | Total tool calls with this key |
| `totalErrors` | number | Total errors for this key |
| `tools` | Record | Per-tool call counts |
| `firstSeen` | string | First call timestamp (ISO 8601) |
| `lastSeen` | string | Most recent call timestamp (ISO 8601) |

## Pull-Based Stats

Cache and rate limiter stats use a pull-based model. Instead of pushing hit/miss events into the collector, stat sources are registered as callback functions that are called when metrics are requested:

```typescript
// In services.ts:
analytics.registerCacheSource('search', () => searchCache.getStats());
analytics.registerRateLimiterSource('euipo', () => rateLimiter.getWaitStats());
```

This avoids tight coupling between the cache/rate-limiter implementations and the analytics module. Pull-based sources override push-based entries with the same name, allowing a clean upgrade path.

## Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ANALYTICS_ENABLED` | boolean | `true` | Enable/disable the analytics collector and emitter |
| `ANALYTICS_INTERVAL_MS` | number | `60000` | Interval between periodic metrics log flushes (milliseconds, minimum: 1000) |

When `ANALYTICS_ENABLED=false`:
- No `ToolCallEvent` objects are recorded
- No `metrics_window` logs are emitted
- `GET /metrics` returns `{"error": "Analytics disabled"}`
- Tool calls still function normally -- analytics is a non-blocking sidecar

## Privacy

IPKit never logs plaintext search queries. The `hashQuery()` function from `src/analytics/hash.ts` is used for any query references in logs or metrics. API keys are identified by their SHA-256 truncated hash (`keyId`), never by the full key value.

## Lifecycle

1. **Startup** -- `getAnalytics()` in `services.ts` creates the `Analytics` collector and `AnalyticsEmitter` on first access. Cache and rate limiter sources are registered at the same time.
2. **Running** -- The emitter flushes metrics at the configured interval. The `GET /metrics` endpoint pulls a snapshot on demand.
3. **Shutdown** -- `destroyServices()` calls `emitter.destroy()`, which performs a final flush and clears the interval.
