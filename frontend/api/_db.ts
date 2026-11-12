// Shared by the /api functions. Files starting with "_" are not turned into endpoints by Vercel.
import { createClient, type Client } from "@libsql/client";

let client: Client | null = null;

// Turso in production, a local SQLite file (frontend/bingo.db) when running on your PC
export function db(): Client {
    if (!client) {
        const url = process.env.TURSO_DATABASE_URL ?? (process.env.VERCEL ? undefined : "file:bingo.db");
        if (!url) throw new Error("TURSO_DATABASE_URL is not set in Vercel");
        client = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
    }
    return client;
}

export interface DbPlayer {
    id: number;
    name: string;
}

export function json(data: unknown, status = 200) {
    return Response.json(data, { status });
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
    try {
        const body = await request.json();
        return body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    } catch {
        return {};
    }
}

// The 6 digit code works as the player's password. It comes in the X-Bingo-Code header.
export async function playerFromCode(code: unknown): Promise<DbPlayer | null> {
    if (typeof code !== "string" || !/^\d{6}$/.test(code)) return null;
    const result = await db().execute({ sql: "SELECT id, name FROM players WHERE code = ?", args: [code] });
    const row = result.rows[0];
    return row ? { id: Number(row.id), name: String(row.name) } : null;
}

export function playerFromRequest(request: Request) {
    return playerFromCode(request.headers.get("x-bingo-code"));
}

export const unauthorized = () => json({ error: "Unknown code" }, 401);
