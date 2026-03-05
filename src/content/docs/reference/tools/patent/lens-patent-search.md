---
title: "lens_patent_search"
description: "Search 130M+ patent documents across 100+ jurisdictions via Lens.org."
---

Search the Lens.org patent collection using full-text queries across title, abstract, claims, and description. Covers 130M+ patent documents from 100+ jurisdictions worldwide. Supports filtering by jurisdiction, date range, and IPC classification. Requires a Lens.org API token.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Search query -- keywords searched across title, abstract, claims, and description. |
| jurisdiction | string | No | Filter by jurisdiction code (e.g., `US`, `EP`, `WO`, `AU`, `JP`, `CN`). 2-4 characters. |
| dateFrom | string | No | Filter patents published on or after this date (ISO 8601, e.g., `2020-01-01`). |
| dateTo | string | No | Filter patents published on or before this date (ISO 8601, e.g., `2024-12-31`). |
| classification | string | No | Filter by IPC classification code (e.g., `H04L`, `C12Q 1/68`). |
| limit | number | No | Maximum results to return (default: 20, max: 50). |
| offset | number | No | Result offset for pagination (default: 0). |

## Example

### Request
```json
{
  "name": "lens_patent_search",
  "arguments": {
    "query": "CRISPR gene editing delivery",
    "jurisdiction": "US",
    "dateFrom": "2022-01-01",
    "limit": 5
  }
}
```

### Response
```json
{
  "results": [
    {
      "id": "US-20230140940",
      "applicationNumber": "17894523",
      "jurisdiction": "US",
      "title": "Lipid Nanoparticle Compositions for CRISPR-Cas9 Delivery",
      "status": "filed",
      "applicants": [
        { "name": "Moderna Therapeutics Inc" }
      ],
      "inventors": [
        { "name": "SMITH, Rebecca L." },
        { "name": "PATEL, Anil K." }
      ],
      "ipcClassification": [
        { "code": "C12N 15/87" },
        { "code": "A61K 48/00" }
      ],
      "cpcClassification": [
        { "code": "C12N 15/8731" }
      ],
      "filingDate": "2022-06-14",
      "priorityDate": "2021-11-03"
    }
  ],
  "pagination": {
    "totalResults": 312,
    "offset": 0,
    "limit": 5,
    "hasMore": true
  },
  "metadata": {
    "query": "CRISPR gene editing delivery",
    "totalResults": 312,
    "executionTimeMs": 840
  }
}
```

## Notes
- The query performs full-text matching across all patent fields (title, abstract, claims, description) -- no special query syntax required.
- Jurisdiction codes follow standard two-letter country codes. Use `WO` for PCT international applications and `EP` for European Patent Office publications.
- IPC classification filters support both section-level (`H04L`) and detailed subclass queries (`C12Q 1/68`).
- Pagination uses `offset` (not cursor). The next page offset is `offset + limit`. Check `pagination.hasMore` to determine if more pages exist.
- Results are cached. Subsequent identical queries return cached data.
- When no results are found, a `suggestion` field is returned with guidance on broadening the search.

## Related Tools
- [lens_patent_status](/reference/tools/patent/lens-patent-status/) -- get full details for a specific Lens.org patent
- [lens_prior_art](/reference/tools/patent/lens-prior-art/) -- find prior art with scholarly-patent citation linkage
- [ep_patent_search](/reference/tools/patent/ep-patent-search/) -- search patents via the European Patent Office
- [au_patent_search](/reference/tools/patent/au-patent-search/) -- search Australian patents
