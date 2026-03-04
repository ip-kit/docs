---
title: "trademark_status"
description: "Retrieve full details and current status for a specific trademark registration."
---

Look up comprehensive details for a trademark by its application or registration number in a specific jurisdiction. Returns current status, goods and services, applicant information, and optionally prosecution history and documents.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| identifier | string | Yes | Registration number or application/serial number |
| jurisdiction | string | Yes | Trademark jurisdiction: US, EU, AU, NZ, WIPO, GB, CA, JP, or CN |
| includeHistory | boolean | No | Include status change history (default: false) |
| includeDocuments | boolean | No | Include list of associated documents (default: false) |

## Example

### Request
```json
{
  "name": "trademark_status",
  "arguments": {
    "identifier": "018734521",
    "jurisdiction": "EU",
    "includeHistory": true
  }
}
```

### Response
```json
{
  "trademark": {
    "id": "EU-018734521",
    "applicationNumber": "018734521",
    "registrationNumber": "018734521",
    "name": "NEXTERA",
    "jurisdiction": "EU",
    "status": "registered",
    "statusDescription": "Registered",
    "filingDate": "2023-02-14",
    "registrationDate": "2023-08-30",
    "niceClasses": [9, 35, 42],
    "owner": "NextEra Digital Solutions B.V.",
    "markType": "Word",
    "goodsAndServices": [
      { "classNumber": 9, "description": "Computer software for data analytics and business intelligence" },
      { "classNumber": 35, "description": "Business consulting services" },
      { "classNumber": 42, "description": "Software as a service (SaaS) for data processing" }
    ],
    "applicant": {
      "name": "NextEra Digital Solutions B.V.",
      "address": "Keizersgracht 123, 1015 CJ Amsterdam",
      "country": "NL"
    },
    "expirationDate": "2033-02-14"
  },
  "currentStatus": {
    "code": "registered",
    "description": "Registered",
    "date": "2023-08-30",
    "isLive": true
  },
  "history": [
    { "date": "2023-02-14", "code": "filed", "description": "Application filed" },
    { "date": "2023-05-20", "code": "published", "description": "Published for opposition" },
    { "date": "2023-08-30", "code": "registered", "description": "Registration completed" }
  ]
}
```

## Notes
- The `identifier` is the raw number without jurisdiction prefix. Use `jurisdiction` to specify which registry to query.
- Status is normalized to: `registered`, `pending`, `abandoned`, `cancelled`, `expired`, `opposed`, or `unknown`.
- Provider-specific fields like `attorney`, `oppositionDeadline`, and `seniorityClaimed` are included when available from the source registry.

## Related Tools
- [trademark_search](/reference/tools/trademark/trademark-search/) -- find trademarks by name, owner, or number
- [trademark_clearance](/reference/tools/trademark/trademark-clearance/) -- analyze conflicts for a proposed mark
