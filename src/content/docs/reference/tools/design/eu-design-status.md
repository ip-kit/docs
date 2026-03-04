---
title: "eu_design_status"
description: "Retrieve full details for a specific EU Community Design registration."
---

Look up comprehensive details for an EU registered community design by its design number. Returns views (image URLs), product indications, Locarno classifications, prosecution history, priority claims, and full lifecycle metadata. Requires EUIPO credentials.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| designNumber | string | Yes | EUIPO design number (e.g., "002345678-0001") |
| includeHistory | boolean | No | Include prosecution history -- publications and decisions (default: false) |
| enrichPersonNames | boolean | No | Resolve person identifiers to names via Persons API (default: false) |

## Example

### Request
```json
{
  "name": "eu_design_status",
  "arguments": {
    "designNumber": "002345678-0001",
    "includeHistory": true
  }
}
```

### Response
```json
{
  "design": {
    "id": "EU-D-002345678-0001",
    "designNumber": "002345678-0001",
    "jurisdiction": "EU",
    "status": "registered",
    "statusDescription": "Registered",
    "filingDate": "2022-09-12",
    "registrationDate": "2022-09-12",
    "expiryDate": "2027-09-12",
    "locarnoClasses": ["09.01"],
    "applicants": [
      { "office": "EM", "identifier": "156789", "name": "Nextera Design Studio S.r.l." }
    ],
    "applicationLanguage": "en",
    "secondLanguage": "de",
    "verbalElement": "NEXTERA LAMP",
    "productIndications": [
      { "language": "en", "terms": ["Luminaires", "Table lamps"] }
    ],
    "views": [
      {
        "order": 1,
        "imageFormat": "jpg",
        "thumbnailUrl": "https://euipo.europa.eu/designs/thumbnail/002345678-0001/1",
        "fullImageUrl": "https://euipo.europa.eu/designs/image/002345678-0001/1"
      }
    ],
    "designers": [
      { "office": "IT", "identifier": "234567", "name": "Marco Bellini" }
    ]
  },
  "currentStatus": {
    "code": "registered",
    "description": "Registered",
    "date": "2022-09-12",
    "isLive": true
  },
  "history": [
    { "date": "2022-09-12", "code": "REGISTRATION", "description": "Design registered" },
    { "date": "2022-12-15", "code": "PUBLICATION", "description": "Published in Community Designs Bulletin" }
  ]
}
```

## Notes
- View image URLs require Authorization and X-IBM-Client-Id headers when fetched directly.
- The `publicationDefermentIndicator` field indicates whether publication was deferred (up to 30 months for EU designs).
- Prosecution history includes publications, decisions, and invalidity proceedings when `includeHistory` is enabled.

## Related Tools
- [eu_design_search](/reference/tools/design/eu-design-search/) -- search for EU designs
- [eu_applicant_portfolio](/reference/tools/person/eu-applicant-portfolio/) -- view all IP rights for an applicant
