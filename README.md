# Smart Leads Dashboard

A full-stack lead management dashboard built with TypeScript, React, Tailwind CSS, Node.js, Express, and MongoDB.

## Overview

Smart Leads Dashboard is a lead management application that supports user authentication, role-based access, lead CRUD operations, search/filtering, and pagination.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Mongoose
- Database: MongoDB
- Dev tools: Docker Compose, ts-node-dev, Vite

## Repository structure

- `client/` — React frontend application
- `server/` — Express backend API
- `docker-compose.yml` — local development stack with MongoDB

## Setup instructions

### Prerequisites

- Node.js 18+ / npm
- Docker & Docker Compose (optional)

### Clone repository

```bash
git clone <repository-url>
cd "Smart Leads Dashboard"
```

### Backend setup

```bash
cd server
npm install
```

Copy `.env.example` to `.env` in `server/` and update the values:

```bash
copy .env.example .env
```

`server/.env.example` contains:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=replace_with_secure_secret
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

### Frontend setup

```bash
cd ../client
npm install
```

Copy the existing `client/.env.example` to `client/.env` if you want to customize the API base URL.

```bash
copy .env.example .env
```

`client/.env.example` contains:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

### Docker development

From the project root:

```bash
docker compose up --build
```

Service URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017`

## Environment files

- `server/.env.example` — backend environment example
- `client/.env.example` — frontend environment example

## API documentation

### Authentication

#### Register

- Method: `POST`
- URL: `/api/auth/register`
- Body:
  - `name` (string, required)
  - `email` (string, required)
  - `password` (string, required, min 6 chars)
  - `role` (optional, `admin` or `sales`)
- Response:
  - `token` — JWT
  - `user` — created user object

#### Login

- Method: `POST`
- URL: `/api/auth/login`
- Body:
  - `email` (string, required)
  - `password` (string, required)
- Response:
  - `token` — JWT
  - `user` — authenticated user object

### Leads

All `/api/leads` routes require the `Authorization: Bearer <token>` header.

#### List leads

- Method: `GET`
- URL: `/api/leads`
- Query params:
  - `page` (optional, integer)
  - `status` (optional: `New`, `Contacted`, `Qualified`, `Lost`)
  - `source` (optional: `Website`, `Instagram`, `Referral`)
  - `sort` (optional: `latest`, `oldest`)
- Response includes:
  - `leads` array
  - `page`, `totalPages`, `total`, `limit`, `hasPrevPage`, `hasNextPage`

#### Create lead

- Method: `POST`
- URL: `/api/leads`
- Body:
  - `name` (string, required)
  - `email` (string, required)
  - `status` (required: `New`, `Contacted`, `Qualified`, `Lost`)
  - `source` (required: `Website`, `Instagram`, `Referral`)
- Response:
  - `lead` — created lead object

#### Get single lead

- Method: `GET`
- URL: `/api/leads/:id`
- Response:
  - `lead` — lead object

#### Update lead

- Method: `PUT`
- URL: `/api/leads/:id`
- Body:
  - `name` (string, required)
  - `email` (string, required)
  - `status` (required)
  - `source` (required)
- Response:
  - `lead` — updated lead object

#### Delete lead

- Method: `DELETE`
- URL: `/api/leads/:id`
- Response:
  - `message` — success text

## Notes

- JWT is used for authentication.
- Sales users can only access their own leads; admin users have broader access.
- Frontend API base URL is configured via `VITE_API_URL`.

## Troubleshooting

- If the frontend cannot reach the backend, verify `client/.env` and `VITE_API_URL`.
- If MongoDB fails to connect, confirm `server/.env` and `MONGO_URI`.
- Use `docker compose down --volumes` to reset local MongoDB data.
