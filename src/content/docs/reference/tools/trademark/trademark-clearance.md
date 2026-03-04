---
title: "trademark_clearance"
description: "Comprehensive conflict analysis for a proposed trademark across multiple jurisdictions."
---

Runs a multi-jurisdictional conflict search for a proposed trademark. Identifies exact, phonetic, visual, and conceptual conflicts, calculates an overall risk level using a DuPont-factor-inspired model, and generates actionable filing recommendations.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| proposedMark | string | Yes | The proposed trademark name to check |
| niceClasses | number[] | Yes | Nice Classification classes for intended goods/services |
| jurisdictions | string[] | No | Jurisdictions to search (default: `["ALL"]`). Options: US, EU, AU, NZ, WIPO, GB, CA, JP, CN, ALL |
| includePhonetic | boolean | No | Include phonetically similar marks (default: true) |
| includeSimilarSpelling | boolean | No | Include visually similar marks (default: true) |
| minSimilarityScore | number | No | Minimum similarity score to report (0-1, default: 0.6) |
| goodsServicesTerms | object[] | No | G&S terms to validate against EUIPO Harmonised Database |
| compact | boolean | No | Return top 5 conflicts with counts instead of full list (default: false) |

## Example

### Request
```json
{
  "name": "trademark_clearance",
  "arguments": {
    "proposedMark": "CLOUDBOOKS",
    "niceClasses": [9, 42],
    "jurisdictions": ["US", "EU"],
    "minSimilarityScore": 0.6
  }
}
```

### Response
```json
{
  "proposedMark": "CLOUDBOOKS",
  "riskLevel": "high",
  "conflicts": [
    {
      "trademark": {
        "id": "US-88456789",
        "applicationNumber": "88456789",
        "name": "CLOUDBOOK",
        "jurisdiction": "US",
        "status": "registered",
        "niceClasses": [9, 42],
        "owner": "CloudBook Technologies LLC"
      },
      "conflictType": "visual",
      "similarityScore": 0.94,
      "overlappingClasses": [9, 42],
      "riskAssessment": "\"CLOUDBOOK\" is visually similar (94% similarity). Overlapping classes: 9, 42. Active registration presents high opposition risk."
    },
    {
      "trademark": {
        "id": "EU-017234567",
        "applicationNumber": "017234567",
        "name": "KLOUDBUKS",
        "jurisdiction": "EU",
        "status": "pending",
        "niceClasses": [9],
        "owner": "KloudBuks OY"
      },
      "conflictType": "phonetic",
      "similarityScore": 0.81,
      "overlappingClasses": [9],
      "riskAssessment": "\"KLOUDBUKS\" sounds similar to the proposed mark (phonetic match). Overlapping classes: 9."
    }
  ],
  "totalConflicts": 2,
  "recommendations": [
    "2 active registration(s) found with similarity to \"CLOUDBOOKS\". The registrants may oppose your application.",
    "Phonetically similar marks exist. Consider marks with more distinct pronunciation.",
    "Visually similar marks exist. Consider marks with more distinct spelling."
  ],
  "searchedJurisdictions": ["US", "EU"],
  "executionTimeMs": 3420
}
```

## Notes
- Risk level is calculated using a multi-factor model: similarity score, class relatedness, conflict type, mark status, and fame factor.
- The tool runs a truncated stem search when initial results are sparse -- e.g., "GOOGEL" triggers a secondary search for "GOOG" to catch misspellings.
- Famous marks (approximately 200 well-known brands) are checked locally to catch conflicts that API substring search would miss.
- When `goodsServicesTerms` is provided, terms are validated against the EUIPO Harmonised Database and results appear in `gsValidation`.
- The `thresholdWarning` field alerts when well-known marks were excluded by the similarity threshold.

## Related Tools
- [trademark_search](/reference/tools/trademark/trademark-search/) -- run a standalone search without conflict analysis
- [distinctiveness_hints](/reference/tools/nice-classification/distinctiveness-hints/) -- analyze the inherent strength of a proposed mark
- [suggest_nice_classes](/reference/tools/nice-classification/suggest-nice-classes/) -- identify correct Nice classes for your goods/services
