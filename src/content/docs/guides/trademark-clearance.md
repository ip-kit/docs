---
title: Trademark Clearance
description: How to run a comprehensive trademark clearance search using IPKit, including conflict analysis, similarity scoring, risk levels, and interpretation guidance.
---

Trademark clearance is the process of checking whether a proposed mark conflicts with existing registrations before filing an application. The `trademark_clearance` tool automates this by searching across jurisdictions, scoring similarity, and producing a risk assessment.

## What clearance checks

A clearance search identifies:

- **Exact matches** -- identical marks in the same or related classes
- **Phonetic conflicts** -- marks that sound similar (e.g., "FONE" vs "PHONE")
- **Visual conflicts** -- marks with similar spelling (e.g., "GOOGEL" vs "GOOGLE")
- **Conceptual conflicts** -- marks scoring above the similarity threshold

The tool also checks class overlap and relatedness, so a conflict in class 9 (software) is flagged as related to class 42 (technology services) even without a direct class match.

## Running a clearance search

Provide the proposed mark name, target Nice classes, and jurisdictions:

```json
{
  "proposedMark": "SKYFORGE",
  "niceClasses": [9, 42],
  "jurisdictions": ["US", "EU"],
  "includePhonetic": true,
  "includeSimilarSpelling": true,
  "minSimilarityScore": 0.6
}
```

Response:

```json
{
  "proposedMark": "SKYFORGE",
  "riskLevel": "medium",
  "totalConflicts": 3,
  "conflicts": [
    {
      "trademark": {
        "id": "US-90123456",
        "name": "SKYFORGE",
        "jurisdiction": "US",
        "status": "registered",
        "niceClasses": [28]
      },
      "conflictType": "exact",
      "similarityScore": 1.0,
      "overlappingClasses": [],
      "riskAssessment": "Exact match found: \"SKYFORGE\" (US). This mark is currently registered. No overlapping classes, but exact name match increases risk."
    },
    {
      "trademark": {
        "id": "EU-018999888",
        "name": "SKYFORT",
        "jurisdiction": "EU",
        "status": "registered",
        "niceClasses": [9, 42]
      },
      "conflictType": "visual",
      "similarityScore": 0.82,
      "overlappingClasses": [9, 42],
      "riskAssessment": "\"SKYFORT\" is visually similar (82% similarity). Overlapping classes: 9, 42. Active registration presents high opposition risk."
    }
  ],
  "recommendations": [
    "Moderate risk detected. Consider consulting with a trademark attorney to assess the strength of potential conflicts.",
    "Evaluate whether the overlapping classes involve closely related goods/services.",
    "Visually similar marks exist. Consider marks with more distinct spelling."
  ],
  "searchedJurisdictions": ["US", "EU"],
  "executionTimeMs": 3450
}
```

## Similarity scoring

IPKit uses an ensemble of four algorithms to score how similar two marks are:

| Algorithm | What it measures |
|-----------|-----------------|
| **Jaro-Winkler** | Character-level edit distance, weighted toward the beginning of the string |
| **N-gram overlap** | Shared character sequences (bigrams and trigrams) |
| **Damerau-Levenshtein** | Minimum edits including transpositions (GOOGEL -> GOOGLE is 1 edit) |
| **Phonetic matching** | How the marks sound when spoken aloud |

The scores are combined into a single `similarityScore` between 0 and 1.

### Jurisdiction-aware phonetic scoring

The phonetic component adapts to the jurisdiction of each existing mark:

| Jurisdiction | Algorithm | Why |
|-------------|-----------|-----|
| EU | Cologne Phonetic | Optimized for German/Continental consonant patterns |
| US, GB, CA | NYSIIS | Optimized for English name pronunciation |
| AU, NZ | Caverphone | Regional pronunciation patterns |
| JP, CN | Disabled | Not applicable to CJK character systems |
| WIPO (default) | Double Metaphone | General-purpose phonetic encoding |

This means that when checking "SKYFORGE" against an EU mark "SKAIFORSCH", the Cologne algorithm handles the comparison, while a US mark uses NYSIIS.

## Famous marks pre-check

Before analyzing API results, the clearance tool runs a local check against approximately 200 well-known marks (APPLE, GOOGLE, NIKE, AMAZON, etc.). This catches misspellings that API substring search would miss.

For example, searching for "GOOGEL" via the EUIPO API uses substring matching (`verbalElement=="*GOOGEL*"`), which will not find "GOOGLE" since "GOOGEL" is not a substring of "GOOGLE". The famous marks pre-check catches this by running similarity scoring locally.

Famous marks receive special treatment in risk scoring because they have broad protection across all classes and aggressive enforcement programs.

## Truncated stem search

When the primary search returns fewer than 10 results and the mark is longer than 4 characters, the tool automatically runs a secondary search using the first N-2 characters of the mark. For example, "GOOGEL" triggers a stem search for "GOOG", which does find "GOOGLE" via substring matching.

Results from the stem search are deduplicated by ID before conflict analysis.

## Risk levels

The overall risk level uses a multi-factor scoring model inspired by DuPont factors:

| Level | Score | Meaning |
|-------|-------|---------|
| **low** | Below threshold | Few or no conflicts; safe to proceed with standard due diligence |
| **medium** | Above medium threshold | Some conflicts detected; consult an attorney to assess strength |
| **high** | Above high threshold | Significant conflicts; modifications to the mark are recommended |
| **critical** | Above critical threshold | Near-certain opposition or refusal; choose a different mark |

The score is the weighted combination of five factors:

1. **Similarity** -- how close the marks are (ensemble score)
2. **Class relatedness** -- how related the goods/services are
3. **Conflict type** -- exact matches weigh more than phonetic matches
4. **Registration status** -- registered marks are higher risk than pending
5. **Fame** -- famous marks get a risk boost across all classes

## Interpreting results

### Low risk
No blocking conflicts found. This does not guarantee registration -- it means no obvious red flags in the jurisdictions searched. Proceed with a formal application, but consider common law searches and domain availability checks.

### Medium risk
Conflicts exist but may not be blocking. Common scenarios:
- Similar marks in related but not identical classes
- Phonetic matches where the spelling is distinct
- Pending applications that may not proceed to registration

An IP attorney can evaluate whether these conflicts present real opposition risk.

### High or critical risk
Strong conflicts that likely prevent registration. When you see this:
- Consider modifying the mark (different spelling, added word, different root)
- Use [`distinctiveness_hints`](../reference/tools/trademark/) to evaluate alternative marks
- Focus on jurisdictions where conflicts are absent

## Optional: G&S validation

You can include `goodsServicesTerms` in the clearance request to simultaneously validate your proposed goods and services specification against the EUIPO Harmonised Database:

```json
{
  "proposedMark": "SKYFORGE",
  "niceClasses": [9, 42],
  "jurisdictions": ["EU"],
  "goodsServicesTerms": [
    {
      "classNumber": 9,
      "terms": ["downloadable computer software for project management"]
    },
    {
      "classNumber": 42,
      "terms": ["software as a service (SaaS) featuring project management"]
    }
  ]
}
```

The response includes a `gsValidation` section indicating which terms are harmonized (pre-approved) and which have errors or warnings.

## Compact mode

For streaming UIs or large conflict sets, set `compact: true` to receive only the top 5 conflicts with a `totalConflicts` count:

```json
{
  "proposedMark": "TECH",
  "niceClasses": [9],
  "jurisdictions": ["ALL"],
  "compact": true
}
```

## Limitations

- **API-level search is substring-based**, not true fuzzy. The EUIPO API matches `verbalElement=="*QUERY*"` -- it cannot find marks where the query is a misspelling rather than a substring. The famous marks pre-check and truncated stem search mitigate this, but some edge cases may be missed.
- **Single-character and two-character marks** have limited search coverage. Manual review of the trademark register is recommended.
- **Common law marks** (unregistered marks with rights through use) are not covered. Only marks in official registry databases are searched.
- **Image/logo similarity** is not supported. The tool analyzes word marks only.

## Related tools

- [`trademark_search`](../reference/tools/trademark/) -- direct search without conflict analysis
- [`distinctiveness_hints`](../reference/tools/trademark/) -- analyze mark strength before clearance
- [`suggest_nice_classes`](../reference/tools/nice-classification/) -- identify classes from a business description
- [`validate_gs_terms`](../reference/tools/goods-services/) -- check G&S terms against the Harmonised Database
