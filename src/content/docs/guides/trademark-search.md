---
title: Trademark Search
description: How to search trademarks across 9 jurisdictions using IPKit's trademark_search tool, including search types, filters, pagination, and practical examples.
---

The `trademark_search` tool searches trademark registrations across 9 global jurisdictions. It supports name-based, owner, number, and fuzzy search modes with status filtering and pagination.

## Search types

The `searchType` parameter controls how your query is matched:

| Type | Behavior | Best for |
|------|----------|----------|
| `name` (default) | Substring match -- "APPLE" also returns "PINEAPPLE" | Finding exact or partial name matches |
| `owner` | Searches applicant/owner name fields | Portfolio analysis, competitor research |
| `number` | Matches application or registration numbers | Looking up a specific filing |
| `fuzzy` | Ensemble similarity scoring (phonetic + visual) | Catching misspellings, similar-sounding marks |

## Jurisdictions

Use the `jurisdictions` parameter to target specific offices or search everywhere:

- **Specific**: `["US"]`, `["EU", "GB"]`, `["AU", "NZ"]`
- **All**: `["ALL"]` (default) -- queries every configured provider in parallel

Available jurisdiction codes: `US`, `EU`, `AU`, `NZ`, `WIPO`, `GB`, `CA`, `JP`, `CN`.

When searching multiple jurisdictions, results are interleaved round-robin so that each jurisdiction gets fair representation in the output.

## Status filters

The `status` parameter narrows results by lifecycle stage:

| Filter | Includes |
|--------|----------|
| `all` (default) | Every status |
| `live` | Registered + pending marks |
| `dead` | Abandoned + cancelled + expired marks |
| `pending` | Applications only |

## Basic search example

Search for trademarks containing "AURORA" in the US and EU:

```json
{
  "query": "AURORA",
  "searchType": "name",
  "jurisdictions": ["US", "EU"],
  "status": "live",
  "limit": 10
}
```

Response:

```json
{
  "results": [
    {
      "id": "US-97123456",
      "applicationNumber": "97123456",
      "name": "AURORA",
      "jurisdiction": "US",
      "status": "registered",
      "filingDate": "2023-01-15",
      "registrationDate": "2024-03-20",
      "niceClasses": [9, 42],
      "owner": "Aurora Technologies Inc."
    },
    {
      "id": "EU-018765432",
      "applicationNumber": "018765432",
      "name": "AURORA DIGITAL",
      "jurisdiction": "EU",
      "status": "pending",
      "filingDate": "2024-06-01",
      "niceClasses": [9, 35],
      "owner": "Aurora Digital GmbH"
    }
  ],
  "pagination": {
    "hasMore": true,
    "totalResults": 47
  },
  "metadata": {
    "query": "AURORA",
    "searchType": "name",
    "jurisdictionsSearched": ["US", "EU"],
    "totalResults": 2,
    "executionTimeMs": 1230,
    "resultsPerJurisdiction": { "US": 1, "EU": 1 }
  }
}
```

## Nice class filtering

Add `niceClasses` to limit results to specific goods/services categories:

```json
{
  "query": "AURORA",
  "searchType": "name",
  "jurisdictions": ["ALL"],
  "niceClasses": [9, 42],
  "status": "live"
}
```

This returns only marks registered in class 9 (software/electronics) or class 42 (technology services). Use [`nice_class_lookup`](../reference/tools/nice-classification/) to explore class definitions.

## Owner search

Find all trademarks owned by a specific entity:

```json
{
  "query": "Apple Inc.",
  "searchType": "owner",
  "jurisdictions": ["US"],
  "limit": 50
}
```

Owner search results are sorted with exact matches first, then prefix matches, then substring matches. This is useful for portfolio analysis and competitive intelligence.

## Number search

Look up a specific trademark by its application or registration number:

```json
{
  "query": "97123456",
  "searchType": "number",
  "jurisdictions": ["US"]
}
```

Number formats vary by jurisdiction. Examples:
- **US (USPTO)**: 8-digit serial number (e.g., `97123456`)
- **EU (EUIPO)**: 9-digit number (e.g., `018765432`)
- **AU**: 7-digit number (e.g., `2345678`)

## Fuzzy search

Fuzzy search finds phonetically and visually similar marks. It uses an ensemble of similarity algorithms:

- Jaro-Winkler distance
- N-gram overlap
- Damerau-Levenshtein edit distance
- Jurisdiction-aware phonetic matching

```json
{
  "query": "GOOGEL",
  "searchType": "fuzzy",
  "jurisdictions": ["US"],
  "limit": 20
}
```

Results include a `similarityScore` (0-1) and are sorted by relevance. The threshold is 0.7 for marks longer than 5 characters. Fuzzy search also checks approximately 200 famous marks locally, so misspellings of well-known brands are caught even when the API substring search misses them.

## Pagination

For single-jurisdiction searches, the response includes a cursor for pagination:

```json
{
  "query": "TECH",
  "searchType": "name",
  "jurisdictions": ["EU"],
  "limit": 20
}
```

If `pagination.hasMore` is `true`, pass the cursor back to get the next page:

```json
{
  "query": "TECH",
  "searchType": "name",
  "jurisdictions": ["EU"],
  "limit": 20,
  "cursor": "eyJwYWdlIjoxfQ=="
}
```

The cursor is an opaque token -- pass it exactly as received. Pagination cursors are only available for single-jurisdiction queries. Multi-jurisdiction searches return interleaved results without cursor support.

## Tips

- **Start with name search** to see what exists, then use **fuzzy search** to catch variations you might have missed.
- **Owner search** is the fastest way to map a competitor's trademark portfolio across jurisdictions.
- **Combine Nice class filters** with name search to focus on your industry. Without class filters, you may see irrelevant results from unrelated industries.
- **When no results are found**, the response includes a `suggestion` field with actionable next steps (e.g., try fuzzy search, check number format).
- Results are cached server-side to speed up repeated queries. Cache duration is reduced for partial results (when some jurisdictions return errors).

## Related tools

- [`trademark_status`](../reference/tools/trademark/) -- get full details for a specific trademark
- [`trademark_clearance`](../reference/tools/trademark/) -- comprehensive conflict analysis
- [`nice_class_lookup`](../reference/tools/nice-classification/) -- browse Nice Classification classes 1-45
