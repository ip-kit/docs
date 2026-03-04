---
title: "ep_patent_status"
description: "Retrieve full details for a specific patent from EPO Open Patent Services."
---

Look up comprehensive details for a patent by its publication number via the EPO OPS bibliographic data API. Returns title, IPC/CPC classification, applicants, inventors, priority claims, abstract, and INPADOC family ID. Requires EPO OPS credentials.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| publicationNumber | string | Yes | Patent publication number in EPODOC format (e.g., "EP1234567A1", "US7654321B2") |

## Example

### Request
```json
{
  "name": "ep_patent_status",
  "arguments": {
    "publicationNumber": "EP3845123A1"
  }
}
```

### Response
```json
{
  "patent": {
    "id": "EP-3845123",
    "applicationNumber": "EP20210345123",
    "jurisdiction": "EP",
    "title": "System and Method for Autonomous Vehicle Navigation in Urban Environments",
    "status": "published",
    "filingDate": "2021-03-15",
    "priorityDate": "2020-03-20",
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
      { "code": "G05D 1/0214", "sequence": 1 },
      { "code": "B60W 2060/0027", "sequence": 2 }
    ],
    "familyId": "75234567",
    "conventionDetails": [
      { "priorityCountryCode": "US", "applicationNumber": "US202016823456", "filingDate": "2020-03-20", "priorityTypeCode": "T" }
    ],
    "abstract": "A system for navigating an autonomous vehicle through urban environments using multi-sensor fusion and real-time path planning. The system combines LiDAR, camera, and radar data with high-definition maps to identify navigable paths while accounting for dynamic obstacles including pedestrians and cyclists."
  },
  "currentStatus": {
    "code": "published",
    "description": "published"
  }
}
```

## Notes
- Use EPODOC format for publication numbers: country code + number + kind code (e.g., "EP3845123A1").
- The `conventionDetails` array shows priority claims linking to earlier filings in other jurisdictions.
- Status information from EPO OPS is limited to bibliographic data. The `currentStatus.description` may show "Status not available from EPO OPS bibliographic data" for some documents.
- Use the `familyId` with `patent_family_search` to discover related filings worldwide.

## Related Tools
- [ep_patent_search](/reference/tools/patent/ep-patent-search/) -- search for patents by keyword, applicant, or classification
- [patent_family_search](/reference/tools/patent/patent-family-search/) -- find all family members for this patent
