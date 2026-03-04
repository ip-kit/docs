---
title: "Validate Your Brand Name in 5 Minutes"
description: "A quick-start guide for founders to search trademarks, run clearance analysis, and assess brand name risk using IPKit."
---

IPKit is an AI-powered IP intelligence tool that searches trademark registries across 10 jurisdictions worldwide. It connects directly to your AI assistant (Claude Desktop or ChatGPT), so you can check whether your proposed brand name is clear to use -- without logging into separate trademark databases or hiring a search firm upfront.

## Install IPKit

Add IPKit to Claude Desktop by editing your configuration file:

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

Restart Claude Desktop after saving. You should see IPKit listed as an available tool in the input area.

:::note
This uses IPKit's hosted server -- no local setup or API credentials required. All searches run against live trademark office data.
:::

## Step 1: Search Your Proposed Name

Ask Claude to search for your brand name across all jurisdictions:

> "Search for trademarks similar to 'CloudBooks' across all jurisdictions."

Behind the scenes, this calls the `trademark_search` tool with your name and `jurisdiction: "ALL"`. IPKit queries the US (USPTO), EU (EUIPO), Australia, New Zealand, WIPO, UK, Canada, Japan, and China in parallel.

You will get back a list of existing trademarks that match or are similar to your proposed name, including:

- **Mark name** and any variations
- **Jurisdiction** where it is registered
- **Status** (registered, pending, abandoned, expired)
- **Nice classes** (the categories of goods/services the mark covers)
- **Owner** name

If you see zero results, that is a good sign -- but it does not mean the name is clear. Move on to Step 2 for a deeper analysis.

### Narrow your search

If you already know your target markets, specify them:

> "Search for trademarks matching 'CloudBooks' in the US and EU, classes 9 and 42."

This is faster and more focused. Use `suggest_nice_classes` if you are not sure which classes apply to your product:

> "What Nice classes should I use for a cloud-based bookkeeping SaaS product?"

## Step 2: Run Clearance Analysis

A search shows you what exists. Clearance analysis tells you whether those existing marks actually conflict with yours.

> "Run a trademark clearance analysis for 'CloudBooks' in classes 9 and 42, searching the US and EU."

The `trademark_clearance` tool does a comprehensive conflict search that goes beyond exact name matching. It checks for:

- **Phonetic similarity** -- marks that sound like yours (e.g., "KloudBuks")
- **Visual similarity** -- marks that look like yours in print
- **Conceptual similarity** -- marks that convey the same meaning
- **Nice class overlap** -- marks in the same or related product categories

Each potential conflict is scored and assigned a risk level.

## Step 3: Interpret the Results

The clearance report gives you an **overall risk level**:

| Risk Level | What It Means | What to Do |
|------------|---------------|------------|
| **Low** | Few or no meaningful conflicts found | Proceed with confidence, but consider an attorney review before filing |
| **Medium** | Some similar marks exist, but differences may be sufficient | Get professional advice -- the conflicts may or may not block you |
| **High** | Significant conflicts in your target classes or jurisdictions | Strongly consider modifying the name or narrowing your goods/services |
| **Critical** | Near-identical marks registered for the same goods/services | Choose a different name -- filing would very likely be refused or opposed |

The report also includes **specific recommendations** explaining why each conflict was flagged and what the risk factors are.

### Reading individual conflicts

Each conflict in the report includes:

- **Similarity score** (0 to 1) -- higher means more similar
- **Risk assessment** -- why this mark is a concern
- **Class overlap** -- whether the conflicting mark covers the same goods/services
- **Status** -- a registered mark is a bigger obstacle than an abandoned one

## Step 4: Check Distinctiveness

Even if no conflicts exist, your name needs to be distinctive enough to qualify for trademark registration. Trademark offices reject names that simply describe what the product does.

> "Analyze the distinctiveness of 'CloudBooks' for cloud-based bookkeeping software."

The `distinctiveness_hints` tool evaluates where your name falls on the legal distinctiveness spectrum:

| Category | Strength | Example | Registrable? |
|----------|----------|---------|--------------|
| **Fanciful** | Strongest | Xerox, Kodak | Yes -- invented words are highly protectable |
| **Arbitrary** | Strong | Apple (for computers) | Yes -- real word, unrelated to the product |
| **Suggestive** | Moderate | Netflix, Pinterest | Yes -- hints at the product but requires thought |
| **Descriptive** | Weak | "CloudBooks" for cloud bookkeeping | Maybe -- requires proof of brand recognition |
| **Generic** | None | "Bookkeeping Software" | No -- can never be trademarked |

If your name scores as **descriptive** or **generic**, consider modifying it before investing in a filing. The tool provides specific suggestions for strengthening weak marks.

## Step 5: Draft Your Goods and Services

If clearance looks favorable, get a head start on the filing by generating a goods and services specification:

> "Generate a goods and services specification for a cloud-based bookkeeping SaaS product targeting the US and EU."

The `generate_gs_specification` tool produces jurisdiction-specific specification text formatted for the relevant trademark office (USPTO TEAS Plus, EUIPO TMclass, or Madrid Protocol). This gives your attorney ready-to-review draft language rather than starting from scratch.

Not sure which classes to include? The `suggest_nice_classes` tool maps your business description to the correct Nice classes:

> "Suggest Nice classes for a company that makes cloud bookkeeping software with invoicing, expense tracking, and payroll integration."

## Iterating on Names

One of the biggest advantages of having IPKit in your AI assistant is speed of iteration. If your first-choice name has conflicts, you can test alternatives immediately:

> "Run clearance for 'Ledgerly' in classes 9 and 42 in the US and EU."

> "Compare the distinctiveness of 'Ledgerly' vs 'QuickLedger' vs 'Fynari' for bookkeeping software."

You can evaluate half a dozen name candidates in a single conversation, each with full clearance analysis and distinctiveness scoring. This turns what used to be a multi-week naming process into an afternoon.

## Next Steps

IPKit gives you a fast, data-driven starting point. Here is what to do with the results:

1. **Low risk + strong distinctiveness:** You are in good shape. Consult a trademark attorney to file your application. The clearance report gives them a head start.

2. **Medium risk or descriptive mark:** Talk to an attorney before deciding. They can assess whether the conflicts are truly blocking and whether your mark has arguments for registration.

3. **High/critical risk:** Go back to the drawing board. Try variations of your name and re-run the clearance analysis. IPKit makes iteration fast.

:::caution
IPKit is a search and analysis tool, not legal advice. Trademark law involves nuanced judgments about likelihood of confusion, geographic scope, and common law rights that require professional assessment. Always consult a qualified IP attorney before making filing decisions.
:::

## Supported Jurisdictions

IPKit searches these trademark offices:

| Office | Code | Coverage |
|--------|------|----------|
| USPTO (United States) | US | Full name, owner, and fuzzy search |
| EUIPO (European Union) | EU | Full search + designs, G&S validation |
| IP Australia | AU | Full search + designs and patents |
| IPONZ (New Zealand) | NZ | Full name and owner search |
| WIPO (Madrid System) | WIPO | Full search across international registrations |
| EPO (European Patent Office) | EP | Patent search (130M+ documents) |
| UKIPO (United Kingdom) | GB | Number lookup only |
| CIPO (Canada) | CA | Number lookup only |
| JPO (Japan) | JP | Number lookup only |
| CNIPA (China) | CN | Number lookup only |

When you search "all jurisdictions," IPKit queries every office that supports name search in parallel and combines the results.

## What Else Can IPKit Do?

Beyond the founder workflow above, IPKit offers:

- **Design search** -- search EU and Australian industrial design registrations
- **Patent search** -- search Australian and European patents (130M+ documents via EPO)
- **Portfolio monitoring** -- set up watches for status changes, similar filings, and approaching deadlines
- **Goods and services drafting** -- generate filing-ready G&S specifications
- **G&S validation** -- check your specification terms against the EUIPO Harmonised Database

Explore the full capabilities in the [Tool Reference](/reference/tools/trademark/trademark-search/).
