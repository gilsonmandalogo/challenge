# Degen Flip — Improved Coin Flip Demo

An improved, portfolio-quality demo inspired by [Degen Coin Flip](https://degencoinflip.com/). Built with React, TypeScript, and a lightweight Hono API. Features mocked Solana wallet/transaction UX without real on-chain settlement.

## Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | https://client-six-mocha-33.vercel.app |
| **Backend API** | https://server-delta-tan-43.vercel.app |

> **Note:** The API is deployed as Vercel serverless functions. Recent flips/stats are stored in-memory per instance and may reset on cold starts. A [Render](https://render.com) config (`server/render.yaml`) is included for a persistent Node process alternative.

## What We Built

- **Coin flip game flow** — pick heads/tails, set a SOL bet, flip, and see win/loss with payout
- **Mock wallet UX** — connect/disconnect, fake pubkey, 10 SOL demo balance
- **Transaction state machine** — explicit Sign → Submit → Confirm → Done steps with loading/error states
- **Lightweight API** — Hono server with flip creation, polling, recent activity feed, and aggregate stats
- **Provably fair demo panel** — server seed hash reveal after each flip (educational mock, not real VRF)
- **Activity sidebar** — recent flips feed, session P&L, streaks, global stats

### Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Zustand, TanStack Query |
| Backend | Hono, Node.js, TypeScript |
| Shared | Typed API contract in `shared/types.ts` |
| Deploy | Vercel (client + serverless API); Render config included as alternative |

## Architecture

```
client/          React SPA — wallet state, flip state machine, UI
server/          Hono API — outcome resolution, in-memory store
shared/types.ts  Shared TypeScript types (API contract)
```

**Flip flow:**
1. User connects mock wallet (generates fake pubkey + 10 SOL balance)
2. User selects side and bet amount
3. Client simulates wallet signing (~1s delay)
4. Client POSTs flip to API → server resolves outcome (50/50, 3.5% house edge on wins)
5. Client polls until confirmed (~1.5s server delay simulates block confirmation)
6. Balance updates locally; recent flips feed refreshes

## Local Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
# Install dependencies
npm install

# Copy env files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Run both client and server
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001
- Health check: http://localhost:3001/health

### Individual apps

```bash
npm run dev:client   # Vite dev server only
npm run dev:server   # Hono API only
npm run build        # Build both workspaces
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/flips` | Create a flip |
| GET | `/api/flips/:id` | Get flip status/result |
| GET | `/api/flips/recent?limit=20` | Recent confirmed flips |
| GET | `/api/stats` | Aggregate stats |

## Assumptions

- **No real blockchain** — wallet connect, signing, and settlement are fully mocked
- **No real SOL** — balances are client-side demo state starting at 10 SOL
- **In-memory storage** — flip history is lost on server restart (acceptable for demo)
- **Provably fair is illustrative** — production would use on-chain VRF (e.g. Chainlink)
- **Single coin flip game** — Crash, Towers, Spin, and NFT features from the original are out of scope
- **3.5% house edge** — applied to winning payouts, matching the original platform

## With More Time

- Integrate `@solana/wallet-adapter` for real Phantom/Solflare connect on devnet
- Anchor smart contract for on-chain flip settlement
- Chainlink VRF or Switchboard for verifiable randomness
- PostgreSQL persistence + Redis for rate limiting
- WebSocket feed for live recent flips (instead of polling)
- Auth, KYC hooks, and responsible-gaming tooling
- Additional games (Crash, Towers) as separate feature modules
- E2E tests with Playwright; unit tests for flip service and state machine

## AI / Tools Used

This project was built with **[Cursor](https://cursor.com)** as the primary development environment. AI assistance was used for:

- Scaffolding the monorepo structure and shared type contracts
- Implementing the flip state machine and transaction UX patterns
- Generating the Hono API routes and in-memory store
- Tailwind styling and responsive layout
- README and deployment configuration

All architecture decisions, state management patterns, and API boundaries were guided by the project plan. Code was reviewed and verified via local builds and API smoke tests.

## Deployment

### Backend (Vercel Serverless — live)

The API is deployed at https://server-delta-tan-43.vercel.app using the Hono Vercel adapter (`server/api/index.ts`).

Environment variables on the Vercel server project:
- `CORS_ORIGIN` = your frontend URL (e.g. `https://client-six-mocha-33.vercel.app`)
- `HOUSE_EDGE` = `0.035` (optional)

### Backend (Render — alternative)

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect the GitHub repo, set **Root Directory** to `server`
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Environment variables:
   - `PORT` = `10000`
   - `CORS_ORIGIN` = your Vercel frontend URL
   - `HOUSE_EDGE` = `0.035`

### Frontend (Vercel)

1. Import the repo on [Vercel](https://vercel.com)
2. Set **Root Directory** to `client`
3. Framework preset: **Vite**
4. Environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://degen-coin-flip-api.onrender.com`)

## License

MIT — demo/portfolio project only. Not affiliated with Degen Coin Flip.
