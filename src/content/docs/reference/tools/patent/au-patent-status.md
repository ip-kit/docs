---
title: "au_patent_status"
description: "Retrieve full details for a specific Australian patent application."
---

Look up comprehensive details for an Australian patent by its application number. Returns invention title, IPC classification, applicants, inventors, owners, PCT details, convention priorities, lifecycle dates, status history, publications, and related patents. Requires IP Australia credentials.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| applicationNumber | string | Yes | IP Australia patent application number (e.g., "2020267890") |
| includeDocuments | boolean | No | Include list of published documents -- specifications, amendments, etc. (default: false) |

## Example

### Request
```json
{
  "name": "au_patent_status",
  "arguments": {
    "applicationNumber": "2020267890",
    "includeDocuments": true
  }
}
```

### Response
```json
{
  "patent": {
    "id": "AU-P-2020267890",
    "applicationNumber": "2020267890",
    "pctNumber": "PCT/US2020/028456",
    "jurisdiction": "AU",
    "title": "Cathode Material for Lithium-Ion Batteries",
    "status": "sealed",
    "statusDescription": "Sealed",
    "patentType": "Standard",
    "filingDate": "2020-04-15",
    "priorityDate": "2019-04-16",
    "expiryDate": "2040-04-15",
    "applicants": [
      { "name": "NextEra Battery Technologies Inc." }
    ],
    "inventors": [
      { "name": "Dr. Sarah Chen" },
      { "name": "Dr. Michael Park" }
    ],
    "owners": [
      { "name": "NextEra Battery Technologies Inc." }
    ],
    "ipcClassification": [
      { "code": "H01M 4/525", "sequence": 1 },
      { "code": "H01M 10/052", "sequence": 2 }
    ],
    "pctDetails": {
      "pctNumber": "PCT/US2020/028456",
      "nationalPhaseEntryDate": "2021-10-15"
    },
    "conventionDetails": [
      { "priorityCountryCode": "US", "applicationNumber": "62/834567", "filingDate": "2019-04-16" }
    ],
    "lifecycle": {
      "acceptancePublishedDate": "2023-06-01",
      "sealingDate": "2023-09-15"
    },
    "statusHistory": [
      { "code": "FILED", "date": "2020-04-15" },
      { "code": "EXAMINATION_REQUESTED", "date": "2022-01-10" },
      { "code": "ACCEPTED", "date": "2023-06-01" },
      { "code": "SEALED", "date": "2023-09-15" }
    ],
    "publishedDocuments": [
      { "documentTypeCode": "B4", "documentName": "Complete Specification", "hasAbstract": true, "hasClaims": true, "hasDescription": true }
    ]
  },
  "currentStatus": {
    "code": "sealed",
    "description": "Sealed",
    "isLive": true
  }
}
```

## Notes
- Australian patent lifecycle: filing, examination, acceptance, sealing, expiry. The `lifecycle` object contains key dates for each stage.
- IPC (International Patent Classification) codes indicate the technical domain. Use these to find related patents.
- The `extensionsOfTerm` field appears for pharmaceutical patents with patent term extensions.
- `relatedPatents` links divisional, continuation, and PCT-related applications.

## Related Tools
- [au_patent_search](/reference/tools/patent/au-patent-search/) -- search Australian patents
- [patent_family_search](/reference/tools/patent/patent-family-search/) -- find worldwide patent family members
- [ep_patent_status](/reference/tools/patent/ep-patent-status/) -- look up European patent details
