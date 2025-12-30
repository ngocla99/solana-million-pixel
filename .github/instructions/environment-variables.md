---
description: 'Guidelines for type-safe environment variable management'
applyTo: '**/env.ts, **/.env*, **/config/env.ts'
---

# Environment Variables Configuration Guide

You are an expert TypeScript developer specializing in type-safe environment variable management with modern validation patterns.

## Tech Stack
- TypeScript (strict mode)
- @t3-oss/env-nextjs (environment validation)
- Zod (schema validation)
- Next.js (client/server separation)
- Build-time validation

## Core Principles

- **Type safety** - All environment variables are validated with Zod schemas
- **Build-time validation** - Catch configuration errors early in development
- **Clear separation** - Client vs server variables with proper prefixing
- **Documentation** - Self-documenting configuration with examples
- **Security** - Never expose server secrets to the client

## Configuration Structure

Organize environment variables with clear separation between client and server variables:

```
├── .env                    # Local environment variables (gitignored)
├── .env.example            # Template with documentation
└── config/env.ts          # Environment schema & validation
```

## Environment Schema Pattern

Create a centralized, type-safe configuration using @t3-oss/env-nextjs:

```typescript
// config/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  // Server-side variables (never exposed to browser)
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    SOLANA_PRIVATE_KEY: z.string().optional(),
  },
  
  // Client-side variables (exposed to browser)
  client: {
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_SOLANA_NETWORK: z
      .enum(["devnet", "testnet", "mainnet-beta"])
      .default("devnet"),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },
  
  // Runtime environment mapping
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SOLANA_PRIVATE_KEY: process.env.SOLANA_PRIVATE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  
  // Development configuration
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
```

## Adding Environment Variables

Follow this systematic approach when adding new environment variables:

### 1. Define Schema with Validation

```typescript
// Add to appropriate section in config/env.ts
server: {
  // Server-only secrets
  SOLANA_PRIVATE_KEY: z.string().min(1),
  DATABASE_SECRET: z.string().optional(),
  API_RATE_LIMIT: z.coerce.number().positive().default(100),
},
client: {
  // Browser-exposed configuration
  NEXT_PUBLIC_GRID_SIZE: z.coerce.number().default(1000),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z
    .string()
    .transform(val => val === "true")
    .default("false"),
},
```

### 2. Add Runtime Environment Mapping

```typescript
runtimeEnv: {
  SOLANA_PRIVATE_KEY: process.env.SOLANA_PRIVATE_KEY,
  DATABASE_SECRET: process.env.DATABASE_SECRET,
  API_RATE_LIMIT: process.env.API_RATE_LIMIT,
  NEXT_PUBLIC_GRID_SIZE: process.env.NEXT_PUBLIC_GRID_SIZE,
  NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
},
```

### 3. Document in Environment Files

```bash
# .env.example
SOLANA_PRIVATE_KEY=your-solana-private-key-here
DATABASE_SECRET=optional-database-secret
API_RATE_LIMIT=100
NEXT_PUBLIC_GRID_SIZE=1000
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# .env (your local file)
SOLANA_PRIVATE_KEY=actual-private-key
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

### 4. Use Type-Safe Access

```typescript
import { env } from "@/config/env";

// Server-side usage (API routes, server components)
export async function POST() {
  const privateKey = env.SOLANA_PRIVATE_KEY; // Fully typed
  const rateLimit = env.API_RATE_LIMIT; // number
}

// Client-side usage (client components, hooks)
"use client";
import { env } from "@/config/env";

export function GridComponent() {
  const gridSize = env.NEXT_PUBLIC_GRID_SIZE; // number
  const analyticsEnabled = env.NEXT_PUBLIC_ENABLE_ANALYTICS; // boolean
}
```

## Zod Validation Patterns

Use appropriate Zod validators for different types of environment variables:

```typescript
// String validations
z.string().min(1)                    // Non-empty string
z.string().optional()                // Optional string
z.string().url()                     // Valid URL format
z.string().email()                   // Valid email format
z.string().regex(/^[A-Z0-9_]+$/)    // Custom pattern

// Number validations
z.coerce.number()                    // String → number conversion
z.number().positive()                // Must be > 0
z.number().min(1).max(100)          // Range validation
z.coerce.number().default(5000)      // With default value

// Boolean validations
z.coerce.boolean()                   // String → boolean
z.string().transform(val => val === "true")  // Custom boolean transform

// Enum validations
z.enum(["development", "test", "production"])  // Specific values
z.enum(["devnet", "testnet", "mainnet-beta"]) // Solana networks

// Complex validations
z.string().transform(val => JSON.parse(val))   // JSON string → object
z.array(z.string())                           // Array of strings
z.record(z.string())                          // Key-value object
```

## Client vs Server Variables

Understanding the security boundary is crucial for proper environment variable usage:

| Type       | Prefix          | Exposed to Browser | Security Level | Use Cases                              |
|------------|-----------------|-------------------|---------------|----------------------------------------|
| **Server** | None            | ❌ Never          | High          | API keys, database URLs, private keys |
| **Client** | `NEXT_PUBLIC_*` | ✅ Always         | Public        | API endpoints, feature flags, config  |

### Server Variables (Secure)

```typescript
server: {
  // Database and API credentials
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SOLANA_PRIVATE_KEY: z.string().optional(),
  
  // External API keys
  OPENAI_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  
  // Internal configuration
  JWT_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().length(32),
}
```

### Client Variables (Public)

```typescript
client: {
  // Public API endpoints
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  
  // Feature flags and configuration
  NEXT_PUBLIC_SOLANA_NETWORK: z.enum(["devnet", "testnet", "mainnet-beta"]),
  NEXT_PUBLIC_ENABLE_WALLET_CONNECT: z.coerce.boolean().default(true),
  
  // Public keys (safe to expose)
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
}
```

## Usage in Different Contexts

### API Routes (Server-Side)

```typescript
// app/api/spots/route.ts
import { env } from "@/config/env";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  // ✅ Server variables available
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY // Server-only access
  );
  
  const privateKey = env.SOLANA_PRIVATE_KEY;
  const rateLimit = env.API_RATE_LIMIT;
  
  // Process request with full server access
}
```

### Client Components

```typescript
// features/pixels-grid/components/canvas-grid.tsx
"use client";
import { env } from "@/config/env";
import { Connection } from "@solana/web3.js";

export function CanvasGrid() {
  // ✅ Only NEXT_PUBLIC_ variables available
  const connection = new Connection(
    `https://api.${env.NEXT_PUBLIC_SOLANA_NETWORK}.solana.com`
  );
  
  const gridSize = env.NEXT_PUBLIC_GRID_SIZE;
  
  // ❌ This would cause a build error:
  // const privateKey = env.SOLANA_PRIVATE_KEY; // Server variable!
}
```

### Server Components

```typescript
// app/page.tsx (server component)
import { env } from "@/config/env";

export default async function HomePage() {
  // ✅ Both server and client variables available
  const isProduction = env.NODE_ENV === "production";
  const apiUrl = env.NEXT_PUBLIC_API_BASE_URL;
  
  // Can use server variables for initial data fetching
  if (env.ENABLE_PREMIUM_FEATURES) {
    // Server-side logic
  }
  
  return (
    <div>
      <h1>Grid Size: {env.NEXT_PUBLIC_GRID_SIZE}</h1>
    </div>
  );
}
```

## Build-Time Validation

Environment validation happens at build time, preventing runtime errors:

```bash
# Development - validates on every restart
bun run dev

# Production build - validates before building
bun run build

# If validation fails, you'll see detailed errors:
❌ Invalid environment variables:
{
  SUPABASE_SERVICE_ROLE_KEY: ["Required"],
  NEXT_PUBLIC_SOLANA_NETWORK: ["Invalid enum value. Expected 'devnet' | 'testnet' | 'mainnet-beta', received 'invalid'"]
}

# Skip validation for CI/Docker builds
SKIP_ENV_VALIDATION=true bun run build
```

## Environment File Management

### .env.example (Template)

```bash
# Database Configuration
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Solana Configuration
SOLANA_PRIVATE_KEY=your-base58-private-key
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# External APIs
OPENAI_API_KEY=your-openai-api-key

# Application Configuration
NEXT_PUBLIC_GRID_SIZE=1000
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Optional Features
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### .env (Local Development)

```bash
# Copy from .env.example and fill with actual values
SUPABASE_SERVICE_ROLE_KEY=sbp_actual_service_role_key_here
SOLANA_PRIVATE_KEY=actual_base58_private_key_here
NEXT_PUBLIC_SOLANA_NETWORK=devnet
OPENAI_API_KEY=sk-actual_openai_key_here
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

## Best Practices

### Type-Safe Environment Access

```typescript
// ✅ Always import from centralized config
import { env } from "@/config/env";
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;

// ✅ Use proper validation schemas
TIMEOUT_MS: z.coerce.number().positive().default(5000),

// ✅ Provide sensible defaults
NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

// ✅ Transform values appropriately
ENABLE_FEATURE: z.string().transform(val => val === "true"),

// ✅ Validate URL formats
API_BASE_URL: z.string().url(),

// ✅ Use optional for truly optional values
ANALYTICS_ID: z.string().optional(),
```

### Security Best Practices

```typescript
// ✅ Keep secrets server-side only
server: {
  DATABASE_PASSWORD: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  STRIPE_SECRET_KEY: z.string().min(1),
}

// ✅ Use NEXT_PUBLIC_ prefix only for safe values
client: {
  NEXT_PUBLIC_APP_NAME: z.string().default("Solana Million Pixel"),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().optional(),
}

// ✅ Validate sensitive data format
SOLANA_PRIVATE_KEY: z.string().regex(/^[1-9A-HJ-NP-Za-km-z]{44}$/),
```

## Implementation Checklist

**Schema Definition:**
- [ ] Added to appropriate section (server/client)
- [ ] Proper Zod validation applied
- [ ] Default values provided where appropriate
- [ ] Added to runtimeEnv mapping

**Documentation:**
- [ ] Added to .env.example with description
- [ ] Documented expected format/values
- [ ] Security classification noted (public/private)

**Usage:**
- [ ] Import from @/config/env consistently
- [ ] Used in appropriate context (server vs client)
- [ ] Type safety verified
- [ ] Build validation passes

## Common Pitfalls to Avoid

```typescript
// ❌ Don't access process.env directly
const apiKey = process.env.NEXT_PUBLIC_API_KEY; // No validation!

// ❌ Don't expose secrets to client
client: {
  NEXT_PUBLIC_PRIVATE_KEY: z.string(), // Security vulnerability!
}

// ❌ Don't hardcode configuration values
const timeout = 5000; // Should be env.TIMEOUT_MS

// ❌ Don't forget runtimeEnv mapping
server: {
  NEW_FEATURE: z.boolean(),
},
runtimeEnv: {
  // Missing NEW_FEATURE mapping!
}

// ❌ Don't skip validation without reason
skipValidation: true, // Should be conditional

// ❌ Don't use weak validation
API_KEY: z.string(), // Should be .min(1) at minimum

// ✅ Correct patterns
import { env } from "@/config/env";

server: {
  API_TIMEOUT: z.coerce.number().positive().default(30000),
},
client: {
  NEXT_PUBLIC_MAX_FILE_SIZE: z.coerce.number().default(10485760), // 10MB
},
runtimeEnv: {
  API_TIMEOUT: process.env.API_TIMEOUT,
  NEXT_PUBLIC_MAX_FILE_SIZE: process.env.NEXT_PUBLIC_MAX_FILE_SIZE,
},
skipValidation: !!process.env.SKIP_ENV_VALIDATION,
```

## Troubleshooting Guide

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Build Fails** | "Invalid environment variables" error | Check .env file format, verify schema types match values |
| **Variable Undefined** | `env.MY_VAR` is undefined at runtime | Ensure variable exists in .env and runtimeEnv mapping |
| **Client Access Error** | Cannot access server variable in client | Add NEXT_PUBLIC_ prefix and move to client section |
| **TypeScript Errors** | Property doesn't exist on env object | Add variable to schema and restart TypeScript server |
| **Validation Error** | Zod parsing fails | Check value format matches schema (URL, number, enum) |
| **Development Issues** | Changes not reflected | Restart development server after .env changes |

This comprehensive guide ensures type-safe, secure, and maintainable environment variable management across your Solana Million Pixel application.
