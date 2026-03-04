---
title: "Error Codes Reference"
description: "All error codes returned by IPKit, with descriptions, retry guidance, and example scenarios."
---

IPKit uses a structured error system built around the `TrademarkError` class. Every error includes a machine-readable code, a human-readable message, the originating provider (when applicable), and whether the error is safe to retry.

## Error Format

When a tool call fails, IPKit returns an error in this format:

```
Error [ERROR_CODE]: Human-readable description
Provider: EUIPO
(This error is retryable)
Retry after: 60s
```

The `isError: true` flag is set on the MCP response so that AI clients can distinguish errors from successful results.

## Error Codes

### Client Errors

These errors indicate a problem with the request. They are not retryable without modifying the input.

| Code | HTTP Equivalent | Retryable | Description |
|------|----------------|-----------|-------------|
| `INVALID_INPUT` | 400 | No | The request parameters failed validation. Check the field types, ranges, and required fields. |
| `MISSING_REQUIRED_FIELD` | 400 | No | A required parameter was not provided. |
| `INVALID_JURISDICTION` | 400 | No | The specified jurisdiction code is not recognized. Valid codes: US, EU, AU, NZ, WIPO, GB, CA, JP, CN. |

**Example scenario:** Calling `trademark_search` with `niceClasses: [99]` (valid range is 1-45) returns `INVALID_INPUT`.

### Not Found Errors

These errors indicate the requested resource does not exist in the target registry.

| Code | HTTP Equivalent | Retryable | Description |
|------|----------------|-----------|-------------|
| `TRADEMARK_NOT_FOUND` | 404 | No | No trademark found for the given application or registration number. |
| `DESIGN_NOT_FOUND` | 404 | No | No design found for the given design number. |
| `PATENT_NOT_FOUND` | 404 | No | No patent found for the given application number. |

**Example scenario:** Calling `trademark_status` with a non-existent application number `US-99999999` returns `TRADEMARK_NOT_FOUND`.

### Authentication Errors

These errors indicate a credentials problem. Check your provider API keys or OAuth credentials.

| Code | HTTP Equivalent | Retryable | Description |
|------|----------------|-----------|-------------|
| `AUTH_FAILED` | 401/403 | No | Authentication failed. The provider rejected the API credentials. Check that your API key or OAuth client ID/secret are correct. |
| `AUTH_TOKEN_EXPIRED` | 401 | Yes | The OAuth access token has expired. IPKit will automatically refresh it on the next request. |
| `MISSING_API_KEY` | 401 | No | The request requires an API key but none was provided. Set the appropriate credential environment variable. |

**Example scenario:** Setting an incorrect `EUIPO_CLIENT_SECRET` and calling `trademark_search` with `jurisdictions: ["EU"]` returns `AUTH_FAILED` with `provider: "EUIPO"`.

### Rate Limiting

| Code | HTTP Equivalent | Retryable | Description |
|------|----------------|-----------|-------------|
| `RATE_LIMITED` | 429 | Yes | The upstream provider's rate limit has been exceeded. The error includes a `retryAfterMs` value indicating how long to wait before retrying. |
| `QUOTA_EXCEEDED` | 429 | No | The API key's daily or monthly quota has been exhausted. Contact the server operator to increase the quota or wait for the next billing period. |

**Example scenario:** Rapidly issuing many `trademark_search` requests against EUIPO exceeds the 60 req/min limit. The error includes `retryAfterMs: 60000`.

### Provider Errors

These errors originate from the upstream IP office API. Retryable errors can be safely retried after a short delay.

| Code | HTTP Equivalent | Retryable | Description |
|------|----------------|-----------|-------------|
| `PROVIDER_UNAVAILABLE` | 503 | Yes | The upstream provider is unreachable (DNS failure, connection refused). The service may be temporarily down. Includes `retryAfterMs: 10000`. |
| `PROVIDER_TIMEOUT` | 504 | Yes | The request to the upstream provider timed out. The default timeout is 15 seconds, configurable per provider. Includes `retryAfterMs: 1000`. |
| `PROVIDER_ERROR` | 502 | Yes | The upstream provider returned a server error (HTTP 5xx). Includes `retryAfterMs: 5000`. |
| `PROVIDER_NOT_CONFIGURED` | 503 | No | The requested provider is either disabled via its `ENABLE_*` toggle or missing required credentials. |

**Example scenario:** Calling `trademark_search` with `jurisdictions: ["EU"]` when `EUIPO_CLIENT_ID` is not set returns `PROVIDER_NOT_CONFIGURED` with `provider: "EUIPO"`.

### Internal Errors

| Code | HTTP Equivalent | Retryable | Description |
|------|----------------|-----------|-------------|
| `INTERNAL_ERROR` | 500 | No | An unexpected internal error occurred. This is a catch-all for errors that do not match any specific category. |
| `CACHE_ERROR` | 500 | No | An error occurred reading from or writing to the cache backend. |
| `CONFIG_ERROR` | 500 | No | The server configuration is invalid. Check environment variables and their types/ranges. |

**Example scenario:** A corrupted cache file on disk (when using `CACHE_DIR`) triggers `CACHE_ERROR`.

## Handling Errors Programmatically

The `TrademarkError` class provides the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `code` | `ErrorCode` | Machine-readable error code from the table above |
| `message` | `string` | Human-readable description of what went wrong |
| `provider` | `string?` | Name of the provider that caused the error (e.g., `"EUIPO"`, `"USPTO"`) |
| `retryable` | `boolean` | Whether the request can be retried |
| `retryAfterMs` | `number?` | Suggested wait time before retrying, in milliseconds |
| `details` | `object?` | Additional context (varies by error type) |

## Multi-Jurisdiction Error Handling

When searching across multiple jurisdictions (`jurisdictions: ["ALL"]`), individual provider failures do not cause the entire request to fail. IPKit uses graceful degradation:

- Results from successful providers are returned normally
- Failed providers are listed in the `metadata.errors` array with the jurisdiction code and error message
- The AI client sees both partial results and per-jurisdiction error details

```json
{
  "metadata": {
    "jurisdictionsSearched": ["US", "EU", "AU"],
    "errors": [
      {
        "jurisdiction": "EU",
        "error": "Authentication failed for EUIPO. Check your API credentials."
      }
    ]
  },
  "results": [
    { "jurisdiction": "US", "name": "BRIGHTPATH", "status": "registered" },
    { "jurisdiction": "AU", "name": "BRIGHT PATH", "status": "pending" }
  ]
}
```
