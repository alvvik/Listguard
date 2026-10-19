# API Reference

**Autoryzacja:** Wszystkie endpointy wymagają nagłówka:
`Authorization: Bearer <TOKEN>`

## Next.js Endpoints

### 1. Podania (`/api/applications`)

- **GET `/api/applications`**
  - **Query:** `?status=...&limit=50`
  - **Opis:** Zwraca listę podań.
- **POST `/api/applications`**
  - **Body:** `{ discordId, username, answers: { <string>, <string> } }`
  - **Opis:** Tworzy nowe podanie (odrzuca, jeśli istnieje aktywne `pending`).

### 2. Podanie użytkownika (`/api/applications/:discordId`)

- **GET `/api/applications/:discordId`**
  - **Opis:** Pobiera szczegóły podania i dane użytkownika.
- **PATCH `/api/applications/:discordId`**
  - **Body:** `{ status: "approved" | "rejected" | "pending" }`
  - **Opis:** Zmienia status podania.
- **DELETE `/api/applications/:discordId`**
  - **Opis:** Usuwa użytkownika z bazy.

---

## Bot Endpoint

- **POST `http://<bot-host>:3001/check-role`**
  - **Auth:** Pole `secretKey` w body (zamiast Bearer).
  - **Body:** `{ secretKey, userId, allowedRoleIds, guildId }`
  - **Odpowiedź:** `{ hasRole: boolean }`
