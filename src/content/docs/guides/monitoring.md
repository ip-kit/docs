---
title: Monitoring & Webhooks
description: How to set up trademark watches, manage webhook delivery, and track portfolio health using IPKit's monitoring tools.
---

IPKit provides a monitoring system that watches for changes to trademarks and delivers alerts via webhooks or in-app events. You can monitor status changes, detect similar new filings, and track approaching deadlines.

Monitoring requires persistent storage. Set the `DATA_DIR` environment variable to a writable directory path where watch configurations and event history are stored between server restarts.

## Watch types

There are three types of watches:

| Type | Monitors | Required field |
|------|----------|---------------|
| `status_change` | Status transitions on a specific mark (e.g., pending to registered) | `trademarkId` |
| `similar_filing` | New filings similar to a monitored mark name | `markName` |
| `deadline_approaching` | Upcoming opposition, renewal, or expiration deadlines | `trademarkId` |

## Creating watches

### Status change watch

Monitor when a specific trademark changes status:

```json
{
  "name": "Watch AURORA US registration",
  "type": "status_change",
  "trademarkId": "US-97123456",
  "jurisdictions": ["US"]
}
```

Response:

```json
{
  "watch": {
    "id": "w_abc123",
    "name": "Watch AURORA US registration",
    "type": "status_change",
    "enabled": true,
    "trademarkId": "US-97123456",
    "jurisdictions": ["US"],
    "createdAt": "2024-06-15T10:30:00Z"
  },
  "message": "Watch \"Watch AURORA US registration\" created successfully. It will start monitoring on the next poll cycle."
}
```

### Similar filing watch

Detect new trademark filings that could conflict with your mark:

```json
{
  "name": "Monitor for AURORA lookalikes",
  "type": "similar_filing",
  "markName": "AURORA",
  "jurisdictions": ["US", "EU"],
  "niceClasses": [9, 42],
  "similarityThreshold": 0.7
}
```

The `similarityThreshold` controls how similar a new filing must be to trigger an alert. The default of 0.7 catches phonetic and visual variants while filtering out unrelated marks.

### Deadline watch

Get alerts before important deadlines expire:

```json
{
  "name": "AURORA renewal deadline",
  "type": "deadline_approaching",
  "trademarkId": "US-97123456",
  "deadlineDaysAhead": 60
}
```

The `deadlineDaysAhead` parameter controls how far in advance you receive alerts. The default is 30 days.

## Managing watches

### List all watches

```json
{
  "type": "similar_filing",
  "enabled": true
}
```

Both `type` and `enabled` filters are optional. Omit them to list all watches.

### Pause, resume, or delete

Use `manage_watch` with the watch ID:

```json
{
  "watchId": "w_abc123",
  "action": "pause"
}
```

Available actions:
- `pause` -- stop polling without deleting the watch
- `resume` -- restart a paused watch
- `delete` -- permanently remove the watch and its history

## Working with events

### Retrieving events

Use `get_watch_events` to see what the monitoring system has detected:

```json
{
  "watchId": "w_abc123",
  "severity": "warning",
  "unacknowledgedOnly": true,
  "limit": 20
}
```

Events include a severity level:
- **info** -- routine status updates (e.g., mark published)
- **warning** -- changes that need attention (e.g., similar filing detected)
- **critical** -- urgent issues (e.g., opposition filed, deadline imminent)

### Event details

Each event includes structured details that vary by type:

**Status change event:**
```json
{
  "id": "evt_xyz789",
  "watchId": "w_abc123",
  "type": "status_change",
  "severity": "info",
  "detectedAt": "2024-07-01T14:20:00Z",
  "summary": "AURORA (US-97123456) status changed from pending to registered",
  "details": {
    "trademarkId": "US-97123456",
    "trademarkName": "AURORA",
    "jurisdiction": "US",
    "previousStatus": "pending",
    "newStatus": "registered",
    "statusDate": "2024-07-01"
  },
  "acknowledged": false
}
```

**Similar filing event:**
```json
{
  "id": "evt_abc456",
  "watchId": "w_def789",
  "type": "similar_filing",
  "severity": "warning",
  "summary": "New filing AURORRA (EU-019000001) is 85% similar to AURORA",
  "details": {
    "monitoredMark": "AURORA",
    "similarMark": "AURORRA",
    "similarMarkId": "EU-019000001",
    "jurisdiction": "EU",
    "similarityScore": 0.85,
    "conflictType": "visual",
    "overlappingClasses": [9, 42],
    "owner": "Aurorra Digital S.L."
  }
}
```

### Acknowledging events

Mark events as read to track which have been reviewed:

```json
{
  "eventIds": ["evt_xyz789", "evt_abc456"]
}
```

## Webhook delivery

Webhooks deliver events to your HTTP endpoint in real time.

### Registering a webhook

```json
{
  "name": "Slack alerting webhook",
  "url": "https://your-server.com/webhooks/ipkit",
  "secret": "your-hmac-secret-key",
  "eventTypes": ["status_change", "similar_filing"]
}
```

The `secret` enables HMAC-SHA256 signature verification. When set, each delivery includes an `X-Signature-256` header containing the HMAC of the payload body. Verify this on your server to confirm the webhook came from IPKit.

The `eventTypes` array filters which events are delivered. An empty array (default) delivers all event types.

### Webhook payload format

```json
{
  "id": "evt_xyz789",
  "type": "status_change",
  "severity": "info",
  "summary": "AURORA (US-97123456) status changed from pending to registered",
  "detectedAt": "2024-07-01T14:20:00Z",
  "watchId": "w_abc123",
  "details": { }
}
```

### Managing webhooks

Use `manage_webhook` to control webhook endpoints:

```json
{
  "webhookId": "wh_123",
  "action": "test"
}
```

Available actions:
- `enable` -- activate a disabled webhook
- `disable` -- stop deliveries without deleting
- `delete` -- permanently remove the webhook
- `test` -- send a test event to verify connectivity

### Troubleshooting deliveries

Use `get_delivery_log` to see delivery history and diagnose failures:

```json
{
  "webhookId": "wh_123",
  "status": "failed",
  "limit": 10
}
```

Each delivery log entry includes:
- `status` -- pending, delivered, failed, or retrying
- `httpStatus` -- HTTP response code from your endpoint
- `attempts` / `maxAttempts` -- retry count (default max: 3)
- `lastError` -- error message from the most recent failed attempt
- `nextRetryAt` -- when the next retry is scheduled

## Portfolio analytics

Use `portfolio_analytics` for an aggregate health overview of all watches and events:

```json
{
  "includeInactive": false
}
```

The response provides a summary of active watches, recent events by severity, and overall portfolio health. This is useful for dashboards and periodic review of your IP monitoring posture.

## Setting up a complete monitoring pipeline

Here is a recommended workflow for monitoring a trademark:

1. **Find the trademark**: Use `trademark_search` to locate the mark and note its ID
2. **Create a status watch**: Monitor for status transitions
3. **Create a similar filing watch**: Detect new conflicting filings
4. **Create a deadline watch**: Get advance warning of deadlines
5. **Register a webhook**: Deliver alerts to your notification system
6. **Verify**: Use `list_watches` to confirm everything is active, then `manage_webhook` with `action: "test"` to verify delivery

IPKit also includes a `watch-setup` MCP prompt that guides AI assistants through this entire workflow automatically.

## Related tools

- [`create_watch`](../reference/tools/monitoring/) -- set up a new monitoring watch
- [`list_watches`](../reference/tools/monitoring/) -- list all watches
- [`manage_watch`](../reference/tools/monitoring/) -- pause, resume, or delete a watch
- [`get_watch_events`](../reference/tools/monitoring/) -- retrieve events
- [`acknowledge_events`](../reference/tools/monitoring/) -- mark events as read
- [`register_webhook`](../reference/tools/monitoring/) -- register a webhook endpoint
- [`manage_webhook`](../reference/tools/monitoring/) -- enable, disable, delete, or test a webhook
- [`get_delivery_log`](../reference/tools/monitoring/) -- view delivery history
- [`portfolio_analytics`](../reference/tools/monitoring/) -- aggregate health overview
