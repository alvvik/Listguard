process.env.DATABASE_URL = ":memory:";
process.env.NEXT_PUBLIC_DOMAIN = "localhost:2877";
process.env.NEXT_PUBLIC_API_URL = "http://localhost:2877";

import { describe, it, expect, beforeEach, vi } from "vitest";
import { GET as getApplications, POST as postApplication } from "./route";
import {
  GET as getApplicationByDiscordId,
  PATCH as patchApplication,
  DELETE as deleteApplication,
} from "./[discordId]/route";
import { db } from "@/db";
import { applications, users } from "@/db/schema";
import { config } from "../../../../config";
import type Database from "better-sqlite3";

vi.mock("@/lib/rateLimit", () => ({
  isRateLimited: () => false,
  getRateLimitStatus: () => null,
}));

const TOKEN = "test-secret-token";
const BASE_URL = `http://${config.domain}`;

beforeEach(async () => {
  process.env.TOKEN = TOKEN;
  const client = (db as unknown as { $client: Database.Database }).$client;

  client.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      discord_id TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      answers TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );
  `);

  await db.delete(applications);
  await db.delete(users);
});

describe("Applications API /api/applications", () => {
  it("returns 403 if authorization header is missing or incorrect", async () => {
    const req = new Request(`${BASE_URL}/api/applications`);
    const res = await getApplications(req);
    expect(res.status).toBe(403);
    const data = await res.json();
    expect(data.error).toBe("Brak dostępu");
  });

  it("returns empty array when no applications exist", async () => {
    const req = new Request(`${BASE_URL}/api/applications`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const res = await getApplications(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual([]);
  });

  it("creates an application successfully with POST", async () => {
    const req = new Request(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discordId: "123456789",
        username: "TestUser",
        answers: { q1: "answer1" },
      }),
    });

    const res = await postApplication(req);
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.message).toBe("Podanie zostało wysłane pomyślnie");
    expect(data.application.discordId).toBe("123456789");
    expect(data.application.status).toBe("pending");
  });

  it("prevents creating duplicate pending applications for the same user", async () => {
    const payload = {
      discordId: "123456789",
      username: "TestUser",
      answers: { q1: "answer1" },
    };

    const req1 = new Request(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    await postApplication(req1);

    const req2 = new Request(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const res2 = await postApplication(req2);
    expect(res2.status).toBe(400);
    const data2 = await res2.json();
    expect(data2.error).toBe("Masz już oczekujące podanie w systemie!");
  });

  it("retrieves applications list with GET", async () => {
    const reqPost = new Request(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discordId: "987654321",
        username: "AnotherUser",
      }),
    });
    await postApplication(reqPost);

    const reqGet = new Request(`${BASE_URL}/api/applications`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const resGet = await getApplications(reqGet);
    expect(resGet.status).toBe(200);
    const list = await resGet.json();
    expect(list.length).toBe(1);
    expect(list[0].discordId).toBe("987654321");
  });
});

describe("Application by Discord ID API /api/applications/[discordId]", () => {
  it("gets application by discordId", async () => {
    const reqPost = new Request(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discordId: "111222333",
        username: "SpecificUser",
      }),
    });
    await postApplication(reqPost);

    const reqGet = new Request(`${BASE_URL}/api/applications/111222333`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const resGet = await getApplicationByDiscordId(reqGet, {
      params: Promise.resolve({ discordId: "111222333" }),
    });
    expect(resGet.status).toBe(200);
    const data = await resGet.json();
    expect(data.discordId).toBe("111222333");
    expect(data.username).toBe("SpecificUser");
  });

  it("returns 404 if application not found", async () => {
    const reqGet = new Request(`${BASE_URL}/api/applications/999999`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const resGet = await getApplicationByDiscordId(reqGet, {
      params: Promise.resolve({ discordId: "999999" }),
    });
    expect(resGet.status).toBe(404);
  });

  it("updates application status with PATCH", async () => {
    const reqPost = new Request(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discordId: "444555666",
        username: "PatchUser",
      }),
    });
    await postApplication(reqPost);

    const reqPatch = new Request(`${BASE_URL}/api/applications/444555666`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "approved" }),
    });

    const resPatch = await patchApplication(reqPatch, {
      params: Promise.resolve({ discordId: "444555666" }),
    });
    expect(resPatch.status).toBe(200);

    const reqGet = new Request(`${BASE_URL}/api/applications/444555666`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const resGet = await getApplicationByDiscordId(reqGet, {
      params: Promise.resolve({ discordId: "444555666" }),
    });
    const data = await resGet.json();
    expect(data.status).toBe("approved");
  });

  it("deletes user and application with DELETE", async () => {
    const reqPost = new Request(`${BASE_URL}/api/applications`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        discordId: "777888999",
        username: "DeleteUser",
      }),
    });
    await postApplication(reqPost);

    const reqDelete = new Request(`${BASE_URL}/api/applications/777888999`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${TOKEN}` },
    });

    const resDelete = await deleteApplication(reqDelete, {
      params: Promise.resolve({ discordId: "777888999" }),
    });
    expect(resDelete.status).toBe(200);

    const reqGet = new Request(`${BASE_URL}/api/applications/777888999`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const resGet = await getApplicationByDiscordId(reqGet, {
      params: Promise.resolve({ discordId: "777888999" }),
    });
    expect(resGet.status).toBe(404);
  });
});
