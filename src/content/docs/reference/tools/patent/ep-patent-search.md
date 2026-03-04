---
title: "ep_patent_search"
description: "Search 130M+ patent documents via the European Patent Office Open Patent Services."
---

Search the Espacenet patent collection through the EPO OPS Published Data Search API. Covers 130M+ patent documents from patent offices worldwide. Supports EPO CQL query syntax for field-specific searches. Requires EPO OPS credentials.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Search query -- title keywords, applicant name, inventor name, IPC/CPC class, or publication number. Supports CQL syntax (e.g., `ti=robot AND pa=samsung`). |
| limit | number | No | Maximum results (default: 20, max: 100) |
| offset | number | No | Result offset for pagination (default: 0) |

## Example

### Request
```json
{
  "name": "ep_patent_search",
  "arguments": {
    "query": "ti=autonomous driving AND pa=waymo",
    "limit": 5
  }
}
```

### Response
```json
{
  "results": [
    {
      "id": "EP-3845123",
      "applicationNumber": "EP20210345123",
      "jurisdiction": "EP",
      "title": "System and Method for Autonomous Vehicle Navigation in Urban Environments",
      "status": "published",
      "applicants": [
        { "name": "Waymo LLC" }
      ],
      "inventors": [
        { "name": "CHEN, Wei" },
        { "name": "GARCIA, Maria" }
      ],
      "ipcClassification": [
        { "code": "G05D 1/02", "sequence": 1 },
        { "code": "B60W 60/00", "sequence": 2 }
      ],
      "cpcClassification": [
        { "code": "G05D 1/0214", "sequence": 1 }
      ],
      "familyId": "75234567",
      "filingDate": "2021-03-15"
    }
  ],
  "pagination": {
    "totalResults": 47,
    "offset": 0,
    "limit": 5,
    "hasMore": true
  },
  "metadata": {
    "query": "ti=autonomous driving AND pa=waymo",
    "totalResults": 47,
    "executionTimeMs": 1120
  }
}
```

## Notes
- **CQL field codes**: `ti` (title), `pa` (applicant), `in` (inventor), `cl` (claims), `ab` (abstract), `ic` (IPC class), `cpc` (CPC class), `pn` (publication number), `ap` (application number).
- Combine fields with `AND`, `OR`, `NOT`. Example: `ti="solar cell" AND ic=H01L`.
- Pagination uses `offset` (not cursor). The next page offset is `offset + limit`.
- The `familyId` field links to the INPADOC patent family -- use `patent_family_search` to find related filings worldwide.

## Related Tools
- [ep_patent_status](/reference/tools/patent/ep-patent-status/) -- get full details for a specific patent
- [patent_family_search](/reference/tools/patent/patent-family-search/) -- find worldwide patent family members
- [au_patent_search](/reference/tools/patent/au-patent-search/) -- search Australian patents
