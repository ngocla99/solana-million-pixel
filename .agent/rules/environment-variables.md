# Environment Variables Configuration

Uses **`@t3-oss/env-nextjs`** for type-safe, validated environment variables with Zod schemas. Config in `src/config/env.ts`.

## File Structure

```
├── .env                    # Local environment variables (gitignored)
├── .env.example            # Template with documentation
└── src/config/env.ts       # Environment schema & validation
```

## Config Example (`src/config/env.ts`)

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    FAL_AI_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    FAL_AI_API_KEY: process.env.FAL_AI_API_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
```

## Adding New Variables

### 1. Add to Schema

```typescript
server: {
  MY_SECRET_KEY: z.string().min(1),
},
client: {
  NEXT_PUBLIC_MY_FLAG: z.boolean().default(false),
},
runtimeEnv: {
  MY_SECRET_KEY: process.env.MY_SECRET_KEY,
  NEXT_PUBLIC_MY_FLAG: process.env.NEXT_PUBLIC_MY_FLAG,
},
```

### 2. Update .env.example & .env

```bash
MY_SECRET_KEY=your-secret-key
NEXT_PUBLIC_MY_FLAG=true
```

### 3. Use in Code

```typescript
import { env } from "@/config/env";

// Server-side
const secretKey = env.MY_SECRET_KEY;

// Client-side
const flag = env.NEXT_PUBLIC_MY_FLAG;
```

## Common Zod Validators

```typescript
z.string().min(1); // Non-empty string
z.url(); // Valid URL
z.string().default("value"); // With default
z.coerce.number(); // String → number
z.number().positive(); // Must be > 0
z.enum(["dev", "prod"]); // One of values
z.coerce.boolean(); // String → boolean
```

## Client vs Server Variables

| Type       | Prefix          | Exposed to Browser | Use Case                             |
| ---------- | --------------- | ------------------ | ------------------------------------ |
| **Client** | `NEXT_PUBLIC_*` | ✅ Yes             | API URLs, public keys, feature flags |
| **Server** | No prefix       | ❌ No              | API keys, secrets, credentials       |

## Usage Examples

```typescript
// API Route
import { env } from "@/config/env";

export async function POST() {
  const apiKey = env.FAL_AI_API_KEY; // Server-only
  // ...
}

// Client Component
("use client");
import { env } from "@/config/env";

const apiUrl = env.NEXT_PUBLIC_BASE_API_URL; // OK
// const secret = env.FAL_AI_API_KEY; // ❌ Fails
```

## Build-Time Validation

```bash
bun run build

# If validation fails:
# ❌ Invalid environment variables:
# { FAL_AI_API_KEY: ["Required"] }

# Skip for Docker/CI:
SKIP_ENV_VALIDATION=true bun run build
```

## ✅ Do's

```typescript
// Always use env import
import { env } from "@/config/env";
const url = env.NEXT_PUBLIC_SUPABASE_URL;

// Add validation
MY_API_KEY: z.string().min(1),

// Provide defaults
TIMEOUT_MS: z.coerce.number().default(5000),
```

## ❌ Don'ts

```typescript
// Don't use process.env directly
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!; // ❌

// Don't hardcode values
.createSignedUrl(path, 3600); // ❌

// Don't expose secrets client-side
NEXT_PUBLIC_SECRET_KEY: z.string(), // ❌

// Don't forget runtimeEnv mapping
server: { MY_VAR: z.string() },
runtimeEnv: { /* Missing MY_VAR! */ }, // ❌
```

## Troubleshooting

| Problem                      | Solution                                                 |
| ---------------------------- | -------------------------------------------------------- |
| Build fails with invalid env | Check `.env` format, verify schema matches expected type |
| Variable is `undefined`      | Check in `.env`, add to `runtimeEnv`, restart dev server |
| Client var not available     | Ensure `NEXT_PUBLIC_` prefix, add to `client` section    |
| TypeScript errors            | Add to schema + `runtimeEnv`, restart TS server          |
