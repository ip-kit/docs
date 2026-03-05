---
title: Filing Readiness
description: How to assess whether a trademark is ready to file using IPKit's pre-filing workflow, including Nice class selection, G&S specification, validation, and translation.
---

Filing readiness is the process of preparing a trademark application for submission. IPKit provides a suite of tools that cover the full pre-filing workflow: identifying the right Nice classes, generating goods and services specifications, validating terms, and checking for conflicts.

IPKit includes a built-in MCP prompt called `filing-readiness` that guides AI assistants through this workflow automatically. You can also call each tool individually.

## The filing readiness workflow

The recommended sequence is:

1. **Suggest Nice classes** from a business description
2. **Look up class details** to verify coverage
3. **Analyze distinctiveness** to assess registrability
4. **Generate G&S specifications** for the application
5. **Validate terms** against the Harmonised Database
6. **Run clearance** to check for conflicts
7. **Translate terms** (for EU/WIPO filings)

## Step 1: Suggest Nice classes

Use `suggest_nice_classes` to identify which of the 45 Nice classes apply to your business:

```json
{
  "description": "A mobile app that helps restaurants manage online orders and delivery logistics"
}
```

Response:

```json
{
  "suggestions": [
    {
      "classNumber": 9,
      "className": "Computers and Scientific Devices",
      "confidence": 0.95,
      "reasoning": "Mobile application software"
    },
    {
      "classNumber": 39,
      "className": "Transportation and Storage",
      "confidence": 0.82,
      "reasoning": "Delivery logistics services"
    },
    {
      "classNumber": 42,
      "className": "Computer and Scientific",
      "confidence": 0.78,
      "reasoning": "SaaS platform services"
    },
    {
      "classNumber": 43,
      "className": "Hotels and Restaurants",
      "confidence": 0.72,
      "reasoning": "Restaurant order management"
    }
  ]
}
```

Missing a class is a common filing mistake. Review the suggestions carefully -- the tool identifies both primary classes (your core product) and related classes (associated services).

## Step 2: Look up class details

Use `nice_class_lookup` to explore specific classes and understand their scope:

```json
{
  "classNumbers": [9, 39, 42, 43],
  "query": "delivery app"
}
```

The response includes the official class description, examples of goods/services in each class, and what is excluded. When EUIPO credentials are configured, the response is enriched with live data from the Goods & Services API including harmonized term suggestions.

This tool also recognizes product-service class pairs. For example, software products (class 9) are often paired with SaaS services (class 42).

## Step 3: Analyze distinctiveness

Use `distinctiveness_hints` to evaluate whether your mark is strong enough to register:

```json
{
  "proposedMark": "ORDERFLOW",
  "niceClasses": [9, 39, 42, 43],
  "goodsOrServices": "mobile application for restaurant order management and delivery logistics"
}
```

Response:

```json
{
  "proposedMark": "ORDERFLOW",
  "analysis": {
    "category": "suggestive",
    "strength": "moderate",
    "reasoning": "\"ORDERFLOW\" suggests qualities or characteristics of the goods/services in the context of mobile application for restaurant order management and delivery logistics but requires imagination or a mental leap to connect the mark to the product.",
    "concerns": [
      "Mark contains descriptive elements that may require proof of acquired distinctiveness (secondary meaning) for registration."
    ],
    "recommendations": [
      "This mark is registrable without proof of secondary meaning, but protection scope may be narrower than for fanciful/arbitrary marks.",
      "Consider strengthening the mark by adding a distinctive design element or combining with a coined term.",
      "Conduct clearance search -- suggestive marks in the same space may create likelihood-of-confusion issues."
    ]
  }
}
```

See the [Distinctiveness Analysis guide](../guides/distinctiveness/) for a deeper explanation of the distinctiveness spectrum and how to choose stronger marks.

## Step 4: Generate G&S specifications

Use `generate_gs_specification` to produce filing-ready goods and services text:

```json
{
  "description": "A mobile app that helps restaurants manage online orders and delivery logistics",
  "classNumbers": [9, 42, 43],
  "format": "EU"
}
```

The tool generates specification text suitable for trademark applications. It matches keywords in your business description against curated specification templates accepted by the USPTO, EUIPO, and WIPO.

The `format` parameter adjusts the output:
- **US** -- uses USPTO ID Manual-style language
- **EU** -- uses EUIPO Harmonised Database terminology
- **WIPO** -- uses Madrid Protocol-compatible phrasing

## Step 5: Validate G&S terms

Use `validate_gs_terms` to check whether your specification terms are in the EUIPO Harmonised Database (HDB). Harmonized terms are pre-approved by all EU trademark offices, which speeds up examination:

```json
{
  "terms": [
    {
      "classNumber": 9,
      "terms": [
        "downloadable mobile applications for restaurant order management",
        "computer software platforms for delivery logistics"
      ]
    },
    {
      "classNumber": 42,
      "terms": [
        "software as a service (SaaS) featuring restaurant management"
      ]
    }
  ]
}
```

Response:

```json
{
  "validated": [
    {
      "classNumber": 9,
      "terms": [
        {
          "text": "downloadable mobile applications for restaurant order management",
          "harmonized": true,
          "conceptId": "C12345"
        },
        {
          "text": "computer software platforms for delivery logistics",
          "harmonized": false,
          "errors": [
            { "type": "NOT_HARMONIZED", "detail": "Term not found in HDB. Consider: 'Computer software platforms, recorded or downloadable'" }
          ]
        }
      ]
    }
  ],
  "summary": {
    "totalTerms": 3,
    "harmonizedCount": 2,
    "errorCount": 1,
    "warningCount": 0
  }
}
```

Non-harmonized terms are still usable but may trigger examiner questions. Aim for harmonized terms where possible to reduce prosecution delays.

## Step 6: Translate G&S terms

For EU applications (which require two languages) or Madrid Protocol filings, use `translate_gs_terms` to translate your specification:

```json
{
  "terms": [
    {
      "classNumber": 9,
      "terms": ["downloadable mobile applications for restaurant order management"]
    }
  ],
  "sourceLanguage": "en",
  "targetLanguages": ["fr", "de", "es"]
}
```

The tool uses harmonized translations from the EUIPO database, ensuring consistent terminology across all EU trademark offices. All 23 EU official languages are supported.

## Jurisdiction-specific tips

### United States (USPTO)
- Use ID Manual terminology for goods and services
- The Supplemental Register accepts descriptive marks while you build secondary meaning
- Consider filing an intent-to-use (ITU) application if you have not yet used the mark in commerce
- Class 9 (software) and class 42 (SaaS) are typically both needed for technology companies

### European Union (EUIPO)
- Applications must list goods and services in two of the five EUIPO languages (English, French, German, Italian, Spanish)
- Use Harmonised Database terms for faster examination
- A single EU trademark covers all 27 member states
- Consider a national filing alongside the EUTM for specific priority needs

### Australia (IP Australia)
- Australia uses the same Nice Classification as EUIPO
- Consider filing a standard or innovation patent depending on your needs
- "Clean" specifications using terms from IP Australia's pre-approved list accelerate examination

### WIPO (Madrid Protocol)
- The Madrid System allows filing in multiple countries through a single application
- Your specification must be compatible with each designated country's requirements
- Use `translate_gs_terms` to prepare multilingual specifications

## Related tools

- [`suggest_nice_classes`](/reference/tools/nice-classification/suggest-nice-classes/) -- auto-recommend classes from a description
- [`nice_class_lookup`](/reference/tools/nice-classification/nice-class-lookup/) -- browse classes 1-45 with examples
- [`distinctiveness_hints`](/reference/tools/nice-classification/distinctiveness-hints/) -- analyze mark strength
- [`generate_gs_specification`](/reference/tools/goods-services/generate-gs-specification/) -- produce filing-ready specifications
- [`validate_gs_terms`](/reference/tools/goods-services/validate-gs-terms/) -- check terms against the Harmonised Database
- [`translate_gs_terms`](/reference/tools/goods-services/translate-gs-terms/) -- translate across 23 EU languages
- [`trademark_clearance`](/reference/tools/trademark/trademark-clearance/) -- comprehensive conflict analysis
