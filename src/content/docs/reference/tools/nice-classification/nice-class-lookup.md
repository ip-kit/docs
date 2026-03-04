---
title: "nice_class_lookup"
description: "Look up Nice Classification classes by number or keyword search."
---

Retrieve Nice Classification data by class number or keyword search. Returns class titles, descriptions, examples, and exclusions. When EUIPO credentials are configured, supports multilingual class headings in 23 EU official languages.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| classNumber | number | No | Specific Nice class number (1-45) |
| keyword | string | No | Search classes by keyword (e.g., "software", "clothing") |
| language | string | No | ISO 639-1 language code for class headings (default: "en"). Supports 23 EU languages when EUIPO is configured. |

At least one of `classNumber` or `keyword` should be provided. Omitting both returns all 45 classes.

## Example

### Request
```json
{
  "name": "nice_class_lookup",
  "arguments": {
    "keyword": "software"
  }
}
```

### Response
```json
{
  "version": "12-2024",
  "classes": [
    {
      "number": 9,
      "title": "Computers and Scientific Devices",
      "description": "Scientific, research, navigation, surveying, photographic, cinematographic, audiovisual, optical, weighing, measuring, signalling, detecting, testing, inspecting, life-saving and teaching apparatus and instruments...",
      "examples": ["computers", "software", "smartphones", "tablets", "cameras", "downloadable apps"],
      "excludes": ["Certain instruments (see alphabetical list)", "Clock and watchmaking instruments (Class 14)"]
    },
    {
      "number": 42,
      "title": "Computer and Scientific",
      "description": "Scientific and technological services and research and design relating thereto; industrial analysis, industrial research and industrial design services; quality control and authentication services; design and development of computer hardware and software.",
      "examples": ["software development", "web design", "IT consulting", "cloud computing", "SaaS development"],
      "excludes": ["Business research (Class 35)", "Financial research (Class 36)"]
    }
  ]
}
```

## Notes
- When keyword search returns no matches and the EUIPO G&S API is configured, the tool falls back to HDB term suggestions for broader coverage.
- Non-English language headings are fetched live from the EUIPO API and merged with the static English examples and exclusions.
- The static dataset is based on Nice Classification Edition 12-2024.

## Related Tools
- [suggest_nice_classes](/reference/tools/nice-classification/suggest-nice-classes/) -- get class recommendations from a business description
- [distinctiveness_hints](/reference/tools/nice-classification/distinctiveness-hints/) -- analyze mark strength for specific classes
