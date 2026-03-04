---
title: "au_design_search"
description: "Search Australian designs by number, owner, designer, product, or Locarno class."
---

Search the IP Australia design register. Australian designs protect the visual appearance of manufactured products. Uses the Paged Advanced Search endpoint with full pagination support. Requires IP Australia credentials.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Design number, owner name, designer name, product keyword, or Locarno class code |
| searchType | string | No | `owner` (default), `number`, `designer`, `product`, or `classification` |
| status | string | No | Filter: `all` (default), `live`, `dead`, `registered`, or `pending` |
| locarnoClasses | string[] | No | Additional Locarno class filter (combinable with any search type) |
| limit | number | No | Maximum results (default: 20, max: 100) |
| cursor | string | No | Page number for pagination (integer string starting at "0") |

## Example

### Request
```json
{
  "name": "au_design_search",
  "arguments": {
    "query": "Dyson",
    "searchType": "owner",
    "status": "registered",
    "limit": 5
  }
}
```

### Response
```json
{
  "results": [
    {
      "id": "AU-D-202115234",
      "designNumber": "202115234",
      "jurisdiction": "AU",
      "status": "registered",
      "statusDescription": "Registered",
      "filingDate": "2021-08-03",
      "registrationDate": "2021-11-15",
      "expiryDate": "2031-08-03",
      "locarnoClasses": ["15.05"],
      "applicants": [
        { "name": "Dyson Technology Limited" }
      ]
    }
  ],
  "pagination": {
    "hasMore": true,
    "cursor": "1",
    "totalResults": 187
  },
  "metadata": {
    "query": "Dyson",
    "searchType": "owner",
    "totalResults": 187,
    "executionTimeMs": 650
  }
}
```

## Notes
- IP Australia uses suffixed Locarno class codes (e.g., "09-01E" within class 09-01). If a bare classification code returns no results, try a product keyword search.
- The `classification` search type matches Locarno codes. Use dash format (e.g., "09-01") not dot format.

## Related Tools
- [au_design_status](/reference/tools/design/au-design-status/) -- get full details for a specific AU design
- [eu_design_search](/reference/tools/design/eu-design-search/) -- search EU community designs
