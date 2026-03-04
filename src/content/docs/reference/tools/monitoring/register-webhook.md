---
title: "register_webhook"
description: "Register a webhook endpoint to receive monitoring events via HTTP POST."
---

Register an HTTPS endpoint to receive monitoring events as HTTP POST requests. Supports HMAC-SHA256 signature verification for secure delivery. Events are posted as JSON payloads.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | Human-readable name for this webhook (max 200 chars) |
| url | string | Yes | HTTPS endpoint URL to receive events |
| secret | string | No | Shared secret for HMAC-SHA256 signature verification (sent in `X-Signature-256` header) |
| eventTypes | string[] | No | Event types to receive: `status_change`, `similar_filing`, `deadline_approaching`. Empty array = all types. |

## Example

### Request
```json
{
  "name": "register_webhook",
  "arguments": {
    "name": "Slack IP Alerts",
    "url": "https://hooks.slack.com/triggers/T0123/ipkit-alerts",
    "secret": "whsec_a1b2c3d4e5f6",
    "eventTypes": ["status_change", "similar_filing"]
  }
}
```

### Response
```json
{
  "webhook": {
    "id": "wh_789abc012def",
    "name": "Slack IP Alerts",
    "url": "https://hooks.slack.com/triggers/T0123/ipkit-alerts",
    "hasSecret": true,
    "eventTypes": ["status_change", "similar_filing"],
    "enabled": true,
    "createdAt": "2024-03-04T10:00:00.000Z"
  },
  "message": "Webhook \"Slack IP Alerts\" registered. Events will be POSTed to https://hooks.slack.com/triggers/T0123/ipkit-alerts",
  "tip": "Verify deliveries using the X-Signature-256 header (HMAC-SHA256)."
}
```

## Notes
- Webhook payloads include: `id`, `type`, `severity`, `summary`, `detectedAt`, `watchId`, and `details`.
- When a `secret` is provided, each delivery includes an `X-Signature-256` header containing the HMAC-SHA256 hex digest of the payload body.
- Deliveries are retried up to 3 times with exponential backoff on failure.
- Empty `eventTypes` subscribes to all event types.

## Related Tools
- [manage_webhook](/reference/tools/monitoring/manage-webhook/) -- enable, disable, delete, or test a webhook
- [get_delivery_log](/reference/tools/monitoring/get-delivery-log/) -- view delivery history and failures
- [create_watch](/reference/tools/monitoring/create-watch/) -- create watches that generate events
