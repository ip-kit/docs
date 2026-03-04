---
title: "Transport Layer"
description: "How IPKit handles stdio, HTTP, and ChatGPT transports -- routing, authentication, rate limiting, and session management."
---

IPKit supports three transport modes, selected via the `TRANSPORT` environment variable. Each transport creates a fresh MCP `Server` instance per client session, enabling concurrent multi-tenant connections.

## Transport Overview

| Transport | Protocol | Use Case | Default Port |
|-----------|----------|----------|--------------|
| **stdio** | stdin/stdout | Claude Desktop, local development | N/A |
| **HTTP** | Streamable HTTP | Production hosting (Fly.io), self-hosted, API clients | 3000 |
| **ChatGPT** | SSE (Server-Sent Events) | ChatGPT Apps SDK connector via ngrok | 8787 |

## stdio Transport

The default transport for local development and Claude Desktop integration. Communication happens over standard input/output using the MCP SDK's `StdioServerTransport`.

```
Claude Desktop  <──stdin/stdout──>  IPKit MCP Server
```

### Configuration

No network configuration needed. Set `TRANSPORT=stdio` (or omit it, as stdio is the default).

### Characteristics

- Single-session: one client, one server
- No authentication (the client has direct access to the process)
- No CORS handling needed
- Logs go to stderr (stdout is reserved for MCP protocol messages)

### Claude Desktop Config

```json
{
  "mcpServers": {
    "ipkit": {
      "command": "node",
      "args": ["dist/index.js"],
      "env": {
        "USPTO_API_KEY": "your-key",
        "EUIPO_CLIENT_ID": "your-id",
        "EUIPO_CLIENT_SECRET": "your-secret"
      }
    }
  }
}
```

Or use the hosted server via `mcp-remote`:

```json
{
  "mcpServers": {
    "ipkit": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote",
        "https://ipkit.fly.dev/mcp",
        "--header", "Authorization:Bearer YOUR_API_KEY"
      ]
    }
  }
}
```

## HTTP Transport

Production transport using the MCP SDK's `StreamableHTTPServerTransport`. Supports multiple concurrent sessions, API key authentication, per-key rate limiting, and standard HTTP endpoints.

### Routes

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/mcp` | Send MCP messages (initialize or existing session) |
| `GET` | `/mcp` | Open SSE stream for an existing session |
| `DELETE` | `/mcp` | Terminate a session |
| `GET` | `/health` | Health check (always returns `{"status":"ok"}`) |
| `GET` | `/metrics` | Analytics snapshot (requires API key auth) |
| `GET` | `/usage` | All API key usage stats (requires API key auth) |
| `GET` | `/usage/:keyId` | Specific API key usage stats (requires API key auth) |
| `GET` | `/keys` | API key management (requires admin API key) |
| `OPTIONS` | `*` | CORS preflight (returns 204 with CORS headers) |

### Session Lifecycle

1. **Initialize** -- Client sends a `POST /mcp` with an MCP `initialize` request (no session ID header). The server creates a new `StreamableHTTPServerTransport` and `Server` instance, assigns a UUID session ID, and returns it in the `mcp-session-id` response header.

2. **Communicate** -- Subsequent requests include the `mcp-session-id` header. The server routes them to the matching transport instance.

3. **SSE Stream** -- Clients can open a `GET /mcp` connection with the session ID to receive server-initiated notifications via SSE.

4. **Terminate** -- A `DELETE /mcp` with the session ID closes the transport, removes the session from the map, and calls `server.close()`.

### Authentication

When `API_KEYS` is set, every request must include an `Authorization: Bearer <key>` header. Authentication is checked at the HTTP level before MCP dispatch.

When `API_KEYS` is empty, authentication is disabled (development mode).

The `API_KEYS_CONFIG` variable points to a JSON file with per-key settings (labels, quotas, tiers). The `KeyStore` resolves each incoming key to a `ResolvedKeyConfig` with:

- `keyId` -- hashed key identifier
- `label` -- human-readable name
- `tier` -- key tier (e.g., `free`, `pro`, `enterprise`)
- `quotas` -- daily/monthly call limits, rate limit windows, burst allowances
- `enabled` -- whether the key is active

### Per-Key Rate Limiting

When authentication is enabled, each API key has its own sliding-window rate limiter. The rate limiter uses a dual token-bucket design (sustained rate + burst allowance).

Rate limit information is returned in response headers:

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit` | Maximum requests per window |
| `X-RateLimit-Remaining` | Remaining requests in the current window |
| `X-RateLimit-Reset` | Unix timestamp when the window resets |
| `Retry-After` | Seconds to wait before retrying (only on 429) |

When the rate limit is exceeded, the server returns HTTP 429 before the MCP transport processes the request:

```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 5
}
```

### CORS

The HTTP transport sets permissive CORS headers on every response to support browser-based clients and `mcp-remote`:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, mcp-session-id
```

### Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `TRANSPORT` | `stdio` | Set to `http` to enable |
| `HTTP_PORT` | `3000` | Port to listen on |
| `HTTP_HOST` | `127.0.0.1` | Bind address (use `0.0.0.0` for external access) |
| `API_KEYS` | *(empty)* | Comma-separated API keys |
| `API_KEYS_CONFIG` | *(none)* | Path to per-key config JSON |
| `ADMIN_API_KEY` | *(none)* | Admin key for `/keys` endpoint |

### OAuth Pre-warming

On HTTP server startup, `prewarmOAuth()` eagerly fetches OAuth tokens for configured providers (EUIPO, IP Australia, EPO) in a fire-and-forget pattern. This reduces cold-start latency on the first request after deployment.

### Graceful Shutdown

On `SIGINT` or `SIGTERM`, the server:

1. Closes all active transport sessions
2. Clears the session map
3. Closes the HTTP server
4. Calls `destroyServices()` to clean up analytics emitters, cache intervals, and watchers

## ChatGPT Transport

SSE-based transport for the ChatGPT Apps SDK connector. Uses the MCP SDK's `SSEServerTransport` (the older protocol variant required by ChatGPT).

### Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/mcp` | Opens an SSE stream (creates a new session) |
| `POST` | `/mcp/messages?sessionId=...` | Sends messages to an existing session |
| `GET` | `/health` | Health check |
| `OPTIONS` | `/mcp`, `/mcp/messages` | CORS preflight |

### Session Lifecycle

1. **Connect** -- ChatGPT sends a `GET /mcp` to open an SSE stream. The server creates a new `SSEServerTransport` and `Server`, assigns a session ID, and begins streaming events.

2. **Message** -- ChatGPT sends tool calls via `POST /mcp/messages?sessionId=<id>`. The server routes the message to the matching transport.

3. **Disconnect** -- When the SSE connection closes, the session is cleaned up.

### Widget Support

The ChatGPT transport registers a trademark results widget as an MCP resource. This allows ChatGPT to render rich HTML UI for trademark search results, clearance reports, and analysis. The widget HTML is loaded from `src/widgets/trademark-results.html` at startup.

### Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `TRANSPORT` | `stdio` | Set to `chatgpt` to enable |
| `CHATGPT_PORT` | `8787` | Port to listen on |
| `CHATGPT_HOST` | `0.0.0.0` | Bind address |
| `API_KEYS` | *(empty)* | Comma-separated API keys |

### Connecting to ChatGPT

1. Start the server with `TRANSPORT=chatgpt`
2. Tunnel with ngrok: `ngrok http 8787`
3. Add a connector in ChatGPT Settings with the ngrok HTTPS URL + `/mcp`
4. Use the connector in ChatGPT conversations

## Transport Comparison

| Feature | stdio | HTTP | ChatGPT |
|---------|-------|------|---------|
| Multi-session | No | Yes | Yes |
| API key auth | No | Yes | Yes |
| Per-key rate limiting | No | Yes | No |
| Metrics endpoint | No | Yes | No |
| Usage tracking | No | Yes | Yes |
| Widget support | No | No | Yes |
| OAuth pre-warming | No | Yes | No |
| CORS | N/A | Yes | Yes |
