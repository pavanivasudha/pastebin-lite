# Pastebin Lite

A simple Pastebin-like application built using **Next.js (App Router)**.
Users can create text pastes and share a URL to view them.
Pastes can optionally expire based on time (TTL) or number of views.

This project is designed to be compatible with automated testing and
serverless deployment.

---

## Features

- Create a paste with arbitrary text
- Get a shareable URL for each paste
- View a paste via API or browser
- Optional constraints:
  - Time-based expiry (TTL)
  - View count limit
- Safe rendering (no script execution)
- Deterministic expiry support for testing

---

## Tech Stack

- **Next.js (App Router)**
- **Node.js**
- **Upstash Redis** (persistence)
- **Vercel** (deployment)

---

## Running the Project Locally

### 1. Install dependencies
```bash

npm install
Create a file named .env.local in the project root:

UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

NEXT_PUBLIC_BASE_URL=http://localhost:3000
TEST_MODE=0


Note: .env.local should NOT be committed to git.

3. Start the development server
npm run dev


Open:

http://localhost:3000

API Endpoints
Health Check
GET /api/healthz


Returns:

{ "ok": true }

Create a Paste
POST /api/pastes


Request body:

{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 5
}


Response:

{
  "id": "abc123",
  "url": "https://your-app.vercel.app/p/abc123"
}

Fetch a Paste (API)
GET /api/pastes/:id


Each successful request counts as a view.

View a Paste (HTML)
GET /p/:id


Returns an HTML page showing the paste content.
If the paste is expired or exceeds view limits, a 404 page is returned.

Persistence Layer

This project uses Upstash Redis as the persistence layer.

Reason for choice:

Works on Vercel free tier

Serverless-safe

Data persists across requests

Supports atomic operations for view counting

Important Design Decisions

No in-memory storage (required for serverless)

Atomic view count updates using Redis

Both API and HTML views count toward view limits

Deterministic expiry supported using:

TEST_MODE=1

x-test-now-ms request header

Paste content is rendered safely (no HTML injection)

Deployment

The application is deployed on Vercel.
