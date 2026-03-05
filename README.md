# IPKit Documentation

Documentation site for [IPKit](https://github.com/ip-kit/core) — global IP intelligence for trademarks, designs, and patents.

**Live site:** [docs.ipkit.ai](https://docs.ipkit.ai)

## Stack

- [Starlight](https://starlight.astro.build/) (Astro) — static documentation framework
- [Pagefind](https://pagefind.app/) — client-side search (built-in with Starlight)
- [Vercel](https://vercel.com/) — hosting and deployment

## Development

```bash
npm install
npm run dev       # Start dev server at localhost:4321
npm run build     # Build static site to dist/
npm run preview   # Preview production build locally
```

## Structure

```
src/content/docs/
├── getting-started/    # Audience-specific quickstart guides
├── guides/             # Topical how-to guides
├── reference/
│   ├── tools/          # One page per MCP tool (32 tools)
│   ├── providers.md    # Jurisdiction capabilities matrix
│   ├── configuration.md # Environment variables reference
│   ├── error-codes.md  # Error code reference
│   └── schemas.md      # Data type reference
└── architecture/       # System design and contributor guides
```

## Contributing

Content is written in Markdown (`.md`) or MDX (`.mdx`) in `src/content/docs/`. The directory structure maps directly to URL paths. See the [Astro docs](https://docs.astro.build/) and [Starlight docs](https://starlight.astro.build/) for framework reference.

## License

Proprietary. Copyright (c) 2026 IPKit. All rights reserved.
