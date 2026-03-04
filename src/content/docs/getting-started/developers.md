---
title: "IPKit as Your Data Layer"
description: "Technical guide for developers building on IPKit — architecture, local setup, HTTP transport, and extension points."
---

IPKit is an MCP (Model Context Protocol) server that normalizes intellectual property data from 10 trademark, design, and patent offices into a consistent schema. You can use it as a data layer for legal tech products, integrate it into AI agent workflows, or extend it with new jurisdictions.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  AI Client (Claude Desktop / ChatGPT / Your App)    │
└──────────────────────┬──────────────────────────────┘
                       │ MCP Protocol (stdio or HTTP)
┌──────────────────────▼──────────────────────────────┐
│  IPKit MCP Server                                   │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ Tool Layer │  │ Schema Layer │  │  Analytics   │ │
│  │ (27 tools) │  │ (Zod + JSON) │  │  (metrics)  │ │
│  └─────┬──────┘  └──────────────┘  └─────────────┘ │
│        │                                            │
│  ┌─────▼────────────────────────────────────────┐   │
│  │  Provider Registry                           │   │
│  │  USPTO │ EUIPO │ IP Australia │ IPONZ │ WIPO │   │
│  │  UKIPO │ CIPO  │ JPO  │ CNIPA │ EPO         │   │
│  └──────────────────────────────────────────────┘   │
│  ┌───────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │   Cache   │  │ Rate Limiter │  │  OAuth Pool  │  │
│  └───────────┘  └──────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

Key design decisions:

- **Provider pattern:** Each jurisdiction implements a `TrademarkProvider` interface with `search()`, `getDetails()`, and `getStatus()` methods. Designs and patents have separate client/transformer pairs (they are different IP domains with different identifiers and classifications).
- **Three-state singletons:** Provider services use `undefined` (unchecked) / `null` (not configured) / instance (ready). Tools check for `null` and return a clear configuration error.
- **Schema normalization:** Raw API responses are transformed into Zod-validated schemas (`TrademarkSummary`, `TrademarkDetail`, `DesignSummary`, `PatentSummary`, etc.). Consumers always get a consistent shape regardless of source jurisdiction.
- **Transport agnostic:** The same server instance runs over stdio (Claude Desktop), HTTP (programmatic access), or SSE (ChatGPT).

## Local Installation

Clone the repository and build:

```bash
git clone https://github.com/ip-kit/core.git
cd core
npm install
npm run build    # Produces dist/index.js (~1.6 MB self-contained ESM bundle)
```

The built `dist/index.js` runs anywhere Node 20+ exists, with no `node_modules` required.

### Claude Desktop Configuration (Local Mode)

```json
{
  "mcpServers": {
    "ipkit": {
      "command": "node",
      "args": ["/path/to/core/dist/index.js"],
      "env": {
        "USPTO_API_KEY": "your_key",
        "EUIPO_CLIENT_ID": "your_id",
        "EUIPO_CLIENT_SECRET": "your_secret",
        "IPAUSTRALIA_CLIENT_ID": "your_id",
        "IPAUSTRALIA_CLIENT_SECRET": "your_secret",
        "EPO_CONSUMER_KEY": "your_key",
        "EPO_CONSUMER_SECRET": "your_secret"
      }
    }
  }
}
```

IPKit starts with whatever providers have valid credentials. Missing credentials disable that provider gracefully -- tools return a clear error message rather than crashing.

## Environment Variables

### Provider Credentials

| Variable | Provider | Required |
|----------|----------|----------|
| `USPTO_API_KEY` | USPTO (US trademarks) | For US search |
| `EUIPO_CLIENT_ID` | EUIPO (EU trademarks, designs, G&S) | For EU search |
| `EUIPO_CLIENT_SECRET` | EUIPO | For EU search |
| `IPAUSTRALIA_CLIENT_ID` | IP Australia (AU trademarks, designs, patents) | For AU search |
| `IPAUSTRALIA_CLIENT_SECRET` | IP Australia | For AU search |
| `IPONZ_API_KEY` | IPONZ (NZ trademarks) | For NZ search |
| `EPO_CONSUMER_KEY` | EPO OPS (European patents) | For EP search |
| `EPO_CONSUMER_SECRET` | EPO OPS | For EP search |

WIPO, UKIPO, CIPO, JPO, and CNIPA do not require credentials (public/scraped APIs).

### Transport and Server

| Variable | Default | Description |
|----------|---------|-------------|
| `TRANSPORT` | `stdio` | Transport mode: `stdio`, `http`, or `chatgpt` |
| `HTTP_PORT` | `3000` | Port for HTTP transport |
| `HTTP_HOST` | `127.0.0.1` | Bind address for HTTP transport |
| `API_KEYS` | (none) | Comma-separated API keys for HTTP authentication |
| `API_KEYS_CONFIG` | (none) | Path to JSON file with per-key configuration |
| `ADMIN_API_KEY` | (none) | Admin key for metrics and management endpoints |

### Feature Flags and Tuning

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_USPTO` | `true` | Enable/disable individual providers |
| `CACHE_TTL_SEARCH` | `300` | Search result cache TTL in seconds |
| `CACHE_TTL_STATUS` | `3600` | Status result cache TTL in seconds |
| `LOG_LEVEL` | `info` | `debug`, `info`, `warn`, `error` |
| `ANALYTICS_ENABLED` | `true` | Enable in-memory analytics collection |

See the [Configuration Reference](/reference/configuration/) for the complete list.

## HTTP Transport

For programmatic access (no AI assistant needed), run IPKit in HTTP mode:

```bash
TRANSPORT=http HTTP_PORT=3000 API_KEYS=sk-my-key node dist/index.js
```

The server exposes a single MCP endpoint at `POST /mcp` plus a metrics endpoint at `GET /metrics`.

### Making Tool Calls

The HTTP transport uses the MCP protocol over HTTP. Send JSON-RPC requests to `/mcp`:

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-my-key" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "trademark_search",
      "arguments": {
        "query": "CloudBooks",
        "jurisdiction": "US",
        "searchType": "name",
        "maxResults": 10
      }
    }
  }'
```

### Listing Available Tools

```bash
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-my-key" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'
```

The response includes the JSON Schema for each tool's input parameters.

## Available Tools

IPKit exposes 27 tools organized by IP domain:

### Trademarks
| Tool | Description |
|------|-------------|
| `trademark_search` | Search across 9 jurisdictions by name, owner, number, or fuzzy similarity |
| `trademark_status` | Full details for a specific trademark |
| `trademark_clearance` | Comprehensive conflict analysis with similarity scoring and risk assessment |
| `distinctiveness_hints` | Evaluate inherent distinctiveness on the legal spectrum |

### Nice Classification and G&S
| Tool | Description |
|------|-------------|
| `nice_class_lookup` | Look up class details by number or keyword |
| `suggest_nice_classes` | Recommend classes from a business description |
| `generate_gs_specification` | Draft filing-ready specifications (US/EU/WIPO formats) |
| `validate_gs_terms` | Validate terms against the EUIPO Harmonised Database |
| `translate_gs_terms` | Translate terms across 23 EU languages via HDB |

### Designs
| Tool | Description |
|------|-------------|
| `eu_design_search` | Search EU Community Designs (Locarno classification) |
| `eu_design_status` | Full details for an EU design |
| `au_design_search` | Search Australian designs |
| `au_design_status` | Full details for an AU design |

### Patents
| Tool | Description |
|------|-------------|
| `au_patent_search` | Search Australian patents (IPC classification) |
| `au_patent_status` | Full details for an AU patent |
| `ep_patent_search` | Search 130M+ European patents via EPO OPS |
| `ep_patent_status` | Full details for an EP patent |
| `patent_family_search` | Worldwide patent family members via INPADOC |

### Persons and Portfolios
| Tool | Description |
|------|-------------|
| `eu_person_lookup` | Search EUIPO applicants and representatives |
| `eu_applicant_portfolio` | Unified IP portfolio across EU trademarks and designs |

### Monitoring and Webhooks
| Tool | Description |
|------|-------------|
| `create_watch` | Monitor a trademark for status changes, similar filings, or deadlines |
| `list_watches` / `manage_watch` | List, pause, resume, or delete watches |
| `get_watch_events` / `acknowledge_events` | Retrieve and manage watch events |
| `register_webhook` / `manage_webhook` | Register and manage webhook endpoints |
| `get_delivery_log` | View webhook delivery history |
| `portfolio_analytics` | Aggregate health score across all watches |

See the [Tool Reference](/reference/tools/trademark/trademark-search/) for full parameter schemas and response shapes.

## Response Shapes

All trademark tools return normalized schemas defined in Zod:

- `TrademarkSummary` -- compact result from search (id, name, jurisdiction, status, Nice classes, owner, dates)
- `TrademarkDetail` -- full result from status lookup (adds G&S specification, history, priority claims, representative info)
- `DesignSummary` / `DesignDetail` -- design equivalents (Locarno classes instead of Nice)
- `PatentSummary` / `PatentDetail` -- patent equivalents (IPC classification, inventors, patent family)

IDs are formatted as `{JURISDICTION}-{applicationNumber}` (e.g., `US-87654321`, `EU-018901234`).

See the [Schema Reference](/reference/schemas/) for complete type definitions.

## Rate Limiting and Caching

### Caching

IPKit caches responses in memory (or on disk if `CACHE_DIR` is set):

| Cache Type | Default TTL | Override |
|------------|-------------|----------|
| Search results | 5 minutes | `CACHE_TTL_SEARCH` |
| Status lookups | 1 hour | `CACHE_TTL_STATUS` |
| Classification data | 24 hours | `CACHE_TTL_CLASS` |

Set any TTL to `0` to disable caching for that category.

### Provider Rate Limits

Each provider has an independent rate limiter. Defaults are conservative:

| Provider | Default (req/min) | Override |
|----------|-------------------|----------|
| USPTO | 60 | `USPTO_RATE_LIMIT` |
| EUIPO | 60 | `EUIPO_RATE_LIMIT` |
| IP Australia | 500 | `IPAUSTRALIA_RATE_LIMIT` |
| IPONZ | 60 | `IPONZ_RATE_LIMIT` |
| EPO | 30 | `EPO_RATE_LIMIT` |
| WIPO, UKIPO, CIPO, JPO, CNIPA | 30 | `{PROVIDER}_RATE_LIMIT` |

When a rate limit is hit, requests queue and wait rather than failing. The `withRetry()` wrapper handles transient HTTP errors with exponential backoff.

### OAuth Token Management

EUIPO, IP Australia, and EPO use OAuth2 client-credentials flow. Tokens are cached by provider and automatically refreshed on expiry. In HTTP mode, OAuth tokens are pre-warmed at server startup to reduce first-request latency.

## Building on IPKit

### Adding a New Provider

IPKit is designed to be extended with additional jurisdictions. Each provider needs:

1. `types.ts` -- Native API response types
2. `client.ts` -- `TrademarkProvider` implementation with `search()`, `getDetails()`, `getStatus()`
3. `transformer.ts` -- Normalize API responses to IPKit schemas
4. Registration in `src/providers/index.ts` and `src/schemas/common.ts`

See [Adding a Provider](/architecture/adding-a-provider/) for the full walkthrough with code examples.

### Project Structure

```
src/
├── index.ts              # Entry point, transport selection
├── server.ts             # MCP server, tool registration
├── config.ts             # Environment config (Zod-validated)
├── providers/            # One directory per jurisdiction
├── schemas/              # Zod schemas (trademark, design, patent)
├── tools/                # Tool implementations (one file per tool)
├── transport/            # stdio and HTTP transports
├── cache/                # Memory and file cache
├── analytics/            # In-memory metrics collection
├── keys/                 # API key store, quotas, rate limiting
├── errors/               # TrademarkError, ErrorCode enum
└── utils/                # Rate limiter, retry, similarity, phonetics
```

### Development Commands

```bash
npm run build        # Build self-contained bundle (dist/index.js)
npm run typecheck    # TypeScript type checking
npm test             # Run vitest tests
npm run ci           # Full CI pipeline (typecheck + lint + test + build)
npm run dev          # Dev mode (stdio transport via tsx)
npm run dev:chatgpt  # Dev mode (HTTP/ChatGPT transport)
```

For more on the architecture, see [Architecture Overview](/architecture/overview/) and [Transport Layer](/architecture/transport/).
