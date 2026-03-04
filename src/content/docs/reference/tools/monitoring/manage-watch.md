---
title: "manage_watch"
description: "Pause, resume, or delete an existing trademark monitoring watch."
---

Manage the lifecycle of an existing watch. Paused watches stop polling but retain their configuration and event history. Deleted watches are removed permanently.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| watchId | string | Yes | Watch ID to manage |
| action | string | Yes | `pause`, `resume`, or `delete` |

## Example

### Request
```json
{
  "name": "manage_watch",
  "arguments": {
    "watchId": "w_abc123def456",
    "action": "pause"
  }
}
```

### Response
```json
{
  "success": true,
  "message": "Watch w_abc123def456 paused."
}
```

## Notes
- Paused watches retain their configuration and event history. Use `resume` to reactivate polling.
- Deleted watches are permanent -- all configuration and history is removed.
- Returns `success: false` if the watch ID is not found.

## Related Tools
- [list_watches](/reference/tools/monitoring/list-watches/) -- find watch IDs
- [create_watch](/reference/tools/monitoring/create-watch/) -- create a replacement watch
- [get_watch_events](/reference/tools/monitoring/get-watch-events/) -- review events before deleting
