---
title: "au_patent_search"
description: "Search Australian patents by keywords, application number, inventor, or applicant."
---

Search the IP Australia patent register. Supports keyword, application number, PCT number, inventor name, and applicant name queries. Uses the Quick Search endpoint with multiple search modes controlling text matching depth. Requires IP Australia credentials.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Keywords, application number, PCT number, inventor name, or applicant name |
| searchMode | string | No | `QUICK_NO_ABSTRACT` (default, fastest), `QUICK_ABSTRACT`, `ADVANCED_NO_FULL_TEXT`, or `ADVANCED_FULL_TEXT` |
| limit | number | No | Maximum results (default: 20, max: 50) |
| cursor | string | No | Page number for pagination (integer string starting at "0") |

## Example

### Request
```json
{
  "name": "au_patent_search",
  "arguments": {
    "query": "lithium battery cathode",
    "searchMode": "QUICK_ABSTRACT",
    "limit": 5
  }
}
```

### Response
```json
{
  "results": [
    {
      "id": "AU-P-2020267890",
      "applicationNumber": "2020267890",
      "jurisdiction": "AU",
      "title": "Cathode Material for Lithium-Ion Batteries",
      "status": "sealed",
      "statusDescription": "Sealed",
      "filingDate": "2020-04-15",
      "pctNumber": "PCT/US2020/028456",
      "applicants": [
        { "name": "NextEra Battery Technologies Inc." }
      ]
    },
    {
      "id": "AU-P-2021312456",
      "applicationNumber": "2021312456",
      "jurisdiction": "AU",
      "title": "High-Capacity Lithium Battery with Nano-Structured Cathode",
      "status": "accepted",
      "statusDescription": "Accepted",
      "filingDate": "2021-09-22",
      "applicants": [
        { "name": "BrightPath Energy Pty Ltd" }
      ]
    }
  ],
  "pagination": {
    "hasMore": true,
    "cursor": "1",
    "totalResults": 234
  },
  "metadata": {
    "query": "lithium battery cathode",
    "searchMode": "QUICK_ABSTRACT",
    "totalResults": 234,
    "executionTimeMs": 890
  }
}
```

## Notes
- The Quick Search API performs OR-matching on multi-word queries. The tool post-filters results to require all significant (non-stop-word) tokens, ensuring "Johnson Johnson" only returns patents mentioning both words.
- `QUICK_NO_ABSTRACT` searches titles and bibliographic data only (fastest). `QUICK_ABSTRACT` adds abstract matching. `ADVANCED` modes enable full-text and field-specific matching.
- Maximum 50 results per page (API limitation).

## Related Tools
- [au_patent_status](/reference/tools/patent/au-patent-status/) -- get full details for an Australian patent
- [ep_patent_search](/reference/tools/patent/ep-patent-search/) -- search European patents (130M+ documents)
- [patent_family_search](/reference/tools/patent/patent-family-search/) -- find worldwide family members
