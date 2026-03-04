---
title: "patent_family_search"
description: "Find worldwide patent family members via INPADOC from any jurisdiction's publication number."
---

Given a patent publication number from any jurisdiction (US, EP, AU, JP, CN, KR, etc.), discovers all related filings worldwide through the INPADOC patent family database maintained by EPO. Shows which countries a patent has been filed in. Requires EPO OPS credentials.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| publicationNumber | string | Yes | Patent publication number from any jurisdiction (e.g., "EP1234567A1", "US7654321B2", "AU2020100123"). EPODOC format preferred. |

## Example

### Request
```json
{
  "name": "patent_family_search",
  "arguments": {
    "publicationNumber": "US10234567B2"
  }
}
```

### Response
```json
{
  "queryPatent": "US10234567B2",
  "totalMembers": 8,
  "members": [
    {
      "jurisdiction": "US",
      "publicationNumber": "US10234567B2",
      "applicationNumber": "US201615234567",
      "familyId": "56789012",
      "kindCode": "B2",
      "publicationDate": "2019-03-19"
    },
    {
      "jurisdiction": "EP",
      "publicationNumber": "EP3234567A1",
      "applicationNumber": "EP16812345",
      "familyId": "56789012",
      "kindCode": "A1",
      "publicationDate": "2017-10-25"
    },
    {
      "jurisdiction": "CN",
      "publicationNumber": "CN108234567A",
      "applicationNumber": "CN201680045678",
      "familyId": "56789012",
      "kindCode": "A",
      "publicationDate": "2018-06-29"
    },
    {
      "jurisdiction": "JP",
      "publicationNumber": "JP2018530987A",
      "applicationNumber": "JP2018512345",
      "familyId": "56789012",
      "kindCode": "A",
      "publicationDate": "2018-10-18"
    },
    {
      "jurisdiction": "WO",
      "publicationNumber": "WO2017012345A1",
      "applicationNumber": "PCT/US2016/034567",
      "familyId": "56789012",
      "kindCode": "A1",
      "publicationDate": "2017-01-26"
    }
  ],
  "jurisdictions": ["CN", "EP", "JP", "US", "WO"]
}
```

## Notes
- This is a cross-jurisdiction tool: input a patent number from any country and discover related filings in all other countries.
- The INPADOC family groups patents that share at least one common priority.
- Use EPODOC format for best results. If the number is not found, try searching with `ep_patent_search` first to find the correct publication number.
- The `jurisdictions` array provides a quick overview of geographic patent coverage.

## Related Tools
- [ep_patent_search](/reference/tools/patent/ep-patent-search/) -- find the publication number to look up
- [ep_patent_status](/reference/tools/patent/ep-patent-status/) -- get details for a specific family member
- [au_patent_status](/reference/tools/patent/au-patent-status/) -- get details for an Australian family member
