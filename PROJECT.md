# Solana Pixel Grid (MVP)

> **Last Updated**: 2025-12-23

## 1. Executive Summary

The project aims to build a single-page web application featuring a **1000x1000 pixel grid** (1 million total spots). Users connect their Solana wallets to purchase spots (single or blocks), upload images, and attach clickable links. The system emphasizes high performance, visual interactivity, and simplified blockchain integration via server-side verification.

---

## 2. Technical Architecture & Constraints

| Decision                   | Details                                                             |
| -------------------------- | ------------------------------------------------------------------- |
| **Rendering Engine**       | HTML5 Canvas API (PixiJS/Konva) - Required for 1M elements at 60FPS |
| **Blockchain Integration** | Server-Side Verification via `SystemProgram.transfer`               |
| **UI Framework**           | Next.js + Tailwind CSS (Lavender/Teal theme)                        |

### Why Canvas?

Due to the grid size (1,000,000 interactive elements), standard HTML/DOM elements cannot be used as they will crash the browser. Canvas ensures smooth rendering at 60FPS, enabling seamless zooming, panning, and hovering.

### Blockchain Approach

- No custom Smart Contract (MVP simplicity)
- Frontend triggers standard SOL transfer
- Backend (Node.js/Supabase) verifies transaction signature via RPC
- Spots marked as 'Sold' in database upon confirmation

---

## 3. Infrastructure & Operational Costs

| Service                           | Cost    | Purpose                               |
| --------------------------------- | ------- | ------------------------------------- |
| **Vercel Pro**                    | ~$20/mo | Commercial traffic limits             |
| **Supabase Pro**                  | ~$25/mo | Store 1M spot records & heavy R/W ops |
| **Solana RPC (Helius/QuickNode)** | ~$49/mo | Reliable/fast tx verification         |

---

## 4. Key Features

### 4.1. User Features

- **Multi-Spot Selection (Billboard Mode)**: Drag-and-select blocks (e.g., 5x5) for large images
- **Interactive Grid**: Hover enlarges image + reveals clickable link
- **Purchase Modal**: Image upload (with compression) + URL input
- **Wallet Integration**: Phantom & Solflare via Solana Wallet Adapter
- **Deep Linking**: Auto-generated URLs (e.g., `site.com/view/spot_id`) that zoom to location

### 4.2. System & Logic

- **Collision Detection**: Prevent overlap with purchased spots
- **Real-Time Scarcity Meter**: Global counter synced across all users
- **Whitelist Logic**: Free mints for specific wallet addresses

### 4.3. Admin Dashboard

- **Content Moderation**: Hide/delete NSFW images
- **Metadata Management**: Update spot details

---

## 5. Development Milestones & Progress

### Milestone 1: Setup & High-Performance Canvas ✅ IN PROGRESS

| Task                             | Status  | Notes                                   |
| -------------------------------- | ------- | --------------------------------------- |
| Next.js project setup            | ✅ Done |                                         |
| 1000x1000 Canvas grid (PixiJS)   | ✅ Done | Using `CanvasGrid` component            |
| Zoom functionality               | ✅ Done | Mouse wheel zoom                        |
| Pan functionality                | ✅ Done | Click & drag                            |
| Hover effects                    | ✅ Done | Spot highlighting                       |
| Multi-spot selection (Billboard) | ✅ Done | Drag-to-select with visual highlighting |
| Performance optimization (60FPS) | ✅ Done | Optimized grid rendering                |
| UI theme (Lavender/Teal)         | ✅ Done | Tailwind CSS configured                 |

**Current Files:**

- `components/canvas/canvas-grid.tsx` - Main canvas component
- `components/canvas/grid-renderer.ts` - Grid rendering logic

---

### Milestone 2: Wallet & Whitelist Integration ✅ COMPLETE

| Task                              | Status  | Notes                           |
| --------------------------------- | ------- | ------------------------------- |
| Solana Wallet Adapter integration | ✅ Done | Phantom & Solflare supported    |
| Wallet connect button UI          | ✅ Done | Custom theme-matched button     |
| Whitelist backend logic           | ✅ Done | Local JSON (ready for Supabase) |
| Scarcity Meter display            | ✅ Done | Already in `GridHeader`         |
| API route for whitelist check     | ✅ Done | `/api/whitelist/check`          |

**Current Files:**

- `components/providers/wallet-provider.tsx` - Wallet context provider
- `components/ui/wallet-button.tsx` - Wallet connection UI
- `lib/whitelist.ts` - Whitelist utilities
- `app/api/whitelist/check/route.ts` - Whitelist API

---

### Milestone 3: Multi-Spot Image Flow & Database ⬜ TODO

| Task                          | Status | Notes                          |
| ----------------------------- | ------ | ------------------------------ |
| Collision detection logic     | ⬜     | Block overlap prevention       |
| Purchase Modal                | ⬜     | Image upload + URL input       |
| Client-side image compression | ⬜     |                                |
| Supabase schema setup         | ⬜     | coordinates, image URLs, links |
| API routes                    | ⬜     |                                |

---

### Milestone 4: Payments & Deep Linking ⬜ TODO

| Task                        | Status | Notes                                 |
| --------------------------- | ------ | ------------------------------------- |
| SOL payment flow            | ⬜     | SystemProgram.transfer                |
| Server-side tx verification | ⬜     | RPC signature verification            |
| Real-time spot updates      | ⬜     | Instant canvas update on confirmation |
| Deep linking logic          | ⬜     | Auto-zoom to coordinates              |

---

### Milestone 5: Admin Dashboard & Real-Time Sync ⬜ TODO

| Task                          | Status | Notes               |
| ----------------------------- | ------ | ------------------- |
| Admin dashboard UI            | ⬜     | Protected route     |
| Content moderation tools      | ⬜     | Hide/delete NSFW    |
| Supabase Realtime integration | ⬜     | Global counter sync |

---

### Milestone 6: Mobile Optimization & Handover ⬜ TODO

| Task                      | Status | Notes               |
| ------------------------- | ------ | ------------------- |
| Touch events optimization | ⬜     | Pinch-to-zoom, drag |
| Mobile responsiveness     | ⬜     |                     |
| Vercel deployment config  | ⬜     |                     |
| Supabase production setup | ⬜     |                     |
| GitHub handover           | ⬜     | README + .env docs  |

---

## 6. Tech Stack Summary

```
Frontend:
├── Next.js 16
├── React 19
├── Tailwind CSS
├── PixiJS (Canvas rendering)
└── Solana Wallet Adapter

Backend:
├── Next.js API Routes
├── Supabase (PostgreSQL)
└── Solana RPC (Helius/QuickNode)

Blockchain:
├── Solana Mainnet/Devnet
└── SystemProgram.transfer (no custom contract)
```

---

## 7. Environment Variables (Required)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Solana
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=
TREASURY_WALLET_ADDRESS=

# Pricing
NEXT_PUBLIC_SPOT_PRICE_SOL=0.01
```

---

## 8. Quick Reference

| Resource         | Link/Command                                                 |
| ---------------- | ------------------------------------------------------------ |
| Start Dev Server | `bun dev` or `npm run dev`                                   |
| Project Root     | `d:\Nemo\Others\side-projects\million-dollar\solana-web-app` |
| Main Canvas      | `components/canvas/canvas-grid.tsx`                          |
| Grid Logic       | `components/canvas/grid-renderer.ts`                         |
