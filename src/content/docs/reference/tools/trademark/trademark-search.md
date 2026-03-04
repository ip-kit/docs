---
title: "trademark_search"
description: "Search trademarks across multiple jurisdictions by name, owner, number, or similarity."
---

Search trademarks across US, EU, AU, NZ, WIPO, GB, CA, JP, and CN registries. Supports exact name matching, owner lookup, registration number search, and fuzzy similarity matching with phonetic and visual analysis.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Trademark name, owner, or registration/serial number to search |
| searchType | string | No | `name` (default), `owner`, `number`, or `fuzzy` |
| jurisdictions | string[] | No | Jurisdictions to search (default: `["ALL"]`). Options: US, EU, AU, NZ, WIPO, GB, CA, JP, CN, ALL |
| niceClasses | number[] | No | Filter by Nice Classification classes (1-45) |
| status | string | No | Filter by status: `all` (default), `live`, `dead`, or `pending` |
| limit | number | No | Maximum results per jurisdiction (default: 20, max: 100) |
| cursor | string | No | Pagination cursor from a previous response |

## Example

### Request
```json
{
  "name": "trademark_search",
  "arguments": {
    "query": "BRIGHTPATH",
    "searchType": "fuzzy",
    "jurisdictions": ["US", "EU"],
    "niceClasses": [9, 42],
    "status": "live",
    "limit": 10
  }
}
```

### Response
```json
{
  "results": [
    {
      "id": "EU-018734521",
      "applicationNumber": "018734521",
      "name": "BRIGHTPATH",
      "jurisdiction": "EU",
      "status": "registered",
      "filingDate": "2023-06-15",
      "registrationDate": "2023-11-02",
      "niceClasses": [9, 42],
      "owner": "BrightPath Technologies GmbH",
      "similarityScore": 1.0
    },
    {
      "id": "US-97654321",
      "applicationNumber": "97654321",
      "name": "BRITEPASS",
      "jurisdiction": "US",
      "status": "registered",
      "filingDate": "2022-03-10",
      "registrationDate": "2023-01-18",
      "niceClasses": [9, 35, 42],
      "owner": "BritePass Inc.",
      "similarityScore": 0.78
    }
  ],
  "pagination": {
    "hasMore": false,
    "totalResults": 2
  },
  "metadata": {
    "query": "BRIGHTPATH",
    "searchType": "fuzzy",
    "jurisdictionsSearched": ["US", "EU"],
    "totalResults": 2,
    "executionTimeMs": 1240,
    "resultsPerJurisdiction": { "EU": 1, "US": 1 }
  }
}
```

## Notes
- **Fuzzy search** uses an ensemble of Jaro-Winkler, n-gram, Damerau-Levenshtein, and jurisdiction-aware phonetic algorithms. Results include a `similarityScore` (0-1).
- **Name search** returns substring matches -- searching "APPLE" also returns "PINEAPPLE".
- **Owner search** ranks exact and prefix matches above substring matches.
- Multi-jurisdiction queries interleave results round-robin so no single jurisdiction dominates when results are truncated.
- When no results are found, a `suggestion` field provides actionable guidance.

## Related Tools
- [trademark_status](/reference/tools/trademark/trademark-status/) -- get full details for a specific trademark
- [trademark_clearance](/reference/tools/trademark/trademark-clearance/) -- comprehensive conflict analysis for a proposed mark
