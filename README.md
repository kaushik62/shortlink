# ShortLink — Full-Stack URL Shortener

A portfolio-ready URL shortener built with **React, Tailwind CSS, Express, PostgreSQL, Redis, Docker and JWT authentication**. Short codes use **PostgreSQL unique IDs → Base62 encoding**.

## What was improved

- JWT authentication with secure **HTTP-only cookies**
- User registration, login, session restoration and logout
- Every URL belongs to its authenticated owner
- Protected create/list/get/delete URL APIs
- Password hashing with bcrypt
- PostgreSQL unique ID → Base62 encoding for deterministic short codes
- Redis caching for fast redirects
- Click counting and last-access tracking
- Zod request validation
- Centralized API error handling
- Environment-driven Docker Compose configuration
- Cleaner dashboard and responsive UI
- Database indexes for user and short-code lookups

## Architecture

```text
React + Tailwind
      │
      │ HTTP / JSON + HTTP-only JWT cookie
      ▼
Express API
 ├── Auth middleware
 ├── URL controllers/services
 ├── PostgreSQL ── users + urls
 └── Redis ─────── shortCode → originalUrl cache
      │
      ▼
GET /:shortCode → Redis/DB → click update → 302 redirect
```

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Auth | JWT, HTTP-only cookies, bcrypt |
| Database | PostgreSQL |
| Cache | Redis |
| Validation | Zod |
| Containerization | Docker, Docker Compose |

## API

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### URLs
- `POST /api/urls` — authenticated
- `GET /api/urls` — authenticated
- `GET /api/urls/:id` — authenticated
- `DELETE /api/urls/:id` — authenticated
- `GET /:shortCode` — public redirect
- `GET /health`

## Run with Docker

1. Copy `.env.example` to `.env`.
2. Set a strong `JWT_SECRET` and PostgreSQL password.
3. Set `VITE_API_BASE_URL=http://localhost:5000`.
4. Run:

```bash
docker compose up --build
```

Open:
- Frontend: `http://localhost:3000`
- API: `http://localhost:5000`
- Health: `http://localhost:5000/health`

## Run locally

Start PostgreSQL and Redis first.

Backend:

```bash
cd server
cp .env.example .env
npm install
npm run migrate
npm run dev
```

Frontend:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

For local Vite development, keep `CLIENT_URL=http://localhost:5173`.

## Security notes

- JWT is stored in an HTTP-only cookie, so frontend JavaScript cannot read it.
- Passwords are never stored directly; bcrypt hashes are stored in PostgreSQL.
- URL management queries are scoped by `user_id`, preventing one account from reading or deleting another account's links.
- Do not commit `.env` files or production secrets.


## Troubleshooting Docker

If you previously ran an older version and PostgreSQL has an old volume, recreate the
database volume after backing up any data you need:

```bash
docker compose down -v
docker compose up --build
```

`-v` deletes the project's PostgreSQL Docker volume. This is recommended during
development when changing the database schema.

If you want to keep existing data:

```bash
docker compose down
docker compose up --build
docker compose logs -f server
```

The server runs the idempotent migration before starting.

### Expected startup

```text
postgres  → database system is ready to accept connections
redis     → Ready to accept connections tcp
server    → Database migrated successfully.
server    → Connected to PostgreSQL
server    → Connected to Redis
server    → Server running on port 5000
client    → Accepting connections at http://localhost:3000
```


## Short-code algorithm

The application does not use random strings for short URLs.

```text
PostgreSQL sequence
      ↓
Unique numeric ID
      ↓
Base62 encoding
      ↓
Short code
      ↓
https://your-domain.com/2N
```

Base62 uses 62 characters:

```text
0-9 + a-z + A-Z
```

For example, PostgreSQL might generate:

```text
id = 125
```

The application converts that number to Base62 and stores the resulting short code.

This makes short-code generation deterministic and avoids a random collision lookup loop. The
PostgreSQL unique constraint on `short_code` remains the final database-level guarantee.

## Short-code generation

The application uses a PostgreSQL `BIGSERIAL` (`BIGINT`) ID as the unique source
for each URL and encodes that ID with Base62 (`0-9a-zA-Z`).

Generated codes are padded to a minimum of **5 characters** and capped at
**7 characters**. This gives a compact, deterministic, collision-free mapping
for the BIGINT IDs that fall within the 7-character Base62 capacity.

The 7-character Base62 space contains:

`62^7 = 3,521,614,606,208` possible codes.

Note: padding early IDs with zeros makes the displayed code 5 characters long;
it does not reduce uniqueness because each code still maps to a unique ID.

## Express Router API structure

The backend now separates endpoints using Express `Router()`:

- `POST /api/auth/register` — create account
- `POST /api/auth/login` — login
- `POST /api/auth/logout` — logout
- `GET /api/auth/me` — current user
- `POST /api/urls` — create short URL (protected)
- `GET /api/urls` — get the logged-in user's URLs (protected)
- `DELETE /api/urls/:id` — delete a user's URL (protected)
- `GET /api/urls/:shortCode` — redirect to original URL

The application mounts these with:

```js
app.use("/api/auth", authRoutes);
app.use("/api/urls", urlRoutes);
```

This keeps routing separate from controllers and business logic.

## Backend architecture

```text
server.js
   |
   +--> /api/auth  --> authRoutes --> validation/auth middleware --> authController
   |
   +--> /api/urls  --> urlRoutes  --> auth/validation middleware --> urlController
   |                                                        |
   |                                                        v
   |                                                   urlService
   |                                                    /      \
   |                                                   v        v
   |                                             PostgreSQL   Redis
   |
   +--> /:shortCode --> redirectRoutes --> urlController --> urlService
```

There is intentionally only one route module for authentication and one for URL
API operations. The root short-code redirect is kept separate because it must
handle URLs such as `GET /00w7E`.

## Fresh Docker database

After upgrading an existing development database from older schema versions,
recreate the PostgreSQL volume so `BIGSERIAL` and the `BIGINT` foreign key are
applied cleanly:

```bash
docker compose down -v
docker compose up --build
```
