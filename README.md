# Next.js Todo App (MongoDB)

Full-stack Todo application using Next.js App Router + MongoDB (Mongoose) with complete CRUD operations.

## Features

- Create todo
- Read all todos and single todo
- Update todo
- Delete todo
- API routes in Next.js (`/api/todos` and `/api/todos/:id`)

## Environment Setup

1. Copy environment file:

```bash
cp .env.example .env.local
```

2. Update values in `.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=todoapp
```

For MongoDB Atlas, use your Atlas connection string in `MONGODB_URI`.

## Run Locally

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## API Endpoints

- `GET /api/todos` → list todos
- `POST /api/todos` → create todo
- `GET /api/todos/:id` → get one todo
- `PUT /api/todos/:id` → update todo
- `DELETE /api/todos/:id` → delete todo

## Scripts

- `npm run dev` - run dev server
- `npm run build` - build production app
- `npm run start` - start production server
- `npm run lint` - run lint checks
