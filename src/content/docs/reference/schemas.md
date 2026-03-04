---
title: "Schema Reference"
description: "Data types and schemas returned by IPKit tools, including trademarks, designs, patents, and clearance results."
---

IPKit normalizes data from 10 different IP offices into consistent schemas. This page documents the key data types returned by tool calls.

## Trademark Schemas

### TrademarkSummary

Lightweight trademark record returned in search results. Contains enough information for initial screening without the full detail overhead.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Normalized unique identifier (format: `{JURISDICTION}-{applicationNumber}`, e.g., `US-87654321`) |
| `applicationNumber` | string | Yes | Application or serial number |
| `registrationNumber` | string | No | Registration number (present only for registered marks) |
| `name` | string | Yes | Trademark name or word mark |
| `jurisdiction` | string | Yes | Jurisdiction code: `US`, `EU`, `AU`, `NZ`, `WIPO`, `GB`, `CA`, `JP`, `CN` |
| `status` | string | Yes | Normalized status: `registered`, `pending`, `abandoned`, `cancelled`, `expired`, `opposed`, `unknown` |
| `statusDescription` | string | No | Human-readable status from the source registry |
| `filingDate` | string | No | Application filing date (ISO 8601) |
| `registrationDate` | string | No | Registration date (ISO 8601) |
| `statusDate` | string | No | Last status change date (ISO 8601) |
| `niceClasses` | number[] | Yes | Nice Classification class numbers (1-45) |
| `owner` | string | No | Owner or applicant name |
| `imageUrl` | string | No | URL to trademark image or logo |
| `markFeature` | string | No | Mark type: `WORD`, `FIGURATIVE`, `SHAPE_3D`, `COLOUR`, `SOUND`, `HOLOGRAM`, `POSITION`, `PATTERN`, `MOTION`, `MULTIMEDIA`, `OTHER` |
| `hasImage` | boolean | No | Whether the mark has a visual representation |
| `similarityScore` | number | No | Similarity score (0-1) when returned from fuzzy search or clearance analysis |

### TrademarkDetail

Full trademark record extending TrademarkSummary with goods and services, owner details, prosecution history, and filing metadata. Returned by `trademark_status` and detail lookups.

All TrademarkSummary fields are included, plus:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | No | Trademark description |
| `markType` | string | No | Mark type: `word`, `design`, `combined`, `sound`, `motion`, `color`, `position`, `pattern`, `hologram`, `other` |
| `goodsAndServices` | GoodsServices[] | No | Goods and services organized by Nice class |
| `applicant` | Owner | No | Applicant/owner contact details (name, address, city, country) |
| `representative` | Representative | No | Attorney or representative details (name, address) |
| `priority` | PriorityClaim | No | Convention priority claim (date, country, number) |
| `expirationDate` | string | No | Registration expiration date (ISO 8601) |
| `renewalDate` | string | No | Next renewal due date (ISO 8601) |
| `disclaimers` | string[] | No | Disclaimers of exclusive rights to specific elements |
| `designCodes` | string[] | No | Vienna classification codes for figurative elements |
| `endorsements` | string[] | No | Official endorsements or limitations |
| `attorney` | string | No | Filing attorney or representative firm |
| `markNature` | string | No | Mark nature: `STANDARD`, `COLLECTIVE`, `CERTIFICATION` |
| `markBasis` | string | No | Legal basis for the application (EUIPO) |
| `publicationDate` | string | No | Publication date for opposition (ISO 8601) |
| `oppositionDeadline` | string | No | End of opposition period (ISO 8601) |
| `seniorityClaimed` | boolean | No | Whether seniority from prior national marks was claimed (EUIPO) |
| `designations` | string[] | No | Designated territories (country codes) |
| `associatedDesigns` | string[] | No | Associated design registration numbers (IP Australia) |
| `prosecutionHistory` | object[] | No | Full prosecution/status history entries with `date`, `code`, and `description` |

### Supporting Types

**GoodsServices**

| Field | Type | Description |
|-------|------|-------------|
| `classNumber` | number | Nice Classification class number (1-45) |
| `description` | string | Goods or services description for this class |

**Owner**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Owner/applicant name |
| `address` | string? | Street address |
| `city` | string? | City |
| `country` | string? | Country code or name |

**Representative**

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Representative/attorney name |
| `address` | string? | Office address |

**PriorityClaim**

| Field | Type | Description |
|-------|------|-------------|
| `date` | string | Priority date (ISO 8601) |
| `country` | string | Country of the prior filing |
| `number` | string | Application number of the prior filing |

---

## Design Schemas

### DesignSummary

Lightweight design record returned in search results. Designs protect the visual appearance of products and use Locarno classification (not Nice).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Normalized ID: `{jurisdiction}-D-{designNumber}` |
| `designNumber` | string | Yes | Design number from EUIPO or IP Australia |
| `applicationNumber` | string | No | Application/filing number |
| `applicantReference` | string | No | Applicant-assigned reference number |
| `jurisdiction` | string | Yes | `EU` or `AU` |
| `status` | string | Yes | Status: `registered`, `registered_deferred`, `certified`, `pending`, `invalidated`, `invalidity_pending`, `surrendered`, `expired`, `withdrawn`, `refused`, `converted`, `unknown` |
| `statusDescription` | string | No | Human-readable status |
| `filingDate` | string | No | Application date (ISO 8601) |
| `registrationDate` | string | No | Registration date (ISO 8601) |
| `expiryDate` | string | No | Expiry date (ISO 8601) |
| `locarnoClasses` | string[] | Yes | Locarno classification codes (format: `NN.NN`) |
| `applicants` | DesignPerson[] | Yes | Design applicants or holders |
| `representatives` | DesignPerson[] | No | Legal representatives |

### DesignDetail

Full design record extending DesignSummary. Returned by `eu_design_status` and `au_design_status`.

All DesignSummary fields are included, plus:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `applicationLanguage` | string | No | Language of the application |
| `secondLanguage` | string | No | Second language for EUIPO proceedings |
| `publicationDefermentIndicator` | boolean | No | Whether publication of design views is deferred |
| `defermentExpirationDate` | string | No | Date when deferment expires (ISO 8601) |
| `effectiveDate` | string | No | Effective date of registration (ISO 8601) |
| `statusDate` | string | No | Date of last status change (ISO 8601) |
| `renewalStatus` | string | No | Renewal status |
| `verbalElement` | string | No | Design name or verbal element |
| `productIndications` | ProductIndication[] | No | Product descriptions in multiple languages |
| `views` | DesignView[] | No | Design view images (up to 7 views) |
| `hasModel` | boolean | No | Whether a 3D model is available |
| `modelFormat` | string | No | 3D model file format |
| `priorities` | object[] | No | Convention priority claims |
| `exhibitionPriorities` | object[] | No | Exhibition priority claims |
| `designers` | DesignPerson[] | No | Named designers |
| `publications` | object[] | No | Official publication events |
| `records` | object[] | No | Registration change records |
| `decisions` | object[] | No | Official decisions |
| `appeals` | object[] | No | Appeal proceedings |
| `prosecutionHistory` | object[] | No | Chronological prosecution history |
| `productNames` | string[] | No | AU: product names for the design |
| `indicators` | object | No | AU: procedural status indicators |
| `relatedDesigns` | object | No | AU: related design numbers by relationship type |
| `statementOfNovelty` | string | No | AU: statement of novelty |
| `imageUrls` | string[] | No | AU: direct image URLs from CDN |

### Design Supporting Types

**DesignPerson**

| Field | Type | Description |
|-------|------|-------------|
| `office` | string? | Office code (e.g., `EM`, `AU`) |
| `identifier` | string? | EUIPO numeric identifier |
| `name` | string? | Person name (may be absent in EU search results) |
| `address` | string? | Formatted address (AU designs) |
| `country` | string? | Country code |

**DesignView**

| Field | Type | Description |
|-------|------|-------------|
| `order` | number | View sequence number (1-7) |
| `imageFormat` | string? | Image format (e.g., `jpg`, `tif`) |
| `thumbnailUrl` | string | Direct URL to thumbnail image |
| `fullImageUrl` | string | Direct URL to full image |
| `viennaClasses` | string[]? | Vienna classification codes for figurative elements |

**ProductIndication**

| Field | Type | Description |
|-------|------|-------------|
| `language` | string | Language code (e.g., `en`, `fr`, `de`) |
| `terms` | string[] | Product indication terms in this language |

---

## Patent Schemas

### PatentSummary

Lightweight patent record returned in search results. Patents use IPC/CPC classification and have inventors alongside applicants.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Normalized ID: `{jurisdiction}-P-{applicationNumber}` |
| `applicationNumber` | string | Yes | Patent application number |
| `serialNumber` | string | No | Serial number assigned by the patent office |
| `pctNumber` | string | No | PCT international application number |
| `wipoNumber` | string | No | WIPO publication number |
| `jurisdiction` | string | Yes | Patent jurisdiction code (e.g., `AU`, `EP`, `US`, `JP`, `CN`). Accepts any 2-4 letter uppercase code to support INPADOC family results. |
| `title` | string | No | Invention title |
| `status` | string | Yes | Lifecycle status: `filed`, `under_examination`, `accepted`, `sealed`, `ceased`, `lapsed`, `expired`, `revoked`, `withdrawn`, `refused`, `unknown` |
| `statusDescription` | string | No | Human-readable status from the patent office |
| `patentType` | string | No | Application type (e.g., `Standard`, `Innovation`, `Provisional`) |
| `filingDate` | string | No | Application date (ISO 8601) |
| `priorityDate` | string | No | Earliest priority date (ISO 8601) |
| `expiryDate` | string | No | Patent expiry date (ISO 8601) |
| `applicants` | object[] | Yes | Current applicants (each with `name` field) |
| `inventors` | object[] | No | Named inventors (each with `name` field) |
| `ipcClassification` | object[] | No | IPC codes (each with `code` and optional `sequence`) |
| `cpcClassification` | object[] | No | CPC codes (each with `code` and optional `sequence`) |
| `familyId` | string | No | INPADOC patent family identifier |

### PatentDetail

Full patent record extending PatentSummary. Returned by `au_patent_status` and `ep_patent_status`.

All PatentSummary fields are included, plus:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `owners` | object[] | No | Current patent owners (may differ from applicants after assignment) |
| `representatives` | object[] | No | Patent attorneys or representatives |
| `pctDetails` | object | No | PCT application details (numbers, national phase entry date) |
| `conventionDetails` | object[] | No | Convention/Paris priority claims |
| `lifecycle` | object | No | Key lifecycle dates (acceptance, sealing, OPI, in-force) |
| `statusHistory` | object[] | No | Chronological status changes |
| `publications` | object[] | No | Publication events (OPI, acceptance) |
| `relatedPatents` | object[] | No | Related patents (divisionals, continuations) |
| `publishedDocuments` | object[] | No | Available documents (specifications, amendments) |
| `abstract` | string | No | Patent abstract text |
| `claims` | string | No | Patent claims text (when available from EPO OPS) |
| `description` | string | No | Patent description/specification text (when available from EPO OPS) |
| `drawings` | object[] | No | Patent drawing image URLs |
| `extensionsOfTerm` | object[] | No | Extensions of patent term (pharmaceutical patents) |
| `conventionApplicationIndicator` | boolean | No | Whether this is a convention application |
| `currentlyUnderOpposition` | boolean | No | Whether the patent is currently under opposition |

---

## Clearance Schemas

### ClearanceResponse

Returned by the `trademark_clearance` tool. Contains conflict analysis, risk assessment, and filing recommendations.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `proposedMark` | string | Yes | The mark that was analyzed |
| `riskLevel` | string | Yes | Overall risk: `low`, `medium`, `high`, `critical` |
| `conflicts` | Conflict[] | Yes | Conflicting marks found, sorted by risk |
| `totalConflicts` | number | Yes | Total number of conflicts found |
| `recommendations` | string[] | Yes | Actionable next steps and filing guidance |
| `searchedJurisdictions` | string[] | Yes | Jurisdictions that were searched |
| `executionTimeMs` | number | Yes | Server-side execution time in milliseconds |
| `gsValidation` | object | No | EUIPO Goods & Services validation results (when `goodsServicesTerms` were provided) |
| `thresholdWarning` | object | No | Present when the similarity threshold excluded well-known marks |

### Conflict

Each conflict describes a potential trademark collision found during clearance analysis.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `trademark` | TrademarkSummary | Yes | The conflicting trademark record |
| `conflictType` | string | Yes | Type of similarity: `exact`, `phonetic`, `visual`, `conceptual` |
| `similarityScore` | number | Yes | Overall similarity score (0-1). Scores >= 0.8 indicate strong conflicts. |
| `overlappingClasses` | number[] | Yes | Nice classes where both marks are registered or applied |
| `riskAssessment` | string | Yes | Human-readable risk assessment explaining the conflict severity |

---

## Distinctiveness Schema

### DistinctivenessResponse

Returned by the `distinctiveness_hints` tool. Assesses where a proposed mark falls on the legal distinctiveness spectrum.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `proposedMark` | string | Yes | The mark that was analyzed |
| `analysis.category` | string | Yes | Position on the spectrum: `fanciful`, `arbitrary`, `suggestive`, `descriptive`, `generic` |
| `analysis.strength` | string | Yes | Registration strength: `strong`, `moderate`, `weak`, `unregistrable` |
| `analysis.reasoning` | string | Yes | Explanation of the distinctiveness assessment |
| `analysis.concerns` | string[] | Yes | Specific concerns about registrability |
| `analysis.recommendations` | string[] | Yes | Suggestions to strengthen the mark |
| `similarRegisteredMarks` | object[] | No | Existing marks that may affect registrability (each with `mark`, `relationship`, `implication`) |

---

## Person Schema

### PersonDetail

Returned by `eu_person_lookup`. Represents an EUIPO applicant or representative with flattened fields from the 6 EUIPO API person variants.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `identifier` | string | Yes | EUIPO numeric person identifier |
| `role` | string | Yes | `applicant` or `representative` |
| `name` | string | Yes | Synthesized display name |
| `type` | string | Yes | Normalized type: `individual`, `business`, `employee`, `legal_association`, `legal_professional`, `euipo_professional` |
| `country` | string | No | Country of nationality or incorporation |
| `firstName` | string | No | First name (individuals and professionals) |
| `surname` | string | No | Surname (individuals and professionals) |
| `legalName` | string | No | Legal entity name (businesses) |
| `legalForm` | string | No | Legal form (businesses) |
| `nationality` | string | No | Nationality |
| `nationalIdentification` | string | No | National ID number (businesses) |
| `countryOfIncorporation` | string | No | Country of incorporation (businesses) |
| `stateOfIncorporation` | string | No | State of incorporation (businesses) |
| `organizationName` | string | No | Organization name (employee representatives) |
| `associationName` | string | No | Association name (legal associations) |
| `countryOfRegistration` | string | No | Country of registration (legal associations) |
| `members` | object[] | No | Members of the organization or association |
| `officialCollegeId` | string | No | Bar registration number (legal professionals) |
| `officialCollegeCountry` | string | No | Country of bar registration |
| `email` | string | No | Contact email |
| `phone` | string | No | Contact phone |
| `representativeStatus` | string | No | Representative status at EUIPO |
| `address` | PersonAddress | No | Primary address |
| `correspondenceAddress` | PersonAddress | No | Correspondence address |

**PersonAddress**

| Field | Type | Description |
|-------|------|-------------|
| `street` | string? | Street address |
| `city` | string? | City |
| `postalCode` | string? | Postal code |
| `state` | string? | State or province |
| `country` | string? | Country |

---

## Common Types

### Pagination

Returned alongside search results to enable paginated retrieval.

| Field | Type | Description |
|-------|------|-------------|
| `cursor` | string? | Opaque pagination token -- pass back to get the next page |
| `hasMore` | boolean | Whether more results are available |
| `totalResults` | number? | Total result count across all pages (may be approximate) |
| `pageSize` | number | Number of results in this page |

### SearchMetadata

Included in `trademark_search` responses with information about the search execution.

| Field | Type | Description |
|-------|------|-------------|
| `query` | string | The search query that was executed |
| `searchType` | string | `name`, `owner`, `number`, or `fuzzy` |
| `jurisdictionsSearched` | string[] | Jurisdictions that were queried |
| `totalResults` | number | Number of results returned in this response |
| `executionTimeMs` | number | Server-side execution time in milliseconds |
| `errors` | object[]? | Per-jurisdiction errors (partial failure). Each entry has `jurisdiction` and `error`. |
