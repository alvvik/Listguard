# Database Setup Guide

This project uses Drizzle ORM with SQLite database.

## Setup

The project is configured to use SQLite. The database file will be created automatically at `./dev.db` (configurable via `DATABASE_URL` in `.env`).

## Database Commands

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Apply pending migrations
- `npm run db:push` - Push schema changes directly to database (for development)
- `npm run db:studio` - Open Drizzle Studio to browse database

## Schema Definition

The schema is defined in `src/db/schema.ts` using SQLite-specific types with `sqliteTable`.

## Database Client

The database client is in `src/db/index.ts` using the `better-sqlite3` driver.

## Usage Example

```typescript
import { db } from "./db";
import { users } from "./db/schema";

// Query users
const allUsers = await db.select().from(users);

// Insert user
await db.insert(users).values({
  name: "John Doe",
  email: "john@example.com",
});
```
