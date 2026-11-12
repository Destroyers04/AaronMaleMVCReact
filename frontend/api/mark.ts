import { db, json, playerFromRequest, readJson, unauthorized } from "./_db.js";

const CENTER_INDEX = 12;

// POST { square, marked } -> marks or unmarks one square. One row per marked square,
// so two devices for the same player can't overwrite each other's ticks.
export async function POST(request: Request) {
    const player = await playerFromRequest(request);
    if (!player) return unauthorized();

    const { square, marked } = await readJson(request);
    if (!Number.isInteger(square) || (square as number) < 0 || (square as number) > 24 || square === CENTER_INDEX || typeof marked !== "boolean") {
        return json({ error: "Invalid square" }, 400);
    }

    const board = await db().execute({ sql: "SELECT 1 FROM boards WHERE player_id = ?", args: [player.id] });
    if (board.rows.length === 0) return json({ error: "Make a card first" }, 409);

    await db().execute(
        marked
            ? { sql: "INSERT INTO marks (player_id, square) VALUES (?, ?) ON CONFLICT DO NOTHING", args: [player.id, square as number] }
            : { sql: "DELETE FROM marks WHERE player_id = ? AND square = ?", args: [player.id, square as number] }
    );
    return json({ ok: true });
}
