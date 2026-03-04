---
title: "suggest_nice_classes"
description: "Suggest Nice Classification classes from a description of goods or services."
---

Analyzes a natural-language description of goods or services and suggests the most relevant Nice Classification classes. When EUIPO credentials are configured, uses the Harmonised Database for authoritative ranked suggestions. Falls back to keyword scoring against static data otherwise.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| goodsOrServices | string | Yes | Description of the goods or services to classify |
| maxSuggestions | number | No | Maximum number of class suggestions (default: 5, max: 10) |

## Example

### Request
```json
{
  "name": "suggest_nice_classes",
  "arguments": {
    "goodsOrServices": "cloud-based project management software with mobile apps and API integrations",
    "maxSuggestions": 5
  }
}
```

### Response
```json
{
  "suggestions": [
    {
      "classNumber": 9,
      "className": "Computers and Scientific Devices",
      "confidence": 1.0,
      "matchedTerms": ["Downloadable computer software for project management", "Mobile application software"],
      "reasoning": "HDB suggests: Downloadable computer software for project management, Mobile application software"
    },
    {
      "classNumber": 42,
      "className": "Computer and Scientific",
      "confidence": 0.85,
      "matchedTerms": ["Software as a service [SaaS]", "Cloud computing services"],
      "reasoning": "HDB suggests: Software as a service [SaaS], Cloud computing services"
    },
    {
      "classNumber": 38,
      "className": "Telecommunications",
      "confidence": 0.7,
      "matchedTerms": ["Providing access to platforms and portals on the Internet"],
      "reasoning": "HDB suggests: Providing access to platforms and portals on the Internet"
    }
  ]
}
```

## Notes
- Compound phrase detection boosts relevant classes -- e.g., "mobile app" boosts classes 9 and 42 while suppressing class 12 (vehicles).
- The `confidence` score (0-1) reflects how strongly the description matches a class. Scores below 0.3 are filtered out.
- When EUIPO HDB is available, suggestions include pre-approved specification terms in `matchedTerms` that can be used directly in filing applications.

## Related Tools
- [nice_class_lookup](/reference/tools/nice-classification/nice-class-lookup/) -- look up details for a specific class
- [generate_gs_specification](/reference/tools/goods-services/generate-gs-specification/) -- generate filing-ready specifications from a description
- [distinctiveness_hints](/reference/tools/nice-classification/distinctiveness-hints/) -- evaluate mark strength for suggested classes
