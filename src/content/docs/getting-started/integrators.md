---
title: "Embed IPKit in Your Platform"
description: "Integration guide for platform builders embedding IP search and clearance into SaaS products via IPKit's HTTP API."
---

IPKit runs as an HTTP server with API key authentication, rate limiting, and usage quotas. Connect to the hosted instance at `https://ipkit.fly.dev/mcp` to embed IP intelligence into your platform.

## Connecting to the API

Send MCP protocol requests to the hosted endpoint with your API key:

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

All provider credentials are pre-configured on the hosted server. You only need your own API key.

### Connecting from Claude Desktop

If your users run Claude Desktop, they can connect directly:

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

:::caution
Never expose API keys in client-side code, browser requests, or public repositories. API keys should only be used in server-to-server communication. For client-facing applications, proxy requests through your own backend.
:::

## Authentication

Every request must include a valid API key in the `Authorization` header:

```
Authorization: Bearer YOUR_API_KEY
```

Requests without a valid key receive a `401 Unauthorized` response.

## Rate Limiting

IPKit enforces per-key rate limits. When limits are exceeded, the server responds with:

```
HTTP 429 Too Many Requests
Retry-After: <seconds>
```

Your integration should respect the `Retry-After` header and retry after the specified delay.

## Available Tools

IPKit exposes tools across trademarks, designs, patents, and monitoring:

| Category | Tools | Description |
|----------|-------|-------------|
| Trademark Search | `trademark_search`, `trademark_status`, `trademark_clearance`, `distinctiveness_hints` | Core search, clearance, and analysis |
| Nice Classification | `nice_class_lookup`, `suggest_nice_classes` | Class lookup and recommendation |
| Goods & Services | `generate_gs_specification`, `validate_gs_terms`, `translate_gs_terms` | Draft, validate, and translate G&S specs |
| EU Designs | `eu_design_search`, `eu_design_status` | EU Community Design registrations |
| AU Designs | `au_design_search`, `au_design_status` | Australian design registrations |
| AU Patents | `au_patent_search`, `au_patent_status` | Australian patents |
| EP Patents | `ep_patent_search`, `ep_patent_status`, `patent_family_search` | European patents and INPADOC families |
| Lens.org Patents | `lens_patent_search`, `lens_patent_status`, `lens_prior_art` | Global patents with scholarly linkage |
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
