---
title: "translate_gs_terms"
description: "Translate goods and services terms across EU official languages using the Harmonised Database."
---

Translates trademark specification terms across the 23 EU official languages using the EUIPO Harmonised Database. Ensures consistent, office-approved terminology across jurisdictions. Essential for Madrid Protocol filings and EUIPO applications (which require two EU languages).

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| terms | object[] | Yes | G&S terms grouped by Nice class. Each object has `classNumber` (1-45) and `terms` (string[], max 50 per class). |
| sourceLanguage | string | No | Language of the input terms (default: "en") |
| targetLanguages | string[] | Yes | Target languages (1-22). Codes: bg, cs, da, de, el, en, es, et, fi, fr, ga, hr, hu, it, lt, lv, mt, nl, pl, pt, ro, sk, sl, sv. |

## Example

### Request
```json
{
  "name": "translate_gs_terms",
  "arguments": {
    "terms": [
      {
        "classNumber": 9,
        "terms": ["Downloadable computer software for project management"]
      },
      {
        "classNumber": 42,
        "terms": ["Software as a service [SaaS] for data analytics"]
      }
    ],
    "sourceLanguage": "en",
    "targetLanguages": ["fr", "de", "es"]
  }
}
```

### Response
```json
{
  "translations": {
    "fr": [
      { "classNumber": 9, "terms": ["Logiciels informatiques telechargeables pour la gestion de projets"] },
      { "classNumber": 42, "terms": ["Logiciel en tant que service [SaaS] pour l'analyse de donnees"] }
    ],
    "de": [
      { "classNumber": 9, "terms": ["Herunterladbare Computersoftware fur das Projektmanagement"] },
      { "classNumber": 42, "terms": ["Software as a Service [SaaS] fur die Datenanalyse"] }
    ],
    "es": [
      { "classNumber": 9, "terms": ["Software informatico descargable para gestion de proyectos"] },
      { "classNumber": 42, "terms": ["Software como servicio [SaaS] para analisis de datos"] }
    ]
  },
  "sourceLanguage": "en",
  "targetLanguages": ["fr", "de", "es"],
  "summary": {
    "totalTerms": 2,
    "languagesTranslated": 3
  }
}
```

## Notes
- Translations use HDB-harmonized terminology where available, ensuring consistency with each EU trademark office's accepted language.
- This tool requires EUIPO credentials (`EUIPO_CLIENT_ID` and `EUIPO_CLIENT_SECRET`).
- Maximum 22 target languages per request (all EU languages minus the source).
- Results are cached for performance since HDB data is updated quarterly.

## Related Tools
- [validate_gs_terms](/reference/tools/goods-services/validate-gs-terms/) -- validate terms before translating
- [generate_gs_specification](/reference/tools/goods-services/generate-gs-specification/) -- generate source specifications from a description
