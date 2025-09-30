# Monorepo Dropshipping Platform

Modern monorepo for a dropshipping platform with:
- API (NestJS) with JWT auth, roles, Swagger, FCM notifications
- Store frontend (Next.js + Tailwind) with auth, theme toggle, FCM registration
- Admin panel (Next.js + Tailwind) with product/order management and push sender
- Workers (Node) for CSV product import
- Docker Compose orchestration and Postgres

## Structure

```
/apps/store-frontend
/apps/admin-panel
/services/api
/services/workers
/infra/migrations
```

## Prerequisites
- Docker and Docker Compose
- Node 20+ (for local dev)

## Setup

1) Copy env

```bash
cp .env.example .env
```

Fill Firebase variables if you will test push notifications.

2) Start Postgres and API

```bash
docker-compose up --build -d postgres api
```

3) Run migrations and seed admin

```bash
docker compose exec api node dist/scripts/migrate.js
docker compose exec api node dist/scripts/seed.js
```

Admin user: email `admin@local.test` password `admin123`.

4) Run workers (optional CSV import)

Place a CSV at `./data/products.csv` with headers like `title,description,price,currency,image_url,stock` then:

```bash
docker-compose up --build -d worker
```

5) Run frontends locally

Install deps once:

```bash
npm --prefix services/api ci
npm --prefix apps/store-frontend i
npm --prefix apps/admin-panel i
```

Dev servers:

```bash
npm --prefix services/api run start:dev
npm --prefix apps/store-frontend run dev
npm --prefix apps/admin-panel run dev
```

Access:
- API Swagger: http://localhost:3000/api/docs
- Store: http://localhost:3001
- Admin: http://localhost:3002

Configure CORS origins in `.env` if needed.

## API Summary
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Products: `GET /api/products`, `GET /api/products/:id`, `POST/PUT/DELETE /api/products` (admin/vendor)
- Orders: `GET /api/orders` (self), `GET /api/orders/all` (admin), `POST /api/orders`
- Devices: `POST /api/devices/register` (auth)
- Notifications: `POST /api/notifications/send` (admin)

## Frontends
- Store: Login/Registro, lista de produtos, perfil, tema claro/escuro, FCM SW em `public/firebase-messaging-sw.js` e registro de token no login.
- Admin: Login, gerenciamento básico de produtos e pedidos, envio de notificações.

## Security Notes
- Passwords hashed with bcrypt.
- JWT with role claim for RBAC.
- CORS via env `CORS_ORIGIN`.
- Use strong `JWT_SECRET` and proper Firebase credentials in production.

## Production
- Build API image via compose `api` service.
- Serve Next apps with `next build` + `next start` behind a reverse proxy (add Dockerfiles as needed).
- Configure HTTPS and environment variables securely.