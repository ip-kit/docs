---
title: "lens_prior_art"
description: "Find prior art with scholarly-patent citation linkage via Lens.org."
---

Discover prior art for a patent by analyzing its citation network through Lens.org. Returns both patent citations and non-patent literature (scholarly articles) linked to the target patent. This scholarly-patent cross-linkage is a unique Lens.org capability not available from other IPKit providers. Requires a Lens.org API token.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lensId | string | Yes | Lens.org patent identifier (e.g., `095-621-040-202-546`). Obtained from `lens_patent_search` results. |

## Example

### Request
```json
{
  "name": "lens_prior_art",
  "arguments": {
    "lensId": "042-637-313-850-140"
  }
}
```

### Response
```json
{
  "patent": {
    "id": "US-10876543",
    "title": "Convolutional Neural Network for Medical Image Classification",
    "jurisdiction": "US"
  },
  "citations": {
    "scholarlyArticles": [
      {
        "text": "He, K. et al. \"Deep Residual Learning for Image Recognition.\" CVPR 2016.",
        "lensId": "112-893-445-012-378",
        "type": "npl",
        "category": "cited by examiner"
      },
      {
        "text": "Ronneberger, O. et al. \"U-Net: Convolutional Networks for Biomedical Image Segmentation.\" MICCAI 2015.",
        "lensId": "087-234-556-901-123",
        "type": "npl",
        "category": "cited by applicant"
      }
    ],
    "citedPatents": [
      {
        "lensId": "031-445-667-123-890",
        "jurisdiction": "US",
        "docNumber": "9922267",
        "category": "cited by examiner"
      },
      {
        "lensId": "055-778-990-234-567",
        "jurisdiction": "EP",
        "docNumber": "3125178",
        "category": "cited by applicant"
      }
    ],
    "citedByPatentCount": 23,
    "nplCount": 14,
    "patentCitationCount": 8
  },
  "metadata": {
    "executionTimeMs": 650
  }
}
```

## Notes
- **Unique capability**: `lens_prior_art` is the only IPKit tool that provides scholarly-patent citation cross-linkage. No other patent provider exposes non-patent literature (NPL) citations in a structured format.
- The `scholarlyArticles` array contains non-patent literature references (journal papers, conference proceedings, books). Each entry may include a `lensId` that can be used to look up the scholarly article in the Lens.org scholarly database.
- The `citedPatents` array lists patent documents cited by or in the target patent. Use the `lensId` from each entry with `lens_patent_status` to retrieve full details.
- The `category` field indicates who cited the reference: `"cited by examiner"`, `"cited by applicant"`, or `"cited by third party"`.
- Citation arrays are capped at 50 entries each. The `nplCount` and `patentCitationCount` fields reflect the true totals from Lens.org, which may exceed the returned array lengths.
- `citedByPatentCount` indicates how many later patents cite the target patent -- a measure of the patent's influence and technological significance.
- Results are cached. Subsequent lookups for the same `lensId` return cached data.

## Related Tools
- [lens_patent_search](/reference/tools/patent/lens-patent-search/) -- search patents to find Lens IDs
- [lens_patent_status](/reference/tools/patent/lens-patent-status/) -- get full patent details from Lens.org
- [patent_family_search](/reference/tools/patent/patent-family-search/) -- find worldwide patent family members via EPO
