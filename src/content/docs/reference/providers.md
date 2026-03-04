---
title: "Provider Reference"
description: "Capabilities matrix and configuration details for all 10 IP office providers supported by IPKit."
---

IPKit connects to 10 intellectual property offices worldwide. Each provider implements access to a specific jurisdiction's trademark, design, or patent data. This page documents the capabilities, authentication requirements, and configuration for each provider.

## Capabilities Matrix

| Feature | US | EU | AU | NZ | WIPO | GB | CA | JP | CN | EP |
|---------|:--:|:--:|:--:|:--:|:----:|:--:|:--:|:--:|:--:|:--:|
| **API type** | REST | REST | REST | REST | REST | Scraping | Scraping | Scraping | Scraping | REST |
| **Auth method** | API key | OAuth2 | OAuth2 | API key | None | None | None | None | None | OAuth2 |
| **Trademark search** | Full | Full | Full | Full | Full | Number only | Number only | Number only | Number only | -- |
| **Design search** | -- | Full | Full | -- | -- | -- | -- | -- | -- | -- |
| **Patent search** | -- | -- | Full | -- | -- | -- | -- | -- | -- | Full |
| **Name search** | Yes | Yes | Yes | Yes | Yes | -- | -- | -- | -- | -- |
| **Owner search** | Yes | Yes | Yes | Yes | Yes | -- | -- | -- | -- | -- |
| **Number search** | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | -- |
| **Fuzzy search** | Yes | Yes | Yes | Yes | -- | -- | -- | -- | -- | -- |
| **Status details** | Full | Full | Full | Full | Full | Basic | Basic | Basic | Basic | Full |
| **Nice class filtering** | Yes | Yes | Yes | Yes | Yes | -- | -- | -- | -- | -- |
| **G&S validation** | -- | Yes | -- | -- | -- | -- | -- | -- | -- | -- |
| **Rate limit default** | 60/min | 60/min | 500/min | 60/min | 30/min | 30/min | 30/min | 30/min | 30/min | 30/min |
| **Credentials required** | Yes | Yes | Yes | Yes | No | No | No | No | No | Yes |

**Legend:**
- **Full** -- complete search and detail retrieval via structured API
- **Number only** -- lookup by application or registration number only (no name/owner search)
- **Basic** -- limited status information compared to full API providers
- **Scraping** -- data retrieved via web scraping (less reliable, subject to site changes)

---

## USPTO (United States)

**Full name:** United States Patent and Trademark Office
**Website:** [https://www.uspto.gov](https://www.uspto.gov)
**API documentation:** [USPTO Open Data Portal](https://developer.uspto.gov/)

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `USPTO_API_KEY` | API key from the USPTO developer portal |

### Capabilities

- Full trademark search by name, owner, number, and fuzzy similarity
- Detailed trademark records including prosecution history, goods and services, and owner information
- Status tracking with live/dead classification
- Nice class filtering on search queries

### Notes

- IPKit supports both the legacy TSDR API and the newer Open Data Portal (ODP). Set `USPTO_USE_ODP=true` to use ODP.
- The ODP API uses a different base URL configurable via `USPTO_ODP_BASE_URL`.
- Default rate limit is 60 requests/min, adjustable via `USPTO_RATE_LIMIT`.

---

## EUIPO (European Union)

**Full name:** European Union Intellectual Property Office
**Website:** [https://euipo.europa.eu](https://euipo.europa.eu)
**API documentation:** [EUIPO API Portal](https://euipo.europa.eu/knowledge/course/view.php?id=3598)

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `EUIPO_CLIENT_ID` | OAuth2 client ID from the EUIPO API portal |
| `EUIPO_CLIENT_SECRET` | OAuth2 client secret |

### Optional Environment Variables

| Variable | Description |
|----------|-------------|
| `EUIPO_SANDBOX_CLIENT_ID` | Sandbox OAuth2 client ID (for testing) |
| `EUIPO_SANDBOX_CLIENT_SECRET` | Sandbox OAuth2 client secret |
| `EUIPO_SANDBOX` | Set to `true` to use the sandbox environment (default: `false`) |

### Capabilities

- Full trademark search with name, owner, number, and fuzzy matching
- EU design search with Locarno classification filtering
- Goods and Services validation against the EUIPO Harmonised Database
- G&S translation between EU languages
- Person lookup for applicants and representatives
- Applicant portfolio search across trademarks and designs

### Sub-Clients

EUIPO access is split across four API products sharing the same OAuth2 credentials:

| Client | Purpose | Provider Name |
|--------|---------|---------------|
| Trademark Search | Trademark search and status | `EUIPO` |
| Goods & Services | G&S validation and translation | `EUIPO-GS` |
| Designs Search | Design search and status | `EUIPO-Designs` |
| Persons | Applicant and representative lookup | `EUIPO-Persons` |

All four clients share a single OAuth token cached by provider and client ID.

### Limitations

- The EUIPO API uses RSQL substring matching, not edit-distance fuzzy matching. The query `verbalElement=="*GOOGEL*"` will not find "GOOGLE". IPKit works around this with client-side truncated stem search and ensemble similarity scoring.
- A sandbox environment is available for testing but has intermittent 401 responses (~40% failure rate on token endpoint).
- Nice class filtering uses `=in=` (disjunctive: match marks in ANY listed class).

---

## IP Australia

**Full name:** IP Australia
**Website:** [https://www.ipaustralia.gov.au](https://www.ipaustralia.gov.au)
**API documentation:** [IP Australia API Portal](https://portal.api.ipaustralia.gov.au/)

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `IPAUSTRALIA_CLIENT_ID` | OAuth2 client ID from the IP Australia API portal |
| `IPAUSTRALIA_CLIENT_SECRET` | OAuth2 client secret |

### Optional Environment Variables

| Variable | Description |
|----------|-------------|
| `IPAUSTRALIA_TEST_ENV` | Set to `true` to use the test environment (default: `false`) |

### Capabilities

- Full trademark search with name, owner, number, and fuzzy matching
- AU design search with Locarno classification
- AU patent search with IPC classification
- Detailed records including prosecution history, owners, and representatives

### Sub-Clients

IP Australia access spans three API products sharing the same OAuth2 credentials and rate limit budget:

| Client | Purpose | Provider Name |
|--------|---------|---------------|
| Trade Mark Search | Trademark search and status | `IPAustralia` |
| Design Search | Design search and status | `IPAustralia-Designs` |
| Patent Search | Patent search and status | `IPAustralia-Patents` |

### Notes

- All three clients share a single OAuth token and a single rate limiter (600 req/min Base Tier from IP Australia, IPKit defaults to 500/min).
- The Patent Search API only offers Quick Search (max 50 results per page), not the richer Paged Advanced Search available for trademarks and designs.
- Rate limit adjustable via `IPAUSTRALIA_RATE_LIMIT`.

---

## IPONZ (New Zealand)

**Full name:** Intellectual Property Office of New Zealand
**Website:** [https://www.iponz.govt.nz](https://www.iponz.govt.nz)

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `IPONZ_API_KEY` | API key from the IPONZ API portal |

### Capabilities

- Full trademark search by name, owner, number, and fuzzy similarity
- Detailed trademark records with status history
- Nice class filtering

### Notes

- Default rate limit is 60 requests/min, adjustable via `IPONZ_RATE_LIMIT`.

---

## WIPO (World Intellectual Property Organization)

**Full name:** World Intellectual Property Organization -- Global Brand Database
**Website:** [https://branddb.wipo.int](https://branddb.wipo.int)

### Required Environment Variables

None. The WIPO Global Brand Database API does not require authentication.

### Capabilities

- Full trademark search by name and owner across Madrid System international registrations
- Number lookup for international registration numbers
- Nice class filtering

### Limitations

- Fuzzy search is not supported at the API level.
- The API is undocumented (Solr-like interface). IPKit reverse-engineers the query format.
- Default rate limit is 30 requests/min, adjustable via `WIPO_RATE_LIMIT`.

---

## UKIPO (United Kingdom)

**Full name:** UK Intellectual Property Office
**Website:** [https://www.gov.uk/government/organisations/intellectual-property-office](https://www.gov.uk/government/organisations/intellectual-property-office)

### Required Environment Variables

None. UKIPO data is accessed via web scraping.

### Capabilities

- Trademark lookup by application or registration number
- Basic status information

### Limitations

- No name, owner, or fuzzy search. Only number-based lookup is supported.
- Data is scraped from the UKIPO web interface and is subject to layout changes.
- Limited status detail compared to API-based providers.
- Default rate limit is 30 requests/min, adjustable via `UKIPO_RATE_LIMIT`.

---

## CIPO (Canada)

**Full name:** Canadian Intellectual Property Office
**Website:** [https://ised-isde.canada.ca/site/canadian-intellectual-property-office/en](https://ised-isde.canada.ca/site/canadian-intellectual-property-office/en)

### Required Environment Variables

None. CIPO data is accessed via web scraping.

### Capabilities

- Trademark lookup by application or registration number
- Basic status information

### Limitations

- No name, owner, or fuzzy search. Only number-based lookup is supported.
- Data is scraped from the CIPO web interface.
- Default rate limit is 30 requests/min, adjustable via `CIPO_RATE_LIMIT`.

---

## JPO (Japan)

**Full name:** Japan Patent Office
**Website:** [https://www.jpo.go.jp](https://www.jpo.go.jp)

### Required Environment Variables

None. JPO data is accessed via web scraping.

### Capabilities

- Trademark lookup by application or registration number
- Basic status information

### Limitations

- No name, owner, or fuzzy search. Only number-based lookup is supported.
- The JPO API is in trial phase. IPKit currently uses web scraping.
- Default rate limit is 30 requests/min, adjustable via `JPO_RATE_LIMIT`.

---

## CNIPA (China)

**Full name:** China National Intellectual Property Administration
**Website:** [https://english.cnipa.gov.cn](https://english.cnipa.gov.cn)

### Required Environment Variables

None. CNIPA data is accessed via web scraping.

### Capabilities

- Trademark lookup by application or registration number
- Basic status information

### Limitations

- No name, owner, or fuzzy search. Only number-based lookup is supported.
- Data is scraped from the CNIPA web interface.
- Default rate limit is 30 requests/min, adjustable via `CNIPA_RATE_LIMIT`.

---

## EPO (European Patent Office)

**Full name:** European Patent Office -- Open Patent Services (OPS)
**Website:** [https://www.epo.org](https://www.epo.org)
**API documentation:** [EPO OPS Documentation](https://www.epo.org/en/searching-for-patents/data/web-services/ops)

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `EPO_CONSUMER_KEY` | OAuth2 consumer key from the EPO developer portal |
| `EPO_CONSUMER_SECRET` | OAuth2 consumer secret |

### Capabilities

- Patent search across 130M+ documents worldwide
- Full patent details including abstract, claims, description, and drawings
- INPADOC patent family search across jurisdictions
- IPC and CPC classification
- Patent bibliographic data, publication events, and legal status

### Notes

- EPO OPS uses OAuth2 client-credentials authentication with the token endpoint at `https://ops.epo.org/3.2/auth/accesstoken`.
- The API returns XML-derived JSON with hyphenated keys and `{ $: "value" }` text wrappers. IPKit normalizes these into standard JSON.
- Default rate limit is 30 requests/min, adjustable via `EPO_RATE_LIMIT`.
- EPO is a patent-only provider. It does not provide trademark or design search.
