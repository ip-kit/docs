---
title: Distinctiveness Analysis
description: How to analyze trademark distinctiveness using IPKit, including the legal distinctiveness spectrum, compound mark detection, and tips for choosing stronger marks.
---

Trademark distinctiveness determines how easily a mark can be registered and how broad its protection will be. The `distinctiveness_hints` tool analyzes a proposed mark and classifies it on the legal distinctiveness spectrum, helping you understand its strength before you invest in clearance and filing.

## The distinctiveness spectrum

Trademark law organizes marks into five categories, from strongest to weakest:

| Category | Strength | Registrable? | Example (for software) |
|----------|----------|-------------|----------------------|
| **Fanciful** | Strong | Yes | XEROX, KODAK |
| **Arbitrary** | Strong | Yes | APPLE (for computers), AMAZON (for e-commerce) |
| **Suggestive** | Moderate | Yes | NETFLIX ("net" + "flix" suggests streaming) |
| **Descriptive** | Weak | Only with secondary meaning | SPEEDY DELIVERY (for courier services) |
| **Generic** | Unregistrable | No | COMPUTER (for computers) |

The stronger the mark, the easier it is to register and the broader the scope of protection against infringers.

## Using the tool

Provide the proposed mark, target Nice classes, and optionally a goods/services description for context-aware analysis:

```json
{
  "proposedMark": "CLOUDBOOKS",
  "niceClasses": [9, 42],
  "goodsOrServices": "cloud-based bookkeeping software for small businesses"
}
```

Response:

```json
{
  "proposedMark": "CLOUDBOOKS",
  "analysis": {
    "category": "descriptive",
    "strength": "weak",
    "reasoning": "\"CLOUDBOOKS\" directly describes features, qualities, or characteristics of the goods/services in the context of cloud-based bookkeeping software for small businesses. Descriptive elements include: \"cloud\", \"books\". Descriptive marks can only be registered with evidence of acquired distinctiveness (secondary meaning), meaning consumers have come to associate the term specifically with your brand.",
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

## How the analysis works

### Word-level analysis

Each word in the mark is analyzed independently against multiple criteria:

- **Dictionary word check** -- is it a common English word?
- **Descriptive term check** -- does it describe the goods/services in the specified Nice classes?
- **Cross-class descriptive check** -- is it generically descriptive regardless of class (e.g., "digital", "smart", "eco")?
- **Generic term check** -- is it the common name for the product itself?
- **Laudatory term check** -- is it a superlative or quality claim (e.g., "premium", "ultimate", "best")?
- **Geographic term check** -- is it a geographic indicator (e.g., "American", "Pacific")?
- **Contextual check** -- when `goodsOrServices` is provided, does the word appear in your goods/services description?

The contextual check is particularly important. A word like "mobile" is descriptive when you are selling mobile phone accessories but arbitrary when you are selling furniture.

### Compound mark detection

Single-word marks that are not in the dictionary are analyzed for compound structure using word segmentation. The algorithm (based on Norvig's dynamic programming approach) splits marks into constituent words:

- "CLOUDBOOKS" becomes ["cloud", "books"]
- "SHOPIFY" becomes ["shop", "ify"] -- but the brand suffix "ify" triggers fanciful classification
- "NETFLIX" becomes ["net", "flix"] -- "flix" is a recognized brand morpheme, classified as suggestive

Compound classification rules:
- **All parts descriptive** for the Nice classes: mark is **descriptive**
- **Some parts descriptive** or contain brand morphemes (flix, gram, hub, etc.): mark is **suggestive**
- **No parts descriptive**: mark is **arbitrary**

### Stemming

The analysis uses morphological stemming so that word forms are matched correctly. "Computing" matches the descriptive term "computer", "running" matches "run", and so on. This prevents marks from evading descriptiveness detection through inflection.

## Category breakdown

### Fanciful marks

Invented words with no existing meaning. These receive the strongest protection because consumers can only associate them with your brand.

**Signals**: not a dictionary word, no recognizable word parts, may have brand-like suffixes (-ix, -ify, -ium), unusual consonant patterns.

**Examples**: XEROX, ROLEX, HAAGEN-DAZS, VERIZON

### Arbitrary marks

Real dictionary words used in a context unrelated to their meaning. Strong protection because the disconnect between word and product creates inherent distinctiveness.

**Signals**: common English word(s), no descriptive relationship to the goods/services in the specified Nice classes.

**Examples**: APPLE (computers), AMAZON (e-commerce), SHELL (petroleum), DOVE (soap)

**Caveat**: arbitrary marks are harder to enforce against others using the same common word in unrelated industries.

### Suggestive marks

Marks that hint at a quality or characteristic of the goods/services but require imagination to make the connection. Registrable without proving secondary meaning, but narrower protection than fanciful or arbitrary marks.

**Signals**: some descriptive elements mixed with non-descriptive ones, brand morphemes (tech, hub, flix), partial word overlap with goods/services.

**Examples**: NETFLIX (internet + flicks), AIRBNB (air mattress + bed & breakfast), GREYHOUND (speed for bus service)

### Descriptive marks

Marks that directly describe what the product is or does. Only registrable with evidence of acquired distinctiveness (secondary meaning) -- proof that consumers associate the term with your specific brand through extensive use and advertising.

**Signals**: all meaningful words relate to the goods/services, contains laudatory terms ("best", "premium"), geographic indicators, or cross-class descriptive terms ("digital", "express").

**Examples**: AMERICAN AIRLINES, BEST BUY, SHARP (for TVs)

### Generic marks

The common name for the product or service category. Cannot be registered as a trademark under any circumstances -- no amount of use can make a generic term registrable.

**Signals**: all meaningful words are the generic name for the product in the specified classes.

**Examples**: COMPUTER (for computers), BEER (for beer), HOTEL (for hotels)

## Tips for choosing stronger marks

1. **Invent a word**. Coined terms like SPOTIFY, ZILLOW, or LYFT are inherently distinctive and easy to register. Use brand-like suffixes (-ify, -io, -ly, -ix) on a suggestive root.

2. **Use an unrelated real word**. Pick a word with no connection to your industry. APPLE for technology, PATAGONIA for clothing, ORACLE for databases.

3. **Avoid describing your product**. If your mark tells customers what the product does, it is likely descriptive. "FastShip" for a shipping service describes the service; "Falcon" for a shipping service is arbitrary.

4. **Avoid laudatory terms**. Words like "premium", "elite", "ultra", and "best" weaken any mark. Examiners view them as everyone's right to use, not source identifiers.

5. **Avoid geographic terms** unless your product genuinely originates from that place. "Pacific Software" faces registration barriers unless you can show a geographic connection.

6. **Test with context**. Always provide the `goodsOrServices` parameter for the most accurate analysis. A mark that seems arbitrary in isolation may be descriptive in context.

7. **Check compound marks**. If your coined word splits into descriptive parts (CLOUD + BOOKS for cloud bookkeeping), the overall mark may be classified as descriptive despite appearing invented.

## Integrating with the filing workflow

Distinctiveness analysis is typically the second step in the pre-filing workflow:

1. **Suggest Nice classes** -- use `suggest_nice_classes` to identify your classes
2. **Check distinctiveness** -- use `distinctiveness_hints` to evaluate the mark
3. **Run clearance** -- use `trademark_clearance` to check for conflicts
4. **Refine if needed** -- if the mark is weak, modify it and re-analyze

See the [Filing Readiness guide](../guides/filing-readiness/) for the complete workflow.

## Related tools

- [`trademark_clearance`](/reference/tools/trademark/trademark-clearance/) -- check for conflicts with existing marks
- [`suggest_nice_classes`](/reference/tools/nice-classification/suggest-nice-classes/) -- identify classes from a business description
- [`trademark_search`](/reference/tools/trademark/trademark-search/) -- search existing registrations for comparison
