---
title: "get_delivery_log"
description: "View webhook delivery history with status codes, timestamps, and retry information."
---

Retrieve the delivery log for webhook endpoints. Shows delivery status, HTTP response codes, attempt counts, and error messages for debugging failed deliveries.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| webhookId | string | No | Filter by webhook ID. Omit for all webhooks. |
| status | string | No | Filter by delivery status: `pending`, `delivered`, `failed`, or `retrying` |
| limit | number | No | Maximum entries to return (default: 20, max: 100) |

## Example

### Request
```json
{
  "name": "get_delivery_log",
  "arguments": {
    "webhookId": "wh_789abc012def",
    "status": "failed",
    "limit": 5
  }
}
```

### Response
```json
{
  "deliveries": [
    {
      "id": "del_abc123",
      "webhookId": "wh_789abc012def",
      "eventId": "evt_12345",
      "status": "failed",
      "httpStatus": 503,
      "attempts": 3,
      "maxAttempts": 3,
      "firstAttemptAt": "2024-03-04T09:15:01.000Z",
      "lastAttemptAt": "2024-03-04T09:45:01.000Z",
      "lastError": "Service Unavailable"
    },
    {
      "id": "del_def456",
      "webhookId": "wh_789abc012def",
      "eventId": "evt_12340",
      "status": "failed",
      "httpStatus": 500,
      "attempts": 3,
      "maxAttempts": 3,
      "firstAttemptAt": "2024-03-03T14:20:01.000Z",
      "lastAttemptAt": "2024-03-03T14:50:01.000Z",
      "lastError": "Internal Server Error"
    }
  ],
  "total": 2,
  "summary": "Found 2 delivery log entries."
}
```

## Notes
- Delivery statuses: `pending` (queued), `delivered` (success), `failed` (all retries exhausted), `retrying` (will retry).
- Failed deliveries show `attempts` vs `maxAttempts` (default: 3) with exponential backoff.
- The `nextRetryAt` field appears for entries with status `retrying`.
- Use this tool to diagnose webhook connectivity issues before re-enabling a disabled webhook.

## Related Tools
- [manage_webhook](/reference/tools/monitoring/manage-webhook/) -- test or re-enable a webhook
- [register_webhook](/reference/tools/monitoring/register-webhook/) -- register a new endpoint if the current one is unreachable
