---
title: "manage_webhook"
description: "Enable, disable, delete, or test a registered webhook endpoint."
---

Manage the lifecycle of a registered webhook. Disabled webhooks stop receiving deliveries but retain their configuration. The test action sends a synthetic event to verify endpoint connectivity.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| webhookId | string | Yes | Webhook ID to manage |
| action | string | Yes | `enable`, `disable`, `delete`, or `test` |

## Example

### Request
```json
{
  "name": "manage_webhook",
  "arguments": {
    "webhookId": "wh_789abc012def",
    "action": "test"
  }
}
```

### Response
```json
{
  "success": true,
  "message": "Test event delivered successfully to webhook wh_789abc012def."
}
```

## Notes
- The `test` action sends a synthetic event to the webhook URL and reports whether the delivery succeeded.
- Disabled webhooks retain their configuration. Re-enable with `action: "enable"`.
- Deleted webhooks are removed permanently along with their delivery history.
- Returns `success: false` with an error message if the webhook ID is not found or the test delivery fails.

## Related Tools
- [register_webhook](/reference/tools/monitoring/register-webhook/) -- create a new webhook
- [get_delivery_log](/reference/tools/monitoring/get-delivery-log/) -- view delivery history after testing
