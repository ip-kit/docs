---
title: "portfolio_analytics"
description: "Aggregate health overview of your monitored trademark portfolio."
---

Produces a comprehensive analytics snapshot across all monitoring watches. Includes coverage summary, upcoming deadlines sorted by urgency, unresolved alerts by severity, recent events, a composite health score (0-100), and actionable recommendations.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| includeInactive | boolean | No | Include paused watches in analysis (default: false) |

## Example

### Request
```json
{
  "name": "portfolio_analytics",
  "arguments": {
    "includeInactive": false
  }
}
```

### Response
```json
{
  "totalWatches": 5,
  "watchesByType": {
    "status_change": 3,
    "similar_filing": 1,
    "deadline_approaching": 1
  },
  "watchesByJurisdiction": {
    "US": 2,
    "EU": 3
  },
  "monitoredClasses": [9, 25, 35, 42],
  "upcomingDeadlines": [
    {
      "watchId": "w_deadline001",
      "watchName": "BRIGHTPATH EU renewal",
      "trademarkId": "EU-017234567",
      "deadlineType": "renewal",
      "deadlineDate": "2024-04-15",
      "daysRemaining": 42,
      "severity": "warning"
    }
  ],
  "alertSummary": {
    "critical": 1,
    "warning": 3,
    "info": 7,
    "total": 11
  },
  "recentEvents": [
    {
      "id": "evt_12345",
      "watchName": "Monitor NEXTERA status",
      "type": "status_change",
      "severity": "critical",
      "summary": "NEXTERA (EU-018734521) status changed to cancellation_pending",
      "detectedAt": "2024-03-04T09:15:00.000Z",
      "acknowledged": false
    }
  ],
  "healthScore": 72,
  "recommendations": [
    "1 critical alert requires immediate attention: NEXTERA cancellation proceeding.",
    "BRIGHTPATH EU renewal deadline in 42 days. Initiate renewal process.",
    "Consider adding similar_filing watches for your US trademarks to detect potential infringements."
  ]
}
```

## Notes
- The health score (0-100) is a composite metric factoring in: unacknowledged critical alerts (heavy penalty), approaching deadlines, watch coverage gaps, and overall portfolio size.
- Recommendations are generated based on current alerts, deadline proximity, and coverage analysis.
- By default, paused watches are excluded. Set `includeInactive: true` to include them in the analysis.
- The `recentEvents` array shows the last 10 events regardless of acknowledgement status.

## Related Tools
- [get_watch_events](/reference/tools/monitoring/get-watch-events/) -- drill into specific events
- [acknowledge_events](/reference/tools/monitoring/acknowledge-events/) -- clear alerts to improve health score
- [create_watch](/reference/tools/monitoring/create-watch/) -- fill coverage gaps identified in recommendations
