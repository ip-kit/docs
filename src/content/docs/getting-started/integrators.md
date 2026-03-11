---
title: "Embed IPKit in Your Platform"
description: "Integration guide for platform builders embedding IP search and clearance into SaaS products via IPKit's HTTP transport."
---

IPKit runs as an HTTP server with API key authentication, per-key rate limiting, and usage quotas. You can embed it into your platform by connecting to the hosted instance at `ipkit.fly.dev` or by self-hosting your own deployment.

## HTTP Transport Setup

### Using the Hosted Instance

The fastest path to integration is the hosted server at `https://ipkit.fly.dev/mcp`. All provider credentials are pre-configured, and the server is managed by the IPKit team.

Send MCP protocol requests to the endpoint with your API key:

```bash
curl -X POST https://ipkit.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "trademark_search",
      "arguments": {
        "query": "CloudBooks",
        "jurisdiction": "US",
        "searchType": "name"
      }
    }
  }'
```

### Self-Hosted Setup

To run your own instance, set the transport mode and configure API keys:

```bash
export TRANSPORT=http
export HTTP_PORT=3000
export HTTP_HOST=0.0.0.0
export API_KEYS=sk-client-abc123,sk-client-def456
export USPTO_API_KEY=your_key
export EUIPO_CLIENT_ID=your_id
export EUIPO_CLIENT_SECRET=your_secret
export IPAUSTRALIA_CLIENT_ID=your_id
export IPAUSTRALIA_CLIENT_SECRET=your_secret
export EPO_CONSUMER_KEY=your_key
export EPO_CONSUMER_SECRET=your_secret

node dist/index.js
```

The server starts on the configured host and port, accepting MCP requests at `POST /mcp`.

### Connecting from Claude Desktop

If your users run Claude Desktop, they can connect to your self-hosted instance or the hosted server:

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

Replace the URL with your self-hosted endpoint if applicable.

:::caution
Never expose API keys in client-side code, browser requests, or public repositories. API keys should only be used in server-to-server communication. For client-facing applications, proxy requests through your own backend.
:::

## API Key Authentication

When `API_KEYS` is set, every request to `/mcp` must include a valid key in the `Authorization` header:

```
Authorization: Bearer sk-client-abc123
```

Requests without a valid key receive a `401 Unauthorized` response. The server checks keys against SHA-256 hashes, so plaintext keys are never stored on disk.

### Simple Key Setup

For basic authentication, set a comma-separated list of keys:

```bash
API_KEYS=sk-client-abc123,sk-client-def456
```

All keys share the same default quotas and rate limits.

### Admin Key

Set `ADMIN_API_KEY` for access to management endpoints like `GET /metrics`:

```bash
ADMIN_API_KEY=sk-admin-xyz789
```

The admin key can also be used for regular tool calls.

## Per-Key Configuration

For production deployments with multiple tenants, use a JSON configuration file to assign labels, tiers, and custom quotas to each key.

Set the path to the config file:

```bash
API_KEYS_CONFIG=/etc/ipkit/keys.json
```

### Configuration File Format

```json
[
  {
    "keyHash": "sha256-hex-of-plaintext-key",
    "label": "Acme Corp — Production",
    "tier": "pro",
    "enabled": true,
    "createdAt": "2025-01-15T00:00:00Z",
    "quotas": {
      "daily": 5000,
      "monthly": 50000
    }
  },
  {
    "keyHash": "sha256-hex-of-another-key",
    "label": "StartupCo — Free Trial",
    "tier": "free",
    "enabled": true,
    "createdAt": "2025-03-01T00:00:00Z"
  }
]
```

Generate a key hash:

```bash
echo -n "sk-client-abc123" | shasum -a 256 | cut -d' ' -f1
```

### Tiers and Default Quotas

Keys that do not specify custom quotas inherit defaults from their tier:

| Setting | Free | Pro | Enterprise |
|---------|------|-----|------------|
| Daily limit | 100 calls | 1,000 calls | Unlimited |
| Monthly limit | 1,000 calls | 10,000 calls | Unlimited |
| Concurrent requests | 2 | 10 | Unlimited |
| Sustained rate | 100/hour | 600/hour | Unlimited |
| Burst rate | 5/second | 20/second | Unlimited |

Custom quotas in the config file override these defaults. Set any value to `0` for unlimited.

## Rate Limiting

IPKit enforces two layers of rate limiting per API key:

1. **Quota tracking** -- daily and monthly call caps. Daily quotas reset at midnight UTC; monthly on the first of each month.
2. **Sliding window** -- dual token-bucket algorithm with sustained rate (e.g., 600/hour) and burst rate (e.g., 20/second). Both buckets must have tokens for a request to proceed.

When either limit is exceeded, the server responds with:

```
HTTP 429 Too Many Requests
Retry-After: <seconds>
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1709337600
```

### Handling 429 Responses

Your integration should implement retry logic with backoff. The `Retry-After` header tells you exactly how long to wait:

```javascript
async function callIPKit(tool, args, apiKey) {
  const response = await fetch('https://ipkit.fly.dev/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: { name: tool, arguments: args },
    }),
  });

  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '5', 10);
    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
    return callIPKit(tool, args, apiKey);  // Retry once
  }

  return response.json();
}
```

## Available Tools

IPKit exposes 27 tools across trademarks, designs, patents, and monitoring. Here is a summary by category:

| Category | Tools | Description |
|----------|-------|-------------|
| Trademark Search | `trademark_search`, `trademark_status`, `trademark_clearance`, `distinctiveness_hints` | Core search, clearance, and analysis |
| Nice Classification | `nice_class_lookup`, `suggest_nice_classes` | Class lookup and recommendation |
| Goods & Services | `generate_gs_specification`, `validate_gs_terms`, `translate_gs_terms` | Draft, validate, and translate G&S specs |
| EU Designs | `eu_design_search`, `eu_design_status` | EU Community Design registrations |
| AU Designs | `au_design_search`, `au_design_status` | Australian design registrations |
| AU Patents | `au_patent_search`, `au_patent_status` | Australian patents |
| EP Patents | `ep_patent_search`, `ep_patent_status`, `patent_family_search` | European patents and INPADOC families |
| Persons | `eu_person_lookup`, `eu_applicant_portfolio` | EUIPO applicants and representatives |
| Monitoring | `create_watch`, `list_watches`, `manage_watch`, `get_watch_events`, `acknowledge_events` | Trademark status monitoring |
| Webhooks | `register_webhook`, `manage_webhook`, `get_delivery_log` | Event delivery to external endpoints |
| Analytics | `portfolio_analytics` | Portfolio health scoring |

See the [Tool Reference](/reference/tools/trademark/trademark-search/) for complete input schemas and response formats.

## Webhook Integration

Register a webhook endpoint to receive monitoring events as HTTP POST requests:

```bash
curl -X POST https://ipkit.fly.dev/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "register_webhook",
      "arguments": {
        "url": "https://your-app.com/webhooks/ipkit",
        "secret": "your-hmac-secret",
        "events": ["status_change", "similar_filing", "deadline_approaching"]
      }
    }
  }'
```

Events are delivered as JSON payloads with:

- **HMAC-SHA256 signature** in the request header (verify using your shared secret)
- **Automatic retries** with exponential backoff (up to 3 attempts for failed deliveries)
- **Delivery log** accessible via the `get_delivery_log` tool for debugging

Use `manage_webhook` to enable, disable, delete, or send test events to your endpoint.

## Analytics Endpoint

The `GET /metrics` endpoint returns a real-time snapshot of server health and usage:

```bash
curl https://ipkit.fly.dev/metrics \
  -H "Authorization: Bearer YOUR_ADMIN_KEY"
```

The response includes:

- **Per-tool statistics:** call count, latency percentiles (P50/P95/P99), error rates
- **Cache performance:** hit/miss ratios per cache type
- **Rate limiter pressure:** wait counts and durations per provider
- **Uptime and memory usage**

This endpoint requires the `ADMIN_API_KEY` when API key authentication is enabled.

## Docker Deployment

Build and run IPKit in a container:

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY dist/index.js .
ENV TRANSPORT=http
ENV HTTP_HOST=0.0.0.0
ENV HTTP_PORT=3000
EXPOSE 3000
CMD ["node", "index.js"]
```

```bash
docker build -t ipkit .
docker run -p 3000:3000 \
  -e API_KEYS=sk-client-abc123 \
  -e USPTO_API_KEY=your_key \
  -e EUIPO_CLIENT_ID=your_id \
  -e EUIPO_CLIENT_SECRET=your_secret \
  ipkit
```

The `dist/index.js` bundle is self-contained (approximately 1.6 MB) with no `node_modules` dependency. Only Node 20+ is required in the container.

### Persistent Data

For monitoring watches, webhook registrations, and file-based caching, mount volumes:

```bash
docker run -p 3000:3000 \
  -v /data/ipkit/cache:/app/cache \
  -v /data/ipkit/data:/app/data \
  -e CACHE_DIR=/app/cache \
  -e DATA_DIR=/app/data \
  -e API_KEYS=sk-client-abc123 \
  ipkit
```

## Fly.io Deployment

IPKit is designed for single-machine deployment on Fly.io:

```bash
# Install flyctl if needed
curl -L https://fly.io/install.sh | sh

# From the project root
fly launch          # First-time setup
fly secrets set \
  API_KEYS=sk-client-abc123 \
  USPTO_API_KEY=your_key \
  EUIPO_CLIENT_ID=your_id \
  EUIPO_CLIENT_SECRET=your_secret

fly deploy --ha=false    # Single machine, auto-stop enabled
```

The `--ha=false` flag ensures a single machine deployment. Fly.io auto-stop will suspend the machine when idle and restart it on the next request (cold start takes a few seconds; OAuth pre-warming reduces first-request latency).

Set secrets via `fly secrets set` rather than including them in the deployment. They are injected as environment variables at runtime.

## Integration Checklist

Before going to production:

- [ ] **API keys configured** -- set `API_KEYS` or `API_KEYS_CONFIG` for all client keys
- [ ] **Admin key set** -- `ADMIN_API_KEY` for metrics access
- [ ] **Rate limits tuned** -- adjust per-key quotas to match your pricing tiers
- [ ] **429 handling** -- client retries with `Retry-After` header
- [ ] **Webhook verification** -- HMAC-SHA256 signature check on your receiving endpoint
- [ ] **Monitoring** -- poll `GET /metrics` or set up alerting on error rates
- [ ] **Provider credentials** -- all required jurisdiction API keys configured
- [ ] **Persistent storage** -- `DATA_DIR` and `CACHE_DIR` volumes mounted if using monitoring features
