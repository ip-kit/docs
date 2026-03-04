---
title: "Adding a New Provider"
description: "Step-by-step guide to adding a new IP office jurisdiction to IPKit, with full code examples."
---

This guide walks through adding a new trademark provider to IPKit. Each provider follows the same three-file pattern: types, client, transformer. The example below uses a hypothetical "KPO" (Korean Intellectual Property Office) provider.

## Overview

Adding a new provider requires changes in 7 areas:

1. Create `types.ts` -- API response types
2. Create `client.ts` -- provider implementation
3. Create `transformer.ts` -- response normalization
4. Register in `providers/index.ts`
5. Add jurisdiction to `schemas/common.ts`
6. Add config to `config.ts`
7. Update hardcoded jurisdiction lists

## Step 1: API Response Types

Create `src/providers/kpo/types.ts` with TypeScript interfaces that model the raw API response shapes before normalization.

```typescript
/**
 * KPO API response types (raw, before normalization)
 */

export interface KPOSearchResponse {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  results: KPOTrademarkRecord[];
}

export interface KPOTrademarkRecord {
  applicationNumber: string;
  registrationNumber?: string;
  markName: string;
  markNameEnglish?: string;
  applicantName: string;
  status: string;
  applicationDate: string;       // YYYYMMDD format
  registrationDate?: string;     // YYYYMMDD format
  niceClassCodes: string[];      // e.g., ["009", "042"]
  imageUrl?: string;
}

export interface KPODetailResponse extends KPOTrademarkRecord {
  goodsAndServices: Array<{
    classCode: string;
    description: string;
  }>;
  applicantAddress?: string;
  representativeName?: string;
  expirationDate?: string;
}
```

Keep these types as close to the actual API shapes as possible. Normalization happens in the transformer.

## Step 2: Provider Client

Create `src/providers/kpo/client.ts` implementing the `TrademarkProvider` interface.

```typescript
import { config } from '../../config.js';
import {
  TrademarkError,
  ErrorCode,
  handleProviderError,
} from '../../errors/index.js';
import { RateLimiter } from '../../utils/rateLimiter.js';
import { withRetry } from '../../utils/retry.js';
import type {
  TrademarkProvider,
  SearchParams,
  SearchResult,
} from '../types.js';
import type { KPOSearchResponse, KPODetailResponse } from './types.js';
import {
  transformKPOSummary,
  transformKPODetail,
} from './transformer.js';

const PROVIDER_NAME = 'KPO';
const BASE_URL = 'https://api.kipo.go.kr/v1';

export class KPOClient implements TrademarkProvider {
  readonly jurisdiction = 'KR' as const;
  private rateLimiter: RateLimiter;

  constructor() {
    this.rateLimiter = new RateLimiter(config.kpoRateLimit ?? 30);
  }

  isConfigured(): boolean {
    return config.enableKpo && !!config.kpoApiKey;
  }

  async search(params: SearchParams): Promise<SearchResult> {
    if (!this.isConfigured()) {
      throw new TrademarkError({
        code: ErrorCode.PROVIDER_NOT_CONFIGURED,
        message: 'KPO provider not configured',
        provider: PROVIDER_NAME,
        retryable: false,
      });
    }

    await this.rateLimiter.acquire();

    return withRetry(async () => {
      const url = new URL(`${BASE_URL}/trademarks/search`);
      url.searchParams.set('query', params.query);
      url.searchParams.set('searchType', params.searchType);
      url.searchParams.set('pageSize', String(params.limit));

      if (params.niceClasses?.length) {
        url.searchParams.set(
          'classes',
          params.niceClasses.join(','),
        );
      }

      if (params.cursor) {
        url.searchParams.set('page', params.cursor);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${config.kpoApiKey}`,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(
          config.defaultFetchTimeout,
        ),
      });

      if (!response.ok) {
        throw handleProviderError(
          { response: { status: response.status } },
          PROVIDER_NAME,
        );
      }

      const data: KPOSearchResponse = await response.json();

      return {
        trademarks: data.results.map(transformKPOSummary),
        pagination: {
          hasMore:
            data.currentPage * data.pageSize < data.totalCount,
          cursor: String(data.currentPage + 1),
          totalResults: data.totalCount,
        },
      };
    });
  }

  async getDetails(identifier: string) {
    if (!this.isConfigured()) {
      throw new TrademarkError({
        code: ErrorCode.PROVIDER_NOT_CONFIGURED,
        message: 'KPO provider not configured',
        provider: PROVIDER_NAME,
        retryable: false,
      });
    }

    await this.rateLimiter.acquire();

    return withRetry(async () => {
      const response = await fetch(
        `${BASE_URL}/trademarks/${identifier}`,
        {
          headers: {
            Authorization: `Bearer ${config.kpoApiKey}`,
            Accept: 'application/json',
          },
          signal: AbortSignal.timeout(
            config.defaultFetchTimeout,
          ),
        },
      );

      if (!response.ok) {
        throw handleProviderError(
          { response: { status: response.status } },
          PROVIDER_NAME,
        );
      }

      const data: KPODetailResponse = await response.json();
      return transformKPODetail(data);
    });
  }

  async getStatus(
    identifier: string,
    options?: {
      includeHistory?: boolean;
      includeDocuments?: boolean;
    },
  ) {
    const detail = await this.getDetails(identifier);
    return {
      trademark: detail,
      currentStatus: {
        code: detail.status,
        description: detail.statusDescription ?? detail.status,
        date: detail.statusDate ?? detail.filingDate ?? '',
        isLive:
          detail.status === 'registered' ||
          detail.status === 'pending',
      },
    };
  }
}
```

Key patterns to follow:

- **Always check `isConfigured()`** at the start of every method
- **Always call `this.rateLimiter.acquire()`** before making API requests
- **Always wrap API calls with `withRetry()`** for transient error handling
- **Always use `handleProviderError()`** to convert HTTP errors to `TrademarkError`
- **Always use `AbortSignal.timeout()`** to enforce request timeouts

## Step 3: Response Transformer

Create `src/providers/kpo/transformer.ts` to normalize API responses into the standard schemas.

```typescript
import type {
  TrademarkSummary,
  TrademarkDetail,
} from '../../schemas/trademark.js';
import type { TrademarkStatus } from '../../schemas/common.js';
import { formatTrademarkId } from '../../utils/idFormat.js';
import type {
  KPOTrademarkRecord,
  KPODetailResponse,
} from './types.js';

const JURISDICTION = 'KR';

/**
 * Convert KPO date format (YYYYMMDD) to ISO 8601 (YYYY-MM-DD).
 */
function formatDate(kpoDate: string | undefined): string | undefined {
  if (!kpoDate || kpoDate.length !== 8) return undefined;
  return `${kpoDate.slice(0, 4)}-${kpoDate.slice(4, 6)}-${kpoDate.slice(6, 8)}`;
}

/**
 * Normalize KPO status strings to the TrademarkStatus enum.
 */
function normalizeStatus(kpoStatus: string): TrademarkStatus {
  const statusMap: Record<string, TrademarkStatus> = {
    REGISTERED: 'registered',
    FILED: 'pending',
    EXAMINATION: 'pending',
    PUBLISHED: 'pending',
    WITHDRAWN: 'abandoned',
    REFUSED: 'abandoned',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired',
    OPPOSED: 'opposed',
  };
  return statusMap[kpoStatus.toUpperCase()] ?? 'unknown';
}

/**
 * Parse Nice class codes ("009" -> 9).
 */
function parseNiceClasses(codes: string[]): number[] {
  return codes
    .map((c) => parseInt(c, 10))
    .filter((n) => n >= 1 && n <= 45);
}

export function transformKPOSummary(
  record: KPOTrademarkRecord,
): TrademarkSummary {
  return {
    id: formatTrademarkId(JURISDICTION, record.applicationNumber),
    applicationNumber: record.applicationNumber,
    registrationNumber: record.registrationNumber,
    name: record.markNameEnglish ?? record.markName,
    jurisdiction: JURISDICTION,
    status: normalizeStatus(record.status),
    filingDate: formatDate(record.applicationDate),
    registrationDate: formatDate(record.registrationDate),
    niceClasses: parseNiceClasses(record.niceClassCodes),
    owner: record.applicantName,
    imageUrl: record.imageUrl,
  };
}

export function transformKPODetail(
  record: KPODetailResponse,
): TrademarkDetail {
  const summary = transformKPOSummary(record);
  return {
    ...summary,
    goodsAndServices: record.goodsAndServices?.map((gs) => ({
      classNumber: parseInt(gs.classCode, 10),
      description: gs.description,
    })),
    applicant: record.applicantAddress
      ? { name: record.applicantName, address: record.applicantAddress }
      : { name: record.applicantName },
    representative: record.representativeName
      ? { name: record.representativeName }
      : undefined,
    expirationDate: formatDate(record.expirationDate),
  };
}
```

Key patterns:

- **Dates** -- always convert to ISO 8601 format (`YYYY-MM-DD`)
- **Status** -- map every provider-specific status string to one of: `registered`, `pending`, `abandoned`, `cancelled`, `expired`, `opposed`, `unknown`
- **IDs** -- use `formatTrademarkId()` to produce the normalized `{JURISDICTION}-{number}` format
- **Nice classes** -- parse to integers in the range 1-45

## Step 4: Register the Provider

Add the new provider to `src/providers/index.ts`:

```typescript
export { KPOClient } from './kpo/client.js';

import { KPOClient } from './kpo/client.js';

// In createProviderRegistry():
export function createProviderRegistry(): ProviderRegistry {
  const registry = new ProviderRegistry();
  // ... existing providers ...
  registry.register(new KPOClient());
  return registry;
}
```

## Step 5: Add the Jurisdiction Code

Update `src/schemas/common.ts` to include the new jurisdiction:

```typescript
export const JurisdictionSchema = z.enum([
  'US', 'EU', 'AU', 'NZ', 'WIPO', 'GB', 'CA', 'JP', 'CN',
  'KR',  // <-- add here
]);

export const JurisdictionFilterSchema = z.enum([
  'US', 'EU', 'AU', 'NZ', 'WIPO', 'GB', 'CA', 'JP', 'CN',
  'KR',  // <-- add here
  'ALL',
]);
```

## Step 6: Add Configuration

### `src/config.ts`

Add fields to the `ConfigSchema` and `loadConfig()`:

```typescript
// In ConfigSchema:
kpoApiKey: z.string().optional(),
kpoRateLimit: z.number().min(1).default(30),
enableKpo: z.boolean().default(true),

// In loadConfig():
kpoApiKey: process.env['KPO_API_KEY'],
kpoRateLimit: parseNumber(process.env['KPO_RATE_LIMIT'], 30),
enableKpo: parseBoolean(process.env['ENABLE_KPO'], true),
```

### `.env.example`

```bash
# KPO (Korean Intellectual Property Office)
KPO_API_KEY=
KPO_RATE_LIMIT=30
ENABLE_KPO=true
```

## Step 7: Update Hardcoded Jurisdiction Lists

Human-readable description strings in tool schemas do not auto-update from the Zod enum. After adding a provider, search for and update jurisdiction lists in:

- **`src/server.ts`** -- tool description strings that list supported jurisdictions
- **`src/tools/trademarkSearch.ts`** -- `jurisdictions` parameter `.describe()` text
- **`src/tools/trademarkClearance.ts`** -- `jurisdictions` parameter `.describe()` text
- **`src/tools/trademarkStatus.ts`** -- `identifier` parameter `.describe()` text

You can find all locations with:

```bash
grep -rn "US, EU, AU" src/
```

## Step 8: Write Tests

Create `tests/unit/providers/kpo/` with tests for the client, transformer, and integration.

### Transformer Tests

```typescript
import { describe, it, expect } from 'vitest';
import { transformKPOSummary } from '../../../../src/providers/kpo/transformer.js';

describe('transformKPOSummary', () => {
  it('normalizes a KPO trademark record', () => {
    const result = transformKPOSummary({
      applicationNumber: '4020230001234',
      markName: 'Test Mark',
      applicantName: 'Test Corp',
      status: 'REGISTERED',
      applicationDate: '20230115',
      niceClassCodes: ['009', '042'],
    });

    expect(result.id).toBe('KR-4020230001234');
    expect(result.jurisdiction).toBe('KR');
    expect(result.status).toBe('registered');
    expect(result.filingDate).toBe('2023-01-15');
    expect(result.niceClasses).toEqual([9, 42]);
  });
});
```

### Client Tests

Follow the pattern in `tests/unit/providers/euipo/client.test.ts`:

1. Mock shared modules (`shared.js`, `retry.js`) using `vi.mock()`
2. Spy on `globalThis.fetch` to control API responses
3. Test `isConfigured()`, `search()`, `getDetails()`, `getStatus()`
4. Test error handling for HTTP 401, 404, 429, 500

## Checklist

Before submitting:

- [ ] `types.ts`, `client.ts`, `transformer.ts` created in `src/providers/kpo/`
- [ ] Provider registered in `src/providers/index.ts`
- [ ] Jurisdiction added to `JurisdictionSchema` and `JurisdictionFilterSchema` in `src/schemas/common.ts`
- [ ] Config fields added to `src/config.ts` (schema, loadConfig, env var mapping)
- [ ] `.env.example` updated with new env vars
- [ ] All hardcoded jurisdiction lists updated (tool descriptions, CLAUDE.md)
- [ ] Unit tests for transformer and client
- [ ] `npm run typecheck` passes
- [ ] `npm run ci` passes (typecheck + lint + test + build)
- [ ] Test count assertions updated (check for `toHaveLength(N)` in test files)
