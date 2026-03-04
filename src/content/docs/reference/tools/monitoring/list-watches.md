---
title: "list_watches"
description: "List all trademark monitoring watches with optional filtering."
---

Retrieve all configured monitoring watches. Optionally filter by watch type or enabled/disabled status.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | No | Filter by watch type: `status_change`, `similar_filing`, or `deadline_approaching` |
| enabled | boolean | No | Filter by enabled (true) or disabled (false) |

## Example

### Request
```json
{
  "name": "list_watches",
  "arguments": {
    "type": "status_change",
    "enabled": true
  }
}
```

### Response
```json
{
  "watches": [
    {
      "id": "w_abc123def456",
      "name": "Monitor NEXTERA registration status",
      "type": "status_change",
      "enabled": true,
      "trademarkId": "EU-018734521",
      "jurisdictions": [],
      "niceClasses": [],
      "similarityThreshold": 0.7,
      "deadlineDaysAhead": 30,
      "createdAt": "2024-03-04T10:30:00.000Z",
      "lastCheckedAt": "2024-03-04T11:00:00.000Z"
    },
    {
      "id": "w_xyz789ghi012",
      "name": "Monitor BRIGHTPATH filing status",
      "type": "status_change",
      "enabled": true,
      "trademarkId": "US-97654321",
      "jurisdictions": ["US"],
      "niceClasses": [9, 42],
      "similarityThreshold": 0.7,
      "deadlineDaysAhead": 30,
      "createdAt": "2024-02-15T08:00:00.000Z",
      "lastCheckedAt": "2024-03-04T11:00:00.000Z"
    }
  ],
  "total": 2,
  "summary": "Found 2 watch(es)."
}
```

## Notes
- Omit both parameters to list all watches regardless of type or status.
- The `lastCheckedAt` field shows when the watch was last polled. A null value means the watch has not yet been checked.

## Related Tools
- [create_watch](/reference/tools/monitoring/create-watch/) -- set up a new watch
- [manage_watch](/reference/tools/monitoring/manage-watch/) -- pause, resume, or delete a watch
- [portfolio_analytics](/reference/tools/monitoring/portfolio-analytics/) -- aggregate health overview across all watches
