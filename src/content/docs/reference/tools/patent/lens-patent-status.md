---
title: "lens_patent_status"
description: "Get detailed patent information from Lens.org by Lens ID."
---

Retrieve full patent details from Lens.org for a specific patent identified by its Lens ID. Returns comprehensive bibliographic data including title, abstract, applicants, inventors, owners, IPC/CPC classification, priority claims, and legal status. Requires a Lens.org API token.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lensId | string | Yes | Lens.org patent identifier (e.g., `095-621-040-202-546`). Obtained from `lens_patent_search` results. |

## Example

### Request
```json
{
  "name": "lens_patent_status",
  "arguments": {
    "lensId": "095-621-040-202-546"
  }
}
```

### Response
```json
{
  "patent": {
    "id": "US-11234567",
    "applicationNumber": "16789012",
    "jurisdiction": "US",
    "title": "Machine Learning System for Natural Language Understanding",
    "status": "sealed",
    "filingDate": "2019-08-22",
    "priorityDate": "2018-12-15",
    "expiryDate": "2039-08-22",
    "applicants": [
      { "name": "OpenAI Inc" }
    ],
    "inventors": [
      { "name": "DOE, Jane M." },
      { "name": "KUMAR, Rajesh" }
    ],
    "owners": [
      { "name": "OpenAI Inc" }
    ],
    "ipcClassification": [
      { "code": "G06F 40/30" },
      { "code": "G06N 3/08" }
    ],
    "cpcClassification": [
      { "code": "G06F 40/30" },
      { "code": "G06N 3/0895" }
    ],
    "conventionDetails": [
      {
        "priorityCountryCode": "US",
        "applicationNumber": "62/780123",
        "filingDate": "2018-12-15"
      }
    ],
    "abstract": "A system and method for training large language models using transformer architectures with improved attention mechanisms for natural language understanding tasks.",
    "patentType": "B2"
  },
  "currentStatus": {
    "code": "sealed",
    "description": "Patent granted and in force"
  }
}
```

## Notes
- The `lensId` is a Lens.org-specific identifier (dash-separated numeric format). Use `lens_patent_search` to discover Lens IDs for patents of interest.
- The `patentType` field contains the WIPO kind code: `A1` (published application with search report), `A2` (without search report), `B1`/`B2` (granted patent).
- Status values and their meanings:
  - `sealed` -- Patent granted and in force
  - `filed` -- Application pending
  - `under_examination` -- Application under examination
  - `accepted` -- Application accepted
  - `ceased` -- Patent discontinued
  - `expired` -- Patent term expired
  - `lapsed` -- Patent lapsed (fees not paid)
  - `revoked` -- Patent revoked
  - `withdrawn` -- Application withdrawn
  - `refused` -- Application refused
- The `conventionDetails` array lists priority claims, linking this patent to earlier applications in the same patent family.
- Results are cached. Subsequent lookups for the same `lensId` return cached data.

## Related Tools
- [lens_patent_search](/reference/tools/patent/lens-patent-search/) -- search patents to find Lens IDs
- [lens_prior_art](/reference/tools/patent/lens-prior-art/) -- find prior art with scholarly-patent citation linkage
- [ep_patent_status](/reference/tools/patent/ep-patent-status/) -- get patent details via EPO OPS
- [au_patent_status](/reference/tools/patent/au-patent-status/) -- get Australian patent details
