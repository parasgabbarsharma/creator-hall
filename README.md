# CreatorPlatform

A Next.js (App Router) application designed to aggregate and display YouTube and Instagram content for creators, complete with custom analytics tracking, robust security, and distributed observability.

## Architecture

- **Framework:** Next.js 15 App Router
- **Database:** PostgreSQL via Prisma ORM
- **Authentication:** Custom HMAC-SHA256 session tokens with strict CSRF boundaries
- **Rate Limiting:** Upstash Redis for distributed limits across serverless edges
- **Observability:** Sentry for APM/crash reporting, Pino for structured JSON logging
- **Styling:** Tailwind CSS

## Local Setup

### Prerequisites
- Node.js 20+
- Docker & Docker Compose (for the local PostgreSQL instance)

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Generate local secrets:
   ```bash
   npm run secrets:generate
   ```
   This will output hashes and keys. Add them to your `.env.local` file using `.env.example` as a template.

3. Start the local database:
   ```bash
   docker compose up -d db redis
   ```

4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables
The application strictly validates the following variables in production:
- `DATABASE_URL`: PostgreSQL connection string.
- `ADMIN_PASSWORD_HASH`: Bcrypt hash for dashboard access.
- `SESSION_SECRET`: 32-character random string.
- `CRON_SECRET`: 32-character random string for securing cleanup endpoints.
- `TOKEN_ENCRYPTION_KEY`: Base64Url 32-byte key.
- `NEXT_PUBLIC_SITE_URL`: Hardcoded public URL for CSRF validation.
- `TRUST_PROXY`: Set to `"true"` if behind Vercel, Render, or Cloudflare.
- `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: For rate limiting.
- `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`: Observability mapping.

## Docker Usage
You can run the entire stack locally using the included `docker-compose.yml`.
```bash
docker compose up -d
```
This spawns:
- `db` (Postgres 15)
- `redis` (Redis 7)
- `app` (Node.js production runner listening on port 3000)

## Testing
- **Unit/Integration:** `npm test` (Runs native Node.js test runner)
- **E2E:** `npx playwright test` (Requires active DB connection)
- **Load Testing:** `k6 run k6/load-test.js`

## Deployment
1. Ensure all environment variables are mapped in your host platform.
2. Build step should execute:
   ```bash
   npx prisma migrate deploy
   npm run build
   ```
3. Setup external cron jobs (e.g. Vercel Cron) to hit:
   - `POST /api/cron/sync` (Synchronizes YouTube)
   - `POST /api/cron/cleanup` (Prunes analytics)
   Both must send `Authorization: Bearer <CRON_SECRET>`.

## Troubleshooting
- **Build fails with "Can't reach database":** The build step requires a database connection to parse the Prisma schema. Ensure `DATABASE_URL` is correct.
- **503 Server Unavailable:** The `/api/health` endpoint actively pings the DB. If it returns 503, Postgres is offline or unreachable.
- **Rate Limit Lockouts:** Ensure `TRUST_PROXY` is enabled if deployed behind a CDN.
