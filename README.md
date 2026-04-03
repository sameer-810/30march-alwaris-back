# Alwaris Logistics ERP - Backend

## Setup

1. Copy `.env.example` → `.env` and fill values.
2. Install dependencies:

```bash
npm install
```

3. Start server:

```bash
npm run dev
```

Health check: `GET /health`

## Authentication

- `POST /api/v1/auth/login`
- `GET|POST|PATCH|DELETE /api/v1/users` (Admin-managed users with roles: `Admin` and `Operator`)
- JWT Bearer token required for protected routes.

## Seed (Admin)

This backend expects at least one `Admin` user to exist.

Run:

```bash
npm run seed:admin
```

Defaults:

- `ADMIN_EMAIL`: `admin@companyname.com`
- `ADMIN_PASSWORD`: `Admin@12345`
- `ADMIN_NAME`: `System Admin`
