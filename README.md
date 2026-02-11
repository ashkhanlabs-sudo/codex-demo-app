# Express Auth Backend

A production-ready Express.js backend starter with secure authentication primitives:

- User registration and login routes
- JWT-based authentication
- Role-based access control (RBAC) middleware
- Password hashing with `bcrypt`
- Rate limiting for auth and API routes
- Environment-based configuration with `dotenv`
- Structured project layout (`routes`, `controllers`, `middleware`, `config`)

> **Note:** This starter uses an in-memory user store for simplicity. For real production use, swap this for a persistent database.

## Project Structure

```txt
.
├── src
│   ├── app.js
│   ├── server.js
│   ├── config
│   │   └── env.js
│   ├── controllers
│   │   └── authController.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── rateLimiter.js
│   ├── routes
│   │   └── authRoutes.js
│   ├── services
│   │   └── userStore.js
│   └── utils
│       └── generateToken.js
├── .env.example
├── package.json
└── README.md
```

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

1. Clone or download the project.
2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Update `.env` values, especially `JWT_SECRET` and `CORS_ORIGIN`.

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `3000` | Port for the HTTP server |
| `NODE_ENV` | No | `development` | Runtime environment (`development`, `test`, `production`) |
| `JWT_SECRET` | Yes | - | Secret key used to sign JWT tokens |
| `JWT_EXPIRES_IN` | No | `1h` | JWT expiration (e.g. `1h`, `7d`) |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Cost factor for password hashing (10-15) |
| `CORS_ORIGIN` | No | `*` in dev only | Allowed CORS origin (must be explicit in production) |
| `REQUEST_BODY_LIMIT` | No | `10kb` | Max JSON body size |

## Running the Project

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The API will be available at `http://localhost:3000` (or your configured `PORT`).

## API Endpoints

### Health Check

- `GET /health`

Response:

```json
{
  "status": "ok"
}
```

### Register User

- `POST /api/auth/register`

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "StrongP@ssword123",
  "role": "user"
}
```

Optional role values:

- `user` (default)
- `admin`

Password requirements:

- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one symbol

### Login User

- `POST /api/auth/login`

Request body:

```json
{
  "email": "jane@example.com",
  "password": "StrongP@ssword123"
}
```

### Get Authenticated User

- `GET /api/auth/me`
- Header: `Authorization: Bearer <jwt_token>`

### Admin-only Route Example

- `GET /api/auth/admin`
- Headers:
  - `Authorization: Bearer <jwt_token>`
- Requirement: authenticated user with `role: "admin"`

Response:

```json
{
  "message": "Hello Jane Doe, you have admin access.",
  "user": {
    "id": "...",
    "email": "jane@example.com",
    "name": "Jane Doe",
    "role": "admin"
  }
}
```

## Security Hardening Included

- Passwords are hashed with `bcrypt` before storage.
- JWT tokens are signed and validated using issuer + audience checks.
- Rate limiting protects both auth endpoints and general API traffic.
- Failed login attempts are throttled more aggressively than successful logins.
- `helmet` adds common HTTP security headers.
- `x-powered-by` is disabled.
- JSON body size is capped to reduce abuse risk.
- Invalid JSON payloads return explicit `400` errors.

## Scripts

- `npm start` - Start server
- `npm run dev` - Start server with `nodemon`

## Next Steps for True Production

- Add a real database (PostgreSQL, MySQL, MongoDB, etc.).
- Add request schema validation (e.g., Zod/Joi) for all routes.
- Add refresh-token strategy and token revocation.
- Add automated tests and CI pipeline.
- Add centralized audit logging + monitoring/alerts.
