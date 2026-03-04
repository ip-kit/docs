---
title: "eu_design_search"
description: "Search EU Community Designs by number, applicant, verbal element, product, or Locarno class."
---

Search the EUIPO registered community designs database. Industrial designs protect the visual appearance of products -- shape, pattern, and ornamentation. They use Locarno classification (not Nice classes). Requires EUIPO credentials.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Design number, applicant name, verbal element, product keyword, or Locarno class |
| searchType | string | No | `applicant` (default), `number`, `verbal_element`, `product`, or `locarno_class` |
| status | string | No | Filter: `all` (default), `live`, `dead`, `registered`, or `pending` |
| locarnoClasses | string[] | No | Additional Locarno class filter (format: "NN" or "NN.NN", e.g., "09.01") |
| sort | string | No | Sort order (default: "applicationDate:desc") |
| limit | number | No | Maximum results (default: 20, range: 10-100) |
| cursor | string | No | Page number for pagination (integer string starting at "0") |
| enrichApplicantNames | boolean | No | Resolve applicant identifiers to names via Persons API (default: false, adds latency) |

## Example

### Request
```json
{
  "name": "eu_design_search",
  "arguments": {
    "query": "Samsung Electronics",
    "searchType": "applicant",
    "status": "live",
    "locarnoClasses": ["14.03"],
    "limit": 5
  }
}
```

### Response
```json
{
  "results": [
    {
      "id": "EU-D-008234567-0001",
      "designNumber": "008234567-0001",
      "jurisdiction": "EU",
      "status": "registered",
      "statusDescription": "Registered",
      "filingDate": "2023-05-10",
      "registrationDate": "2023-05-10",
      "expiryDate": "2028-05-10",
      "locarnoClasses": ["14.03"],
      "applicants": [
        { "identifier": "100234", "name": "Samsung Electronics Co., Ltd." }
      ]
    }
  ],
  "pagination": {
    "hasMore": true,
    "cursor": "1",
    "totalResults": 342
  },
  "metadata": {
    "query": "Samsung Electronics",
    "searchType": "applicant",
    "totalResults": 342,
    "executionTimeMs": 820
  }
}
```

## Notes
- The EUIPO Designs Search API returns applicant identifiers but not always names in search results. Set `enrichApplicantNames: true` to resolve names via the Persons API (adds latency).
- Locarno class format: two-digit class (e.g., "14") or class with subclass (e.g., "14.03").
- EUIPO designs have 16 distinct status values mapped to the standard filters (live, dead, registered, pending).

## Related Tools
- [eu_design_status](/reference/tools/design/eu-design-status/) -- get full details for a specific EU design
- [au_design_search](/reference/tools/design/au-design-search/) -- search Australian designs
- [eu_person_lookup](/reference/tools/person/eu-person-lookup/) -- look up applicant details by identifier
