---
title: Patent Search
description: How to search patents in Australia and Europe using IPKit, including patent families, IPC/CPC classification, CQL syntax, and prior art strategies.
---

IPKit provides patent search across two systems: Australian patents via IP Australia and European/worldwide patents via the EPO Open Patent Services (OPS). The EPO collection alone contains over 130 million patent documents.

## AU patent search

The `au_patent_search` tool searches Australian patents via IP Australia's API.

### Basic search

```json
{
  "query": "solar panel cleaning robot",
  "searchMode": "QUICK_NO_ABSTRACT",
  "limit": 20
}
```

Response:

```json
{
  "results": [
    {
      "id": "AU-P-2023100456",
      "applicationNumber": "2023100456",
      "jurisdiction": "AU",
      "title": "Autonomous cleaning apparatus for photovoltaic panels",
      "status": "accepted",
      "filingDate": "2023-03-15",
      "pctNumber": "PCT/AU2023/050123",
      "applicants": [
        { "name": "SolarClean Pty Ltd" }
      ]
    }
  ],
  "pagination": {
    "hasMore": true,
    "cursor": "1",
    "totalResults": 42
  },
  "metadata": {
    "query": "solar panel cleaning robot",
    "searchMode": "QUICK_NO_ABSTRACT",
    "totalResults": 42,
    "executionTimeMs": 780
  }
}
```

### Search modes

| Mode | Speed | Scope |
|------|-------|-------|
| `QUICK_NO_ABSTRACT` (default) | Fastest | Title, applicant, number fields |
| `QUICK_ABSTRACT` | Fast | Adds abstract text matching |
| `ADVANCED_NO_FULL_TEXT` | Moderate | Enables field-specific matching |
| `ADVANCED_FULL_TEXT` | Slowest | Full-text including claims and description |

Start with `QUICK_NO_ABSTRACT` for speed. If results are too narrow, switch to `QUICK_ABSTRACT` to include abstract matching.

### What you can search

The AU patent search accepts:
- **Keywords** -- matched against title (and abstract in ABSTRACT mode)
- **Application numbers** -- direct lookup (e.g., "2023100456")
- **PCT numbers** -- international filing numbers (e.g., "PCT/AU2023/050123")
- **Inventor names** -- find patents by inventor
- **Applicant names** -- find patents by applicant/owner

For multi-word queries, the tool applies post-filtering to ensure all significant words appear in the results. The API itself performs OR-matching, so "Johnson Johnson" without filtering would return every patent mentioning any single "Johnson".

### Pagination

AU patent search returns up to 50 results per page. Use the cursor for pagination:

```json
{
  "query": "lithium battery",
  "searchMode": "QUICK_ABSTRACT",
  "limit": 50,
  "cursor": "1"
}
```

## EP patent search

The `ep_patent_search` tool queries the EPO Open Patent Services, which covers 130+ million patent documents from the Espacenet collection worldwide.

### CQL query syntax

EPO uses CQL (Common Query Language) for field-specific searching:

| Field | Prefix | Example |
|-------|--------|---------|
| Title | `ti=` | `ti=robot` |
| Abstract | `ab=` | `ab=machine learning` |
| Applicant | `pa=` | `pa=samsung` |
| Inventor | `in=` | `in=smith` |
| Publication number | `pn=` | `pn=EP1234567` |
| Application number | `num=` | `num=EP20200123456` |
| IPC classification | `ic=` | `ic=A61B` |
| CPC classification | `cpc=` | `cpc=Y02E10/50` |

Combine fields with `AND`, `OR`, and `NOT`:

```json
{
  "query": "ti=robot AND pa=samsung AND ic=B25J",
  "limit": 25
}
```

### Simple keyword search

Without field prefixes, the query searches across title and abstract:

```json
{
  "query": "autonomous vehicle lidar",
  "limit": 20
}
```

Response:

```json
{
  "results": [
    {
      "id": "EP-3456789",
      "applicationNumber": "EP20210123456",
      "jurisdiction": "EP",
      "title": "LIDAR-based obstacle detection system for autonomous vehicles",
      "status": "published",
      "applicants": [
        { "name": "Waymo LLC" }
      ],
      "inventors": [
        { "name": "Smith, John" }
      ],
      "ipcClassification": [
        { "code": "G01S17/93", "sequence": 1 },
        { "code": "B60W30/095", "sequence": 2 }
      ],
      "cpcClassification": [
        { "code": "G01S17/931", "sequence": 1 }
      ],
      "familyId": "78901234",
      "filingDate": "2021-06-15"
    }
  ],
  "pagination": {
    "totalResults": 1580,
    "offset": 0,
    "limit": 20,
    "hasMore": true
  },
  "metadata": {
    "query": "autonomous vehicle lidar",
    "totalResults": 1580,
    "executionTimeMs": 1200
  }
}
```

### Pagination

EP patent search uses offset-based pagination (not cursors):

```json
{
  "query": "ti=robot AND pa=samsung",
  "limit": 25,
  "offset": 25
}
```

The maximum offset + limit range is 100 results per query. For deeper result sets, refine your search terms.

## Patent family search

The `patent_family_search` tool finds worldwide patent family members via INPADOC. Given a patent publication number from any jurisdiction, it returns all related filings worldwide.

This is a cross-jurisdiction capability: input a US patent number and discover related filings in EP, JP, CN, KR, and more.

```json
{
  "publicationNumber": "EP1234567A1"
}
```

Response:

```json
{
  "queryPatent": "EP1234567A1",
  "totalMembers": 8,
  "members": [
    {
      "jurisdiction": "EP",
      "publicationNumber": "EP1234567A1",
      "applicationNumber": "EP20010123456",
      "familyId": "26789012",
      "kindCode": "A1",
      "publicationDate": "2003-09-03"
    },
    {
      "jurisdiction": "US",
      "publicationNumber": "US7654321B2",
      "applicationNumber": "US10234567",
      "familyId": "26789012",
      "kindCode": "B2",
      "publicationDate": "2010-02-02"
    },
    {
      "jurisdiction": "JP",
      "publicationNumber": "JP2003256789A",
      "applicationNumber": "JP20020123456",
      "familyId": "26789012",
      "kindCode": "A"
    }
  ],
  "jurisdictions": ["CN", "EP", "JP", "KR", "US"]
}
```

Use EPODOC format for the publication number (e.g., "EP1234567A1", "US7654321B2"). If you do not know the number, use `ep_patent_search` first to find it.

## IPC and CPC classification

Patents use two classification systems:

### IPC (International Patent Classification)
A hierarchical system maintained by WIPO. Structure: `Section/Class/Subclass/Group/Subgroup`.

Example: `G06F 3/01`
- G = Physics
- 06 = Computing
- F = Electrical digital data processing
- 3/01 = Input arrangements for user interaction

### CPC (Cooperative Patent Classification)
A more granular extension of IPC maintained jointly by the EPO and USPTO. Same hierarchical structure but with additional subgroups.

Example: `Y02E 10/50`
- Y02 = Climate change mitigation technologies
- E = Energy
- 10/50 = Photovoltaic energy

Use `ic=` for IPC and `cpc=` for CPC in EP patent search queries.

## Patent lifecycle

Australian patents follow this lifecycle:

1. **Filed** -- application submitted (standard or provisional)
2. **Published** -- application made publicly available (18 months from priority date)
3. **Under examination** -- examiner reviewing patentability
4. **Accepted** -- claims found patentable, open for opposition
5. **Sealed (granted)** -- patent rights conferred
6. **Expired** -- 20-year term ended (or 25 years for pharmaceutical extensions)

EP patents follow a similar path with examination at the EPO. After grant, they must be validated in individual countries.

Use `au_patent_status` or `ep_patent_status` to get the current lifecycle stage and detailed status history for any patent.

## Prior art search strategy

When searching for prior art (existing patents relevant to an invention):

1. **Start broad** with keyword search to understand the landscape:
   ```json
   { "query": "solar panel cleaning", "searchMode": "QUICK_ABSTRACT" }
   ```

2. **Identify IPC/CPC classes** from initial results, then search by classification:
   ```json
   { "query": "ic=H02S40 AND ti=cleaning" }
   ```

3. **Search by known competitors**:
   ```json
   { "query": "pa=sunpower", "limit": 50 }
   ```

4. **Check patent families** for any relevant hit to find worldwide filings:
   ```json
   { "publicationNumber": "US10234567B2" }
   ```

5. **Get full details** for the most relevant patents using `au_patent_status` or `ep_patent_status` to review claims, priority dates, and related patents.

6. **Cross-reference with designs** using `au_design_search` if any patents relate to product appearance.

## Related tools

- [`au_patent_status`](../reference/tools/patent/) -- full details for an AU patent
- [`ep_patent_status`](../reference/tools/patent/) -- full details for an EP patent
- [`patent_family_search`](../reference/tools/patent/) -- find worldwide family members
- [`au_design_search`](../reference/tools/design/) -- cross-reference with design registrations
