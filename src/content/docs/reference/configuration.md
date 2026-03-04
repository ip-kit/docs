---
title: "Configuration Reference"
description: "Complete list of environment variables for configuring the IPKit MCP server."
---

IPKit is configured entirely through environment variables. In local development, set them in a `.env` file. In production (Fly.io), set them via `fly secrets set`. In Claude Desktop, use the `env` field in the MCP server config.

## Transport

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `TRANSPORT` | `stdio` \| `http` \| `chatgpt` | `stdio` | Server transport mode. `stdio` for Claude Desktop, `http` for hosted/self-hosted, `chatgpt` for ChatGPT Apps SDK. |
| `HTTP_PORT` | number | `3000` | Port for HTTP transport |
| `HTTP_HOST` | string | `127.0.0.1` | Bind address for HTTP transport |
| `CHATGPT_PORT` | number | `8787` | Port for ChatGPT SSE transport |
| `CHATGPT_HOST` | string | `0.0.0.0` | Bind address for ChatGPT transport |

## Authentication

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `API_KEYS` | string | *(empty)* | Comma-separated list of valid API keys for HTTP/ChatGPT transport. When empty, authentication is disabled. |
| `API_KEYS_CONFIG` | string | *(none)* | Path to a JSON file with per-key configuration (labels, quotas, tiers). Takes precedence over `API_KEYS` for key-level settings. |
| `ADMIN_API_KEY` | string | *(none)* | Admin API key for the `GET /keys` management endpoint. Must be set separately from `API_KEYS`. |

## Provider Credentials

### USPTO

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `USPTO_API_KEY` | string | *(none)* | API key from the USPTO developer portal |

### EUIPO

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `EUIPO_CLIENT_ID` | string | *(none)* | OAuth2 client ID for the EUIPO API |
| `EUIPO_CLIENT_SECRET` | string | *(none)* | OAuth2 client secret for the EUIPO API |
| `EUIPO_SANDBOX_CLIENT_ID` | string | *(none)* | Sandbox OAuth2 client ID (for testing) |
| `EUIPO_SANDBOX_CLIENT_SECRET` | string | *(none)* | Sandbox OAuth2 client secret (for testing) |

### IP Australia

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `IPAUSTRALIA_CLIENT_ID` | string | *(none)* | OAuth2 client ID for IP Australia APIs |
| `IPAUSTRALIA_CLIENT_SECRET` | string | *(none)* | OAuth2 client secret for IP Australia APIs |

### IPONZ

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `IPONZ_API_KEY` | string | *(none)* | API key for the IPONZ API |

### EPO

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `EPO_CONSUMER_KEY` | string | *(none)* | OAuth2 consumer key for EPO Open Patent Services |
| `EPO_CONSUMER_SECRET` | string | *(none)* | OAuth2 consumer secret for EPO Open Patent Services |

## Provider Toggles

Each provider can be individually enabled or disabled. All providers are enabled by default. Set to `false` to disable.

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ENABLE_USPTO` | boolean | `true` | Enable/disable USPTO provider |
| `ENABLE_EUIPO` | boolean | `true` | Enable/disable EUIPO provider |
| `ENABLE_IPAUSTRALIA` | boolean | `true` | Enable/disable IP Australia provider |
| `ENABLE_IPONZ` | boolean | `true` | Enable/disable IPONZ provider |
| `ENABLE_WIPO` | boolean | `true` | Enable/disable WIPO provider |
| `ENABLE_UKIPO` | boolean | `true` | Enable/disable UKIPO provider |
| `ENABLE_CIPO` | boolean | `true` | Enable/disable CIPO provider |
| `ENABLE_JPO` | boolean | `true` | Enable/disable JPO provider |
| `ENABLE_CNIPA` | boolean | `true` | Enable/disable CNIPA provider |
| `ENABLE_EPO` | boolean | `true` | Enable/disable EPO provider |

## Provider Environments

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `EUIPO_SANDBOX` | boolean | `false` | Use the EUIPO sandbox environment instead of production. Requires sandbox credentials. |
| `IPAUSTRALIA_TEST_ENV` | boolean | `false` | Use the IP Australia test environment instead of production |

## Rate Limits

Per-provider rate limits in requests per minute. These are self-imposed limits to avoid overwhelming upstream APIs.

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `USPTO_RATE_LIMIT` | number | `60` | USPTO requests per minute |
| `EUIPO_RATE_LIMIT` | number | `60` | EUIPO requests per minute |
| `IPAUSTRALIA_RATE_LIMIT` | number | `500` | IP Australia requests per minute (shared across trademarks, designs, and patents) |
| `IPONZ_RATE_LIMIT` | number | `60` | IPONZ requests per minute |
| `WIPO_RATE_LIMIT` | number | `30` | WIPO requests per minute |
| `UKIPO_RATE_LIMIT` | number | `30` | UKIPO requests per minute |
| `CIPO_RATE_LIMIT` | number | `30` | CIPO requests per minute |
| `JPO_RATE_LIMIT` | number | `30` | JPO requests per minute |
| `CNIPA_RATE_LIMIT` | number | `30` | CNIPA requests per minute |
| `EPO_RATE_LIMIT` | number | `30` | EPO requests per minute |

## Timeouts

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `EUIPO_FETCH_TIMEOUT_MS` | number | `15000` | EUIPO request timeout in milliseconds (min: 1000, max: 120000) |
| `IPAUSTRALIA_FETCH_TIMEOUT_MS` | number | `15000` | IP Australia request timeout in milliseconds (min: 1000, max: 120000) |
| `DEFAULT_FETCH_TIMEOUT_MS` | number | `15000` | Default timeout for providers without a dedicated timeout setting (min: 1000, max: 120000) |

## URLs

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `USPTO_BASE_URL` | string | `https://tsdrapi.uspto.gov` | Base URL for the USPTO TSDR API |
| `USPTO_ODP_BASE_URL` | string | `https://api.uspto.gov/api/v1` | Base URL for the USPTO Open Data Portal API |
| `USPTO_USE_ODP` | boolean | `false` | Use the USPTO Open Data Portal instead of the legacy TSDR API |

## Cache

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `CACHE_TTL_SEARCH` | number | `300` | Time-to-live for search result caches in seconds (5 minutes) |
| `CACHE_TTL_STATUS` | number | `3600` | Time-to-live for status lookup caches in seconds (1 hour) |
| `CACHE_TTL_CLASS` | number | `86400` | Time-to-live for Nice class and G&S caches in seconds (24 hours) |
| `CACHE_DIR` | string | *(none)* | Directory for persistent file-based cache. When unset, IPKit uses in-memory caching (volatile). |

## Storage

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DATA_DIR` | string | *(none)* | Directory for persistent data storage (watches, events, webhooks). Falls back to `CACHE_DIR`, then `.trademark-data/`. |

## Monitoring

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `WATCH_POLL_INTERVAL` | number | *(none)* | Polling interval for trademark watches in seconds (minimum: 60). When unset, uses the watcher's internal default. |
| `WATCH_AUTO_START` | boolean | `false` | Automatically start the trademark watcher on server startup |

## Logging

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `LOG_LEVEL` | `debug` \| `info` \| `warn` \| `error` | `info` | Minimum log level. Logs are written as structured JSON to stderr (stdout is reserved for the MCP protocol). |

## Analytics

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ANALYTICS_ENABLED` | boolean | `true` | Enable the in-memory analytics collector and structured log emission |
| `ANALYTICS_INTERVAL_MS` | number | `60000` | Interval in milliseconds between periodic metrics log flushes (minimum: 1000) |

## Example `.env` File

```bash
# Transport
TRANSPORT=http
HTTP_PORT=3000

# Authentication
API_KEYS=key-abc123,key-def456
ADMIN_API_KEY=admin-secret-key

# Provider credentials
USPTO_API_KEY=your-uspto-key
EUIPO_CLIENT_ID=your-euipo-client-id
EUIPO_CLIENT_SECRET=your-euipo-secret
IPAUSTRALIA_CLIENT_ID=your-ipau-client-id
IPAUSTRALIA_CLIENT_SECRET=your-ipau-secret
IPONZ_API_KEY=your-iponz-key
EPO_CONSUMER_KEY=your-epo-key
EPO_CONSUMER_SECRET=your-epo-secret

# Rate limits (optional — defaults are sensible)
USPTO_RATE_LIMIT=60
EUIPO_RATE_LIMIT=60
IPAUSTRALIA_RATE_LIMIT=500

# Cache
CACHE_TTL_SEARCH=300
CACHE_TTL_STATUS=3600

# Logging
LOG_LEVEL=info
```
