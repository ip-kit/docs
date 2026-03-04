---
title: "generate_gs_specification"
description: "Generate filing-ready goods and services specifications from a business description."
---

Transforms a natural-language business description into structured trademark filing specifications. Produces per-class specification text suitable for USPTO, EUIPO, or WIPO applications. When EUIPO credentials are configured, validates terms against the Harmonised Database and supplements with HDB-approved language.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| businessDescription | string | Yes | Natural-language description of what the business does (min 10 chars, max 2000) |
| niceClasses | number[] | No | Specific Nice classes to generate for. Auto-detected from description if omitted. |
| jurisdiction | string | No | Target jurisdiction for specification style: `US` (default), `EU`, or `WIPO` |
| maxSpecsPerClass | number | No | Maximum specification lines per class (default: 5, max: 10) |
| language | string | No | ISO 639-1 language code for G&S terms (default: "en") |

## Example

### Request
```json
{
  "name": "generate_gs_specification",
  "arguments": {
    "businessDescription": "We build cloud-based project management software with real-time collaboration, mobile apps, and API integrations for enterprise teams",
    "jurisdiction": "US",
    "maxSpecsPerClass": 3
  }
}
```

### Response
```json
{
  "specifications": [
    {
      "classNumber": 9,
      "className": "Computers and Scientific Devices",
      "specifications": [
        { "text": "Downloadable and recorded computer software for project management with real-time collaboration", "harmonized": true },
        { "text": "Downloadable mobile applications for project management with real-time collaboration", "harmonized": true },
        { "text": "Application programming interfaces (API) software for project management with real-time collaboration" }
      ],
      "confidence": 1.0,
      "matchedKeywords": ["software", "mobile", "cloud", "api"]
    },
    {
      "classNumber": 42,
      "className": "Computer and Scientific",
      "specifications": [
        { "text": "Software as a service (SaaS) featuring software for project management with real-time collaboration", "harmonized": true },
        { "text": "Cloud computing services, namely, project management with real-time collaboration" },
        { "text": "Computer software development" }
      ],
      "confidence": 0.85,
      "matchedKeywords": ["cloud", "saas", "platform", "software development"]
    }
  ],
  "summary": {
    "totalClasses": 2,
    "totalSpecifications": 6,
    "jurisdiction": "US",
    "filingTip": "USPTO filing: Each class requires a separate filing fee ($250-350 per class via TEAS Plus/Standard). Total estimated: 2 class(es). Use the TEAS Plus form for lower fees if all specifications use the ID Manual language.",
    "hdbEnhanced": true
  }
}
```

## Notes
- The `harmonized` field indicates whether a term is pre-approved in the EUIPO Harmonised Database, accepted by all EU trademark offices.
- Filing tips are jurisdiction-specific, including estimated fees: USPTO ($250-350/class), EUIPO (EUR 850 base + EUR 50-150/additional class), WIPO (CHF 653 base).
- When the description mentions "software for [industry]", the tool correctly assigns the software to classes 9/42 rather than the target industry's service class.
- If no specifications can be generated, the `suggestion` field in `summary` provides guidance for improving the description.

## Related Tools
- [suggest_nice_classes](/reference/tools/nice-classification/suggest-nice-classes/) -- identify relevant classes before generating specifications
- [validate_gs_terms](/reference/tools/goods-services/validate-gs-terms/) -- validate individual terms against the HDB
- [translate_gs_terms](/reference/tools/goods-services/translate-gs-terms/) -- translate specifications for multi-jurisdiction filings
