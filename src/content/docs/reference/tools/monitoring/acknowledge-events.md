---
title: "acknowledge_events"
description: "Mark monitoring events as acknowledged/read."
---

Acknowledge one or more watch events, marking them as read. Acknowledged events are still retrievable but excluded when filtering with `unacknowledgedOnly: true`.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| eventIds | string[] | Yes | Array of event IDs to mark as acknowledged (min: 1) |

## Example

### Request
```json
{
  "name": "acknowledge_events",
  "arguments": {
    "eventIds": ["evt_12345", "evt_12346", "evt_12347"]
  }
}
```

### Response
```json
{
  "acknowledged": 3,
  "total": 3,
  "message": "All 3 event(s) acknowledged."
}
```

## Notes
- If some event IDs are not found or were already acknowledged, the `acknowledged` count will be less than `total`. The `message` field explains the discrepancy.
- Acknowledging events does not delete them. They remain accessible through `get_watch_events` without the `unacknowledgedOnly` filter.

## Related Tools
- [get_watch_events](/reference/tools/monitoring/get-watch-events/) -- retrieve events to acknowledge
- [portfolio_analytics](/reference/tools/monitoring/portfolio-analytics/) -- view unacknowledged alert counts
