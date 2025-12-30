# Solana Million Pixel - AI Coding Instructions

## Project Overview

A "Million Dollar Homepage" clone on Solana. Users connect wallets, select grid spots on a PixiJS canvas, upload images, and mint pixel ownership. Stack: **Next.js 16 (App Router)**, **Supabase**, **Solana wallet-adapter**, **TanStack Query**, **Zustand**, **PixiJS**.

## Package Manager

**Always use `bun`** - never `npm` or `yarn`:

```bash
bun install          # Install dependencies
bun add <package>    # Add package
bun run dev          # Development server
bun run build        # Production build
```

## Architecture

### Feature-Based Organization (`features/`)

Each feature is self-contained with its own API, components, hooks, stores, and types:

```
features/pixels-grid/
├── api/           # TanStack Query hooks + API functions
├── components/    # Feature-specific React components
├── context/       # React context providers (if needed)
├── hooks/         # Custom hooks
├── stores/        # Zustand stores
├── types/         # TypeScript types (especially api.ts)
└── utils/         # Helper functions
```

### API Layer Pattern (`features/*/api/*.ts`)

- **One file per operation**: `get-spots.ts`, `create-spot.ts`
- **Naming**: `getResourceApi` (function), `useResource` (hook), `getResourceQueryOptions` (query options)
- API functions always end with `Api` suffix
- Use `input` parameter name, support `AbortSignal` for GET requests

```typescript
// Example: features/pixels-grid/api/get-spots.ts
export const getSpotsApi = async (signal?: AbortSignal): Promise<GetSpotsResponse> => {
  return api.get<GetSpotsResponse>("/spots", { signal });
};

export const getSpotsQueryOptions = () => queryOptions({
  queryKey: ["pixels-grid", "spots"],
  queryFn: ({ signal }) => getSpotsApi(signal),
});

export const useSpots = ({ queryConfig }: UseSpotsOptions = {}) => {
  return useQuery({ ...getSpotsQueryOptions(), ...queryConfig });
};
```

### Zustand Stores (`features/*/stores/*.ts`)

- **Module-level actions** (not inside store) - callable from anywhere without hooks
- **Atomic selectors** - one selector per state slice
- Never export the store directly

```typescript
// ✅ Pattern from stores/use-grid-store.ts
const useGridStore = create<GridState>(() => ({ blockSize: "1x1", selection: null }));

export const setBlockSize = (size: BlockSize) => useGridStore.setState({ blockSize: size });
export const useBlockSize = () => useGridStore((state) => state.blockSize);
```

## Environment Variables

Uses `@t3-oss/env-nextjs` with Zod validation. Config at [config/env.ts](config/env.ts).

- Add variables to schema, `runtimeEnv`, and `.env.example`
- Import via `import { env } from "@/config/env"`
- Client vars require `NEXT_PUBLIC_` prefix

## API Routes (`app/api/`)

- Use Next.js Route Handlers
- Server-side uses `supabaseAdmin` (service role key)
- Client-side uses `supabase` (anon key)

## UI Components

- Reusable primitives in `components/ui/` (Base UI + shadcn pattern)
- Feature components live within their feature folder
- Forms use **@tanstack/react-form** with Zod validation
- **Icons**: Use `@phosphor-icons/react` with the `Icon` suffix (e.g., `TrophyIcon`, `UserIcon`). Do not use `lucide-react`.

## Key Files

| Purpose | Location |
|---------|----------|
| Provider composition | [components/providers/providers.tsx](components/providers/providers.tsx) |
| Supabase clients | [lib/supabase.ts](lib/supabase.ts) |
| API client wrapper | [lib/api-client.ts](lib/api-client.ts) |
| React Query config | [lib/react-query.ts](lib/react-query.ts) |
| Grid canvas (PixiJS) | [features/pixels-grid/components/canvas-grid.tsx](features/pixels-grid/components/canvas-grid.tsx) |
| Database schema | [supabase/migrations/](supabase/migrations/) |

## Solana Integration

- Wallet connection via `@solana/wallet-adapter-react`
- Network configurable via `NEXT_PUBLIC_SOLANA_NETWORK` (devnet/testnet/mainnet-beta)
- Phantom and Solflare wallets pre-configured

## Conventions

- TypeScript strict mode
- Path aliases: `@/` maps to project root
- Dark theme default (`html` has `dark` class)
- Toast notifications via `sonner`
- CSS: Tailwind CSS v4
