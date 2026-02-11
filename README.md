# Express Auth Backend

A production-ready Express.js backend starter with secure authentication primitives:

- User registration and login routes
- JWT-based authentication
- Password hashing with `bcrypt`
- Rate limiting for auth endpoints
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

4. Update `.env` values, especially `JWT_SECRET`.

## Environment Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `3000` | Port for the HTTP server |
| `NODE_ENV` | No | `development` | Runtime environment |
| `JWT_SECRET` | Yes | - | Secret key used to sign JWT tokens |
| `JWT_EXPIRES_IN` | No | `1h` | JWT expiration (e.g. `1h`, `7d`) |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Cost factor for password hashing |
| `CORS_ORIGIN` | No | `*` | Allowed CORS origin |

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
  "password": "strongpassword123"
}
```

### Login User

- `POST /api/auth/login`

Request body:

```json
{
  "email": "jane@example.com",
  "password": "strongpassword123"
}
```

### Get Authenticated User

- `GET /api/auth/me`
- Header: `Authorization: Bearer <jwt_token>`

## Security Notes

- Passwords are hashed with `bcrypt` before storage.
- JWT tokens are signed and validated using issuer + audience checks.
- Rate limiting protects auth routes against brute-force attempts.
- `helmet` adds common HTTP security headers.

## Scripts

- `npm start` - Start server
- `npm run dev` - Start server with `nodemon`

## Next Steps for True Production

- Add a real database (PostgreSQL, MySQL, MongoDB, etc.).
- Add input schema validation (e.g., Zod/Joi).
- Add refresh-token strategy and token revocation.
- Add automated tests and CI pipeline.
