---
title: "distinctiveness_hints"
description: "Analyze the legal distinctiveness and registrability of a proposed trademark."
---

Evaluates a proposed trademark on the legal distinctiveness spectrum: fanciful, arbitrary, suggestive, descriptive, or generic. Provides strength assessment, concerns, and recommendations for improving registrability.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| proposedMark | string | Yes | The trademark to analyze for distinctiveness |
| niceClasses | number[] | Yes | Nice Classification classes for intended goods/services |
| goodsOrServices | string | No | Description of intended goods/services for more precise context-aware analysis |

## Example

### Request
```json
{
  "name": "distinctiveness_hints",
  "arguments": {
    "proposedMark": "CLOUDBOOKS",
    "niceClasses": [9, 42],
    "goodsOrServices": "cloud-based e-book publishing software"
  }
}
```

### Response
```json
{
  "proposedMark": "CLOUDBOOKS",
  "analysis": {
    "category": "descriptive",
    "strength": "weak",
    "reasoning": "\"CLOUDBOOKS\" directly describes features, qualities, or characteristics of the goods/services in the context of cloud-based e-book publishing software. Descriptive elements include: \"cloud\", \"books\". Descriptive marks can only be registered with evidence of acquired distinctiveness (secondary meaning), meaning consumers have come to associate the term specifically with your brand.",
    "concerns": [
      "Mark contains descriptive elements that may require proof of acquired distinctiveness (secondary meaning) for registration.",
      "Mark contains words (\"cloud\", \"books\") that directly describe your stated goods/services, which may be considered descriptive by trademark examiners."
    ],
    "recommendations": [
      "Consider modifying the mark to be less descriptive. Adding a coined element or using a suggestive variation can improve registrability.",
      "If you proceed with this mark, be prepared to demonstrate acquired distinctiveness (secondary meaning) through evidence of extensive use, advertising, and consumer recognition.",
      "A descriptive mark may be registrable on the Supplemental Register (USPTO) while you build secondary meaning.",
      "Consider more distinctive alternatives such as: Cloudbookify, Cloudio, Nova Cloudbooks."
    ]
  }
}
```

## Notes
- The tool uses word segmentation (Norvig's algorithm) to split compound marks like "CLOUDBOOKS" into constituent parts for analysis.
- When `goodsOrServices` is provided, words are checked against the description for contextual descriptiveness -- "Mobile" is descriptive for mobile phone accessories but arbitrary for office furniture.
- Categories map to strength levels: fanciful/arbitrary = strong, suggestive = moderate, descriptive = weak, generic = unregistrable.
- Brand-like suffixes (-ify, -ly, -io, -ex) suggest coined/fanciful marks even when the root is a common word.

## Related Tools
- [trademark_clearance](/reference/tools/trademark/trademark-clearance/) -- check for existing conflicting marks
- [suggest_nice_classes](/reference/tools/nice-classification/suggest-nice-classes/) -- identify the right classes before analysis
- [generate_gs_specification](/reference/tools/goods-services/generate-gs-specification/) -- generate filing specifications
