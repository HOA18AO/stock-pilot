# StockPilot

Author: HOA18AO

Full-stack webstore: Next.js client + NestJS API, PostgreSQL, JWT auth (admin/manager roles).

---

## Project structure (simplified)

```
webstore/
├── .env                 # copy from .env.example (ports, DB_*, JWT_*)
├── .env.example
├── docker-compose.yml    # db (default) + client/server (profile: app)
├── README.md
│
├── client/               # Next.js frontend
│   ├── app/              # pages, layout
│   ├── scripts/
│   │   └── dev.js        # dev server using root .env CLIENT_PORT
│   ├── package.json
│   └── ...
│
└── server/               # NestJS API
    ├── src/
    │   ├── main.ts
    │   ├── app.module.ts
    │   ├── auth/         # login, JWT, guards, roles
    │   ├── user/         # user CRUD
    │   ├── category/     # category CRUD
    │   ├── product/      # product CRUD
    │   ├── customer/     # customer CRUD
    │   ├── common/       # e.g. roles constants
    │   └── entities/     # TypeORM entities
    ├── scripts/
    │   ├── dev.js        # start:dev with root .env
    │   └── create-first-user.js   # seed one user (no Nest)
    ├── package.json      # scripts: dev, seed:user, ...
    └── ...
```

---

## How to start the project

### 1. Prerequisites

- Node.js (v18+), npm
- Docker & Docker Compose (for the database)

### 2. Environment

From the **project root**:

```bash
cp .env.example .env
```

Edit `.env`: set `DB_PASSWORD`, `JWT_SECRET` (required for auth), and optionally `CLIENT_PORT` / `SERVER_PORT`. Defaults: client 3007, server 3008.

### 3. Create the database

Start only the database (and create the `webstore` DB and Postgres user from `.env`):

```bash
docker compose up -d
```

This starts the `db` service. The database name and user come from `DB_NAME` and `DB_USER` in `.env` (default: database `webstore`, user `postgres`).

### 4. Create the first user

From the **project root**:

```bash
node server/scripts/create-first-user.js
```

Defaults: username `admin`, password `admin123`, role `manager`. Optional args: `[username] [password] [role]` (role: `admin` or `manager`).

Or from the server folder:

```bash
cd server
npm run seed:user
```

### 5. Run the app locally

**Terminal 1 – API (NestJS):**

```bash
cd server
npm run dev
```

Uses root `.env` (e.g. `SERVER_PORT`, `DB_*`, `JWT_*`). API: http://localhost:3008 (or your `SERVER_PORT`).

**Terminal 2 – Client (Next.js):**

```bash
cd client
npm run dev
```

Uses root `.env` for `CLIENT_PORT`. App: http://localhost:3007 (or your `CLIENT_PORT`).

### 6. Use the API

- **Swagger:** http://localhost:3008/api  
- **Login:** `POST /auth/login` with `{ "username": "admin", "password": "admin123" }` → use the returned `access_token` as `Authorization: Bearer <token>` for protected routes.

---

## Optional: run client and server in Docker

```bash
docker compose --profile app up
```

Runs db + server + client in containers. Ports and env still come from root `.env`.
