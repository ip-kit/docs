---
title: Design Search
description: How to search registered designs in the EU and Australia using IPKit, including search types, Locarno classification, applicant enrichment, and design lifecycle.
---

Industrial designs protect the visual appearance of products -- their shape, pattern, lines, contours, and ornamentation. IPKit provides design search across two jurisdictions: the EU (via EUIPO) and Australia (via IP Australia).

Designs use **Locarno classification** (not Nice classes used by trademarks). They have different identifiers, statuses, and lifecycles from trademarks.

## EU design search

The `eu_design_search` tool queries EU Community Designs registered at EUIPO.

### Search types

| Type | Parameter | What it searches |
|------|-----------|-----------------|
| `number` | Design number | Exact match on EUIPO design number (e.g., "002345678-0001") |
| `applicant` (default) | Owner/holder name | Substring match on applicant name |
| `verbal_element` | Design name | Substring match on the verbal element (name) of the design |
| `product` | Product keyword | Searches the product indication field |
| `locarno_class` | Locarno code | Exact match on classification code (e.g., "09.01") |

### Example: search by applicant

```json
{
  "query": "Samsung",
  "searchType": "applicant",
  "status": "live",
  "limit": 20
}
```

Response:

```json
{
  "results": [
    {
      "id": "EU-D-002345678-0001",
      "designNumber": "002345678-0001",
      "jurisdiction": "EU",
      "status": "registered",
      "filingDate": "2023-05-10",
      "registrationDate": "2023-08-15",
      "expiryDate": "2028-05-10",
      "locarnoClasses": ["14.04"],
      "applicants": [
        {
          "identifier": "12345",
          "name": "Samsung Electronics Co., Ltd."
        }
      ]
    }
  ],
  "pagination": {
    "hasMore": true,
    "cursor": "1",
    "totalResults": 2450
  },
  "metadata": {
    "query": "Samsung",
    "searchType": "applicant",
    "totalResults": 2450,
    "executionTimeMs": 890
  }
}
```

### Applicant name enrichment

The EUIPO Designs Search API returns applicant identifiers but not always applicant names in search results. To resolve identifiers to names, set `enrichApplicantNames: true`:

```json
{
  "query": "09.01",
  "searchType": "locarno_class",
  "enrichApplicantNames": true,
  "limit": 10
}
```

This calls the EUIPO Persons API in the background to resolve each unique identifier. It adds latency but provides complete applicant information. For a dedicated person lookup, use [`eu_person_lookup`](/reference/tools/person/eu-person-lookup/).

### Status filters

| Filter | Includes |
|--------|----------|
| `all` (default) | Every status |
| `live` | Registered + pending designs |
| `dead` | Expired + cancelled + refused designs |
| `registered` | Only fully registered designs |
| `pending` | Only pending applications |

### Combining filters

You can combine any search type with a Locarno class filter:

```json
{
  "query": "Samsung",
  "searchType": "applicant",
  "locarnoClasses": ["14.04", "14.03"],
  "status": "live"
}
```

This finds live Samsung designs classified in Locarno 14.04 (screens/displays) or 14.03 (communication equipment).

## AU design search

The `au_design_search` tool queries Australian designs via IP Australia.

### Search types

| Type | Parameter | What it searches |
|------|-----------|-----------------|
| `number` | Design/application number | Exact match |
| `owner` (default) | Current owner name | Partial match |
| `designer` | Designer name | Partial match |
| `product` | Product name | Keyword search |
| `classification` | Locarno code | Classification code (e.g., "09-01") |

Note that Australia uses hyphens in Locarno codes (`09-01`) rather than dots (`09.01`).

### Example: search by product

```json
{
  "query": "mobile phone case",
  "searchType": "product",
  "status": "live",
  "limit": 15
}
```

Response:

```json
{
  "results": [
    {
      "id": "AU-D-202312345",
      "designNumber": "202312345",
      "jurisdiction": "AU",
      "status": "registered",
      "filingDate": "2023-09-01",
      "registrationDate": "2024-01-15",
      "locarnoClasses": ["14-03"],
      "applicants": [
        { "name": "Case Co Pty Ltd" }
      ]
    }
  ],
  "pagination": {
    "hasMore": false,
    "totalResults": 8
  },
  "metadata": {
    "query": "mobile phone case",
    "searchType": "product",
    "totalResults": 8,
    "executionTimeMs": 650
  }
}
```

### Locarno class filter

Like EU search, AU design search accepts a `locarnoClasses` filter that can be combined with any search type:

```json
{
  "query": "Apple",
  "searchType": "owner",
  "locarnoClasses": ["14-03"]
}
```

IP Australia sometimes uses suffixed class codes (e.g., "09-01E" within class 09-01). If a classification search returns no results, try a product keyword search instead.

## Locarno classification

The Locarno Classification system organizes designs into 32 classes and over 200 subclasses based on product type. Some common classes:

| Code | Description |
|------|------------|
| 01 | Foodstuffs |
| 06 | Furnishing |
| 09 | Packages and containers |
| 12 | Means of transport |
| 14 | Recording, telecommunication, and data processing equipment |
| 15 | Machines |
| 21 | Games, toys, tents, and sports goods |
| 25 | Building units and construction elements |
| 32 | Graphic symbols, logos, surface patterns, ornamentation |

Unlike Nice classes (1-45) used for trademarks, Locarno classes use a two-level numeric system: `NN.NN` (EU) or `NN-NN` (AU).

## Design lifecycle

Designs follow a different lifecycle from trademarks:

1. **Filed** -- application submitted to the office
2. **Published** -- design made publicly available (EU allows deferred publication up to 30 months)
3. **Registered** -- protection granted
4. **Renewed** -- registration extended (EU designs last up to 25 years in 5-year terms; AU designs up to 10 years)
5. **Expired/Cancelled** -- protection ended

## Getting full design details

After finding designs via search, use the status tools for complete information:

- `eu_design_status` -- full details for an EU design including views (images), product indications, priority claims, and representatives
- `au_design_status` -- full details for an AU design including owner details and related documents

```json
{
  "designNumber": "002345678-0001"
}
```

The detail response includes image URLs that show the actual design representations.

## Cross-referencing with persons

For EU designs, use `eu_person_lookup` to get detailed information about applicants, representatives, or designers:

```json
{
  "identifier": "12345",
  "role": "applicant"
}
```

Use `eu_applicant_portfolio` to see all IP filings (trademarks and designs) by a specific EUIPO applicant.

## Related tools

- [`eu_design_status`](/reference/tools/design/eu-design-status/) -- full details for an EU design
- [`au_design_status`](/reference/tools/design/au-design-status/) -- full details for an AU design
- [`eu_person_lookup`](/reference/tools/person/eu-person-lookup/) -- look up applicant/representative details
- [`eu_applicant_portfolio`](/reference/tools/person/eu-applicant-portfolio/) -- browse an applicant's full IP portfolio
