import { db, json, playerFromRequest, readJson, unauthorized } from "./_db.js";

const FREE_TILE = "FREE";
const CENTER_INDEX = 12;

// GET -> { player, board } for the logged in player, board is null until they've made one
export async function GET(request: Request) {
    const player = await playerFromRequest(request);
    if (!player) return unauthorized();

    const [boardResult, marksResult] = await db().batch(
        [
            { sql: "SELECT tiles, prediction FROM boards WHERE player_id = ?", args: [player.id] },
            { sql: "SELECT square FROM marks WHERE player_id = ?", args: [player.id] },
        ],
        "read"
    );
    const row = boardResult.rows[0];
    const board = row
        ? {
              tiles: JSON.parse(String(row.tiles)),
              prediction: row.prediction ? JSON.parse(String(row.prediction)) : null,
              marks: marksResult.rows.map((mark) => Number(mark.square)),
          }
        : null;
    return json({ player, board });
}

const isText = (value: unknown) => typeof value === "string" && value.length > 0 && value.length <= 64;

// POST { tiles, prediction } -> creates the player's card. Cards are locked once made.
export async function POST(request: Request) {
    const player = await playerFromRequest(request);
    if (!player) return unauthorized();

    const { tiles, prediction } = await readJson(request);
    const validTiles =
        Array.isArray(tiles) &&
        tiles.length === 25 &&
        tiles[CENTER_INDEX] === FREE_TILE &&
        tiles.every(isText) &&
        new Set(tiles).size === 25;
    const p = prediction as Record<string, unknown> | null;
    const validPrediction = !!p && isText(p.winner) && isText(p.score) && isText(p.mvp);
    if (!validTiles || !validPrediction) return json({ error: "Invalid card" }, 400);

    const result = await db().execute({
        sql: "INSERT INTO boards (player_id, tiles, prediction) VALUES (?, ?, ?) ON CONFLICT (player_id) DO NOTHING",
        args: [player.id, JSON.stringify(tiles), JSON.stringify({ winner: p.winner, score: p.score, mvp: p.mvp })],
    });
    if (result.rowsAffected === 0) return json({ error: "You already have a card" }, 409);
    return json({ ok: true }, 201);
}
