// Creates the bingo tables and adds the players from scripts/players.json (git-ignored, codes stay out of the repo).
// Players without a code get a random 6 digit one, written back to players.json.
//
//   npm run db:setup              -> local SQLite file (bingo.db)
//   npm run db:setup:prod         -> Turso, using .env.production.local
//   add -- --reset to either one  -> wipes all players, cards and marks first (e.g. to clear test data)
import { createClient } from "@libsql/client";
import { randomInt } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const PLAYERS_FILE = new URL("./players.json", import.meta.url);
const reset = process.argv.includes("--reset");

if (!existsSync(PLAYERS_FILE)) {
    writeFileSync(PLAYERS_FILE, JSON.stringify([{ name: "Aaron" }], null, 2) + "\n");
    console.log("Created scripts/players.json. Add your friends' names to it and run this again.");
    process.exit(0);
}

const url = process.env.TURSO_DATABASE_URL ?? "file:bingo.db";
const db = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });
console.log(`Database: ${url.startsWith("file:") ? url : url.replace(/\/\/.*@/, "//")}`);

await db.batch(
    [
        `CREATE TABLE IF NOT EXISTS players (
            id INTEGER PRIMARY KEY,
            code TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS boards (
            player_id INTEGER PRIMARY KEY REFERENCES players(id),
            tiles TEXT NOT NULL,
            prediction TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )`,
        `CREATE TABLE IF NOT EXISTS marks (
            player_id INTEGER NOT NULL REFERENCES players(id),
            square INTEGER NOT NULL,
            PRIMARY KEY (player_id, square)
        )`,
    ],
    "write"
);

if (reset) {
    await db.batch(["DELETE FROM marks", "DELETE FROM boards", "DELETE FROM players"], "write");
    console.log("Reset: removed all players, cards and marks.");
}

const players = JSON.parse(readFileSync(PLAYERS_FILE, "utf8"));
const used = new Set(players.map((p) => p.code).filter(Boolean));
for (const player of players) {
    if (player.code) continue;
    let code;
    do code = String(randomInt(100000, 1000000));
    while (used.has(code));
    used.add(code);
    player.code = code;
}
writeFileSync(PLAYERS_FILE, JSON.stringify(players, null, 2) + "\n");

// Upsert by code, so renaming someone in players.json keeps their card
await db.batch(
    players.map((p) => ({
        sql: "INSERT INTO players (code, name) VALUES (?, ?) ON CONFLICT (code) DO UPDATE SET name = excluded.name",
        args: [p.code, p.name],
    })),
    "write"
);

console.table(players.map((p) => ({ name: p.name, code: p.code })));
