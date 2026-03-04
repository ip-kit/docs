---
title: "au_design_status"
description: "Retrieve full details for a specific Australian design registration."
---

Look up comprehensive details for an Australian design by its design number. Returns product names, Locarno classes, applicants, designers, convention priorities, related designs, novelty statements, and lifecycle dates. Requires IP Australia credentials.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| designNumber | string | Yes | IP Australia design number (e.g., "202115234") |

## Example

### Request
```json
{
  "name": "au_design_status",
  "arguments": {
    "designNumber": "202115234"
  }
}
```

### Response
```json
{
  "design": {
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
      {
        "name": "Dyson Technology Limited",
        "address": "Tetbury Hill, Malmesbury, Wiltshire",
        "country": "GB"
      }
    ],
    "productNames": ["Ventilation Fan", "Desk Fan"],
    "designers": [
      { "name": "James Dyson" }
    ],
    "priorities": [
      { "country": "GB", "applicationNumber": "6102345", "applicationDate": "2021-02-15" }
    ],
    "statementOfNovelty": "The novelty of the design resides in the shape and configuration of the fan unit as shown in the representations.",
    "imageUrls": [
      "https://pericles.ipaustralia.gov.au/designs/202115234/image1.png"
    ]
  },
  "currentStatus": {
    "code": "registered",
    "description": "Registered",
    "date": "2021-11-15",
    "isLive": true
  }
}
```

## Notes
- Australian designs include statements of novelty, newness/distinctiveness, and monopoly that describe the scope of protection.
- The `indicators` field shows examination lifecycle flags: `awaitingExamination`, `underExamination`, `inGracePeriod`, etc.
- The `relatedDesigns` field maps relationship types to arrays of related design numbers and dates.

## Related Tools
- [au_design_search](/reference/tools/design/au-design-search/) -- search Australian designs
- [eu_design_status](/reference/tools/design/eu-design-status/) -- look up EU design details
