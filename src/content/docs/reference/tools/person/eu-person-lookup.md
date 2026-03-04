---
title: "eu_person_lookup"
description: "Search and retrieve EUIPO applicants and representatives by name or identifier."
---

Search the EUIPO Persons database for applicants (trademark/design owners) and representatives (attorneys, agents). Supports name-based search, direct identifier lookup, and filtering by entity type, country, and city. Requires EUIPO credentials.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Person name or EUIPO numeric identifier |
| role | string | No | `any` (default), `applicant`, or `representative` |
| type | string | No | Filter by person type. Applicants: `individual`, `business`. Representatives: `employee`, `legal_association`, `legal_professional`, `euipo_professional`. |
| country | string | No | ISO 3166-1 alpha-2 country code filter (e.g., "DE", "US") |
| city | string | No | City name filter |
| limit | number | No | Maximum results per page (default: 20, range: 10-100) |

## Example

### Request
```json
{
  "name": "eu_person_lookup",
  "arguments": {
    "query": "BrightPath",
    "role": "applicant",
    "type": "business",
    "country": "DE",
    "limit": 5
  }
}
```

### Response
```json
{
  "persons": [
    {
      "identifier": "876543",
      "role": "applicant",
      "name": "BrightPath GmbH",
      "type": "APPLICANT_BUSINESS",
      "country": "DE",
      "legalName": "BrightPath Technologie GmbH",
      "legalForm": "GmbH",
      "countryOfIncorporation": "DE",
      "address": {
        "street": "Friedrichstrasse 45",
        "city": "Berlin",
        "postalCode": "10117",
        "country": "DE"
      }
    }
  ],
  "pagination": {
    "hasMore": false,
    "totalResults": 1
  },
  "metadata": {
    "role": "applicant",
    "totalResults": 1,
    "executionTimeMs": 450
  }
}
```

## Notes
- When `query` is a pure numeric string, the tool attempts a direct identifier lookup first before falling back to name search.
- The EUIPO Persons API returns 6 discriminated union variants (2 applicant types, 4 representative types). All are flattened into a unified `PersonDetail` shape with optional fields.
- When `role` is `any`, applicants and representatives are searched in parallel. Results from both are merged.
- The EUIPO API requires a minimum page size of 10.

## Related Tools
- [eu_applicant_portfolio](/reference/tools/person/eu-applicant-portfolio/) -- view all trademarks and designs for an applicant
- [eu_design_search](/reference/tools/design/eu-design-search/) -- search designs by applicant name
- [trademark_search](/reference/tools/trademark/trademark-search/) -- search trademarks by owner
