---
title: "Multi-Jurisdiction Clearance Workflow"
description: "A professional clearance workflow for IP attorneys and paralegals using IPKit across 9 trademark offices."
---

IPKit provides normalized trademark search results across 9 jurisdictions through a single interface, with additional patent coverage via EPO and Lens.org. It integrates directly with Claude Desktop or ChatGPT, giving you clearance search, Nice class analysis, goods and services drafting, and filing readiness assessment without switching between individual trademark office websites.

This guide walks through a complete clearance workflow suitable for professional use.

## Installation

Add IPKit to your Claude Desktop configuration:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ipkit": {
      "command": "npx",
      "args": [
        "-y", "mcp-remote",
        "https://ipkit.fly.dev/mcp",
        "--header", "Authorization:Bearer YOUR_API_KEY"
      ]
    }
  }
}
```

Restart Claude Desktop after saving.

## Phase 1: Nice Class Selection

Before searching, establish the correct Nice classes for your client's goods and services. Misclassified searches produce both false positives and false negatives.

### Suggest classes from a business description

> "Suggest Nice classes for a company that provides cloud-based legal practice management software with document automation and client billing."

The `suggest_nice_classes` tool analyzes the description and recommends classes with explanations. For the example above, you would likely see classes 9 (software), 35 (business management), 36 (financial services), 42 (SaaS/technology services), and possibly 45 (legal services).

### Verify class scope

Confirm what each recommended class covers:

> "Look up Nice class 42 and show me the full description with examples."

The `nice_class_lookup` tool returns the official class heading, common goods/services, and related classes. It also identifies product-service class pairs (e.g., class 9 software products often pair with class 42 software services).

## Phase 2: Clearance Search

### Primary clearance analysis

Run the comprehensive clearance tool with your target classes and jurisdictions:

> "Run trademark clearance for 'LexFlow' in classes 9, 35, and 42 across the US, EU, and AU."

The `trademark_clearance` tool executes a multi-layered search:

1. **Exact and substring matching** against each jurisdiction's database
2. **Truncated stem search** for marks longer than 4 characters (catches prefix-similar marks that substring matching misses)
3. **Famous marks pre-check** against approximately 200 well-known marks (catches misspellings that registry search misses, e.g., "GOOGEL" matching "GOOGLE")
4. **Ensemble similarity scoring** combining Jaro-Winkler distance, n-gram overlap, Damerau-Levenshtein distance, and jurisdiction-aware phonetic algorithms

Each conflict is scored and assessed with an overall risk level (low/medium/high/critical) and specific recommendations.

### Supplementary targeted searches

For conflicts that require closer examination, or to broaden coverage beyond the clearance tool's automated scope:

> "Search for trademarks owned by 'LexFlow Technologies' in the US and EU."

The `trademark_search` tool supports multiple search types:

| Search Type | Use Case |
|-------------|----------|
| `name` | Find marks containing a specific string |
| `fuzzy` | Similarity search with ensemble scoring (threshold 0.7) |
| `owner` | Search by applicant/owner name |
| `number` | Look up a specific application or registration number |

### Jurisdiction-aware phonetic matching

IPKit uses different phonetic algorithms depending on the jurisdiction:

| Jurisdiction | Algorithm | Why |
|--------------|-----------|-----|
| US, GB, CA | NYSIIS | Optimized for English name patterns |
| EU | Cologne Phonetic | Handles German/continental European consonant patterns |
| AU, NZ | Caverphone | Regional pronunciation patterns |
| JP, CN | Disabled | Not applicable to CJK characters |
| WIPO | Double Metaphone | General-purpose cross-linguistic fallback |

This means the same clearance search produces different phonetic similarity scores depending on the jurisdiction, reflecting how examiners in each office would assess aural similarity.

## Phase 3: Deep-Dive on Conflicts

For each material conflict flagged by the clearance analysis, pull full details:

> "Get the full status and history for trademark US-97123456."

The `trademark_status` tool returns:

- Current registration status and all lifecycle dates
- Complete goods and services specification
- Owner/applicant details and representative information
- Status history (where available)
- Priority claims and convention details

This is the data you need to assess whether a conflict is genuinely blocking or distinguishable.

## Phase 4: Goods and Services Specification

### Generate specifications

Once classes are confirmed and clearance looks favorable, draft the filing specification:

> "Generate a goods and services specification for a cloud-based legal practice management platform with document automation, client billing, and calendar integration. Target the US and EU, classes 9 and 42."

The `generate_gs_specification` tool produces jurisdiction-specific specification text:

- **US (USPTO):** TEAS Plus/Standard compatible language
- **EU (EUIPO):** TMclass compatible terms
- **WIPO (Madrid Protocol):** Madrid-compatible specifications

### Validate against EUIPO Harmonised Database

For EU filings, verify that your terms are pre-approved:

> "Validate these G&S terms against the EUIPO Harmonised Database: 'Computer software for legal practice management' in class 9."

The `validate_gs_terms` tool checks each term against the HDB and reports:

- Whether the term is **harmonized** (pre-approved by all EU offices for faster examination)
- Any **errors** (invalid characters, forbidden terms, syntax issues)
- Any **warnings** (duplicated terms, length recommendations)

### Translate for multi-language filings

EUIPO applications require filing in two languages. Madrid Protocol filings may need multiple translations:

> "Translate 'Computer software for legal practice management' from English to French and German."

The `translate_gs_terms` tool uses HDB-harmonized translations across 23 EU official languages, ensuring the translated terms are also pre-approved.

## Phase 5: Filing Readiness Assessment

Use the built-in clearance prompt to generate a structured filing readiness summary:

> "Assess filing readiness for 'LexFlow' in classes 9 and 42 for the US and EU markets."

This produces a structured assessment covering:

- Clearance search summary with risk level
- Distinctiveness evaluation
- Recommended filing strategy (direct national vs. Madrid Protocol)
- Identified conflicts requiring attorney judgment
- Suggested next steps

## Multi-Jurisdiction Strategy

Different markets call for different search strategies:

| Market | Primary Search | Why |
|--------|---------------|-----|
| United States | US + WIPO | USPTO database plus Madrid designations targeting the US |
| European Union | EU + WIPO | EUIPO covers all 27 member states; WIPO covers Madrid designations |
| Australia / NZ | AU + NZ + WIPO | Trans-Tasman markets often filed together |
| United Kingdom | GB + EU + WIPO | Post-Brexit, GB is separate from EU; many EU marks have UK equivalents |
| Global launch | ALL | Search all 9 jurisdictions simultaneously |

:::tip
When searching "ALL" jurisdictions, IPKit queries all configured offices in parallel. If a provider fails (e.g., rate limit or temporary outage), the results include partial data with per-jurisdiction error information in the metadata. Check `metadata.errors` in the response.
:::

## Monitoring and Portfolio Management

After filing, set up ongoing monitoring:

> "Create a watch for status changes on trademark EU-018901234."

> "Create a similar-filing watch for 'LexFlow' in classes 9 and 42 across the US and EU."

The monitoring system tracks status transitions, new conflicting filings, and approaching deadlines (opposition periods, renewals, expiry). Webhook delivery is available for external integrations. See the [Monitoring guide](/guides/monitoring/) for details.

## Limitations and Disclaimers

**What IPKit provides:**
- Normalized search results from 10 trademark offices
- Algorithmic similarity analysis (phonetic, visual, conceptual)
- Nice class recommendations and G&S specification drafting
- Structured risk assessments with scoring

**What IPKit does not replace:**
- Professional judgment on likelihood of confusion
- Common law trademark searches (unregistered rights, state registrations, domain names)
- Logo and design mark similarity analysis (word marks only)
- Official legal opinions or attorney-client privilege
- Direct filing with trademark offices

**Data currency:** Results come from live queries against trademark office APIs. However, most offices have a publication lag of days to weeks between filing and database availability. Very recent filings may not appear in search results.

**Jurisdiction coverage:** US, EU, AU, NZ, and WIPO provide full search capabilities. GB, CA, JP, and CN are limited to number-based lookups only (no name or owner search).
