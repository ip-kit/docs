---
title: "Provider Reference"
description: "Supported jurisdictions and capabilities for all 11 providers in IPKit."
---

IPKit connects to 11 providers -- 10 intellectual property offices plus the Lens.org cross-jurisdiction patent aggregator. All provider credentials are pre-configured on the hosted server.

## Capabilities Matrix

| Feature | US | EU | AU | NZ | WIPO | GB | CA | JP | CN | EP | LENS |
|---------|:--:|:--:|:--:|:--:|:----:|:--:|:--:|:--:|:--:|:--:|:----:|
| **Trademark search** | Full | Full | Full | Full | Full | Number only | Number only | Number only | Number only | -- | -- |
| **Design search** | -- | Full | Full | -- | -- | -- | -- | -- | -- | -- | -- |
| **Patent search** | -- | -- | Full | -- | -- | -- | -- | -- | -- | Full | Full |
| **Name search** | Yes | Yes | Yes | Yes | Yes | -- | -- | -- | -- | -- | -- |
| **Owner search** | Yes | Yes | Yes | Yes | Yes | -- | -- | -- | -- | -- | -- |
| **Number search** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | -- | -- |
| **Fuzzy search** | Yes | Yes | Yes | Yes | -- | -- | -- | -- | -- | -- | -- |
| **Status details** | Full | Full | Full | Full | Full | Basic | Basic | Basic | Basic | Full | Full |
| **Nice class filtering** | Yes | Yes | Yes | Yes | Yes | -- | -- | -- | -- | -- | -- |
| **G&S validation** | -- | Yes | -- | -- | -- | -- | -- | -- | -- | -- | -- |

**Legend:**
- **Full** -- complete search and detail retrieval
- **Number only** -- lookup by application or registration number only (no name/owner search)
- **Basic** -- limited status information compared to full providers

---

## USPTO (United States)

United States Patent and Trademark Office -- [uspto.gov](https://www.uspto.gov)

- Full trademark search by name, owner, number, and fuzzy similarity
- Detailed trademark records including prosecution history, goods and services, and owner information
- Nice class filtering on search queries

---

## EUIPO (European Union)

European Union Intellectual Property Office -- [euipo.europa.eu](https://euipo.europa.eu)

- Full trademark search with name, owner, number, and fuzzy matching
- EU design search with Locarno classification filtering
- Goods and Services validation and translation via the EUIPO Harmonised Database
- Person lookup for applicants and representatives
- Applicant portfolio search across trademarks and designs

---

## IP Australia

IP Australia -- [ipaustralia.gov.au](https://www.ipaustralia.gov.au)

- Full trademark search with name, owner, number, and fuzzy matching
- AU design search with Locarno classification
- AU patent search with IPC classification
- Detailed records including prosecution history, owners, and representatives

---

## IPONZ (New Zealand)

Intellectual Property Office of New Zealand -- [iponz.govt.nz](https://www.iponz.govt.nz)

- Full trademark search by name, owner, number, and fuzzy similarity
- Detailed trademark records with status history
- Nice class filtering

---

## WIPO

World Intellectual Property Organization -- Global Brand Database -- [branddb.wipo.int](https://branddb.wipo.int)

- Full trademark search by name and owner across Madrid System international registrations
- Number lookup for international registration numbers
- Nice class filtering

:::note
Fuzzy search is not supported for WIPO. Use name search with broad terms to catch variations.
:::

---

## UKIPO (United Kingdom)

UK Intellectual Property Office -- [gov.uk/ipo](https://www.gov.uk/government/organisations/intellectual-property-office)

- Trademark lookup by application or registration number
- Basic status information
- No name, owner, or fuzzy search

---

## CIPO (Canada)

Canadian Intellectual Property Office -- [canada.ca/cipo](https://ised-isde.canada.ca/site/canadian-intellectual-property-office/en)

- Trademark lookup by application or registration number
- Basic status information
- No name, owner, or fuzzy search

---

## JPO (Japan)

Japan Patent Office -- [jpo.go.jp](https://www.jpo.go.jp)

- Trademark lookup by application or registration number
- Basic status information
- No name, owner, or fuzzy search

---

## CNIPA (China)

China National Intellectual Property Administration -- [cnipa.gov.cn](https://english.cnipa.gov.cn)

- Trademark lookup by application or registration number
- Basic status information
- No name, owner, or fuzzy search

---

## EPO (European Patent Office)

European Patent Office -- Open Patent Services -- [epo.org](https://www.epo.org)

- Patent search across 130M+ documents worldwide
- Full patent details including abstract, claims, description, and drawings
- INPADOC patent family search across jurisdictions
- IPC and CPC classification
- Patent bibliographic data, publication events, and legal status
- Patent-only provider (no trademark or design search)

---

## Lens.org

Lens.org -- Patent & Scholarly Search -- [lens.org](https://www.lens.org)

- Patent search across 130M+ documents covering 100+ jurisdictions
- Full patent details including bibliographic data, classification, and legal status
- IPC and CPC classification
- **Scholarly-patent citation linkage** via the `lens_prior_art` tool -- connects patent documents to the scholarly articles that cite them or are cited by them. No other IPKit provider offers this.
- Patent-only provider (no trademark or design search)
