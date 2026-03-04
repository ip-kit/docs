---
title: "eu_applicant_portfolio"
description: "Unified IP portfolio view across trademarks and designs for a given applicant."
---

Retrieves a combined portfolio of EU trademarks and registered community designs for a given applicant. Searches trademarks (via owner search) and designs (via applicant name) in parallel, then produces summary statistics including jurisdictions, Nice classes, Locarno classes, and live/total counts.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicantName | string | Yes | Name of the applicant/owner to search |
| includeDesigns | boolean | No | Include EU design registrations (default: true) |
| status | string | No | Filter by status: `all` (default), `live`, `dead`, or `pending` |
| limit | number | No | Maximum results per IP type (default: 20, range: 10-100) |
| compact | boolean | No | Return top 10 per category with total counts (default: false) |

## Example

### Request
```json
{
  "name": "eu_applicant_portfolio",
  "arguments": {
    "applicantName": "NextEra Digital Solutions",
    "status": "live",
    "limit": 10
  }
}
```

### Response
```json
{
  "applicantName": "NextEra Digital Solutions",
  "trademarks": [
    {
      "id": "EU-018734521",
      "applicationNumber": "018734521",
      "name": "NEXTERA",
      "jurisdiction": "EU",
      "status": "registered",
      "filingDate": "2023-02-14",
      "registrationDate": "2023-08-30",
      "niceClasses": [9, 35, 42],
      "owner": "NextEra Digital Solutions B.V."
    },
    {
      "id": "EU-018891234",
      "applicationNumber": "018891234",
      "name": "NEXTERA CLOUD",
      "jurisdiction": "EU",
      "status": "pending",
      "filingDate": "2024-01-08",
      "niceClasses": [9, 42],
      "owner": "NextEra Digital Solutions B.V."
    }
  ],
  "totalTrademarks": 2,
  "designs": [
    {
      "id": "EU-D-009123456-0001",
      "designNumber": "009123456-0001",
      "jurisdiction": "EU",
      "status": "registered",
      "filingDate": "2023-07-20",
      "registrationDate": "2023-07-20",
      "expiryDate": "2028-07-20",
      "locarnoClasses": ["14.04"]
    }
  ],
  "totalDesigns": 1,
  "summary": {
    "totalTrademarks": 2,
    "totalDesigns": 1,
    "liveTrademarks": 2,
    "liveDesigns": 1,
    "jurisdictions": ["EU"],
    "niceClasses": [9, 35, 42],
    "locarnoClasses": ["14.04"]
  },
  "metadata": {
    "executionTimeMs": 1850,
    "designsIncluded": true,
    "designsAvailable": true
  }
}
```

## Notes
- Trademark and design searches run in parallel for performance. If one fails, the other still returns results -- check `metadata.warnings` for partial failures.
- Design results include enriched applicant names from the Persons API when available.
- Use `compact: true` for streaming UIs to reduce payload size (returns top 10 per category with `totalTrademarks`/`totalDesigns` counts).
- Requires at least one provider to be configured. EUIPO credentials are needed for design results.

## Related Tools
- [eu_person_lookup](/reference/tools/person/eu-person-lookup/) -- find applicant identifiers by name
- [trademark_search](/reference/tools/trademark/trademark-search/) -- broader trademark search across all jurisdictions
- [eu_design_search](/reference/tools/design/eu-design-search/) -- detailed design search with more filters
