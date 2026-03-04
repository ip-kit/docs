---
title: "validate_gs_terms"
description: "Validate goods and services terms against the EUIPO Harmonised Database."
---

Checks proposed goods and services specification terms against the EUIPO Harmonised Database (HDB). Reports whether each term is harmonized (pre-approved by all EU trademark offices), and flags errors or warnings for invalid terms. Requires EUIPO credentials.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| terms | object[] | Yes | G&S terms grouped by Nice class. Each object has `classNumber` (1-45) and `terms` (string[], max 50 per class). |
| language | string | No | EU language code for validation (default: "en"). Supports all 23 EU official languages. |

## Example

### Request
```json
{
  "name": "validate_gs_terms",
  "arguments": {
    "terms": [
      {
        "classNumber": 9,
        "terms": [
          "Downloadable computer software for project management",
          "Smart widgets for productivity tracking"
        ]
      },
      {
        "classNumber": 42,
        "terms": [
          "Software as a service [SaaS] for data analytics"
        ]
      }
    ]
  }
}
```

### Response
```json
{
  "validated": [
    {
      "classNumber": 9,
      "terms": [
        {
          "text": "Downloadable computer software for project management",
          "harmonized": true,
          "conceptId": "C2100432"
        },
        {
          "text": "Smart widgets for productivity tracking",
          "harmonized": false,
          "warnings": [
            { "type": "NOT_HARMONIZED", "detail": "Term is not in the Harmonised Database. Consider using accepted terminology." }
          ]
        }
      ]
    },
    {
      "classNumber": 42,
      "terms": [
        {
          "text": "Software as a service [SaaS] for data analytics",
          "harmonized": true,
          "conceptId": "C2300156"
        }
      ]
    }
  ],
  "summary": {
    "totalTerms": 3,
    "harmonizedCount": 2,
    "errorCount": 0,
    "warningCount": 1
  }
}
```

## Notes
- Harmonized terms are pre-approved by all EU trademark offices and accepted without examiner objection.
- The HDB is updated quarterly. Results are cached accordingly.
- This tool requires EUIPO credentials (`EUIPO_CLIENT_ID` and `EUIPO_CLIENT_SECRET`). An error is returned if not configured.
- Maximum 45 class groups with up to 50 terms per class.

## Related Tools
- [generate_gs_specification](/reference/tools/goods-services/generate-gs-specification/) -- generate specifications from a business description
- [translate_gs_terms](/reference/tools/goods-services/translate-gs-terms/) -- translate validated terms for multi-language filings
