import { db, json, playerFromCode, readJson, unauthorized } from "./_db.js";

// POST { code } -> { player, hasBoard }
export async function POST(request: Request) {
    const { code } = await readJson(request);
    const player = await playerFromCode(code);
    if (!player) return unauthorized();

    const board = await db().execute({ sql: "SELECT 1 FROM boards WHERE player_id = ?", args: [player.id] });
    return json({ player, hasBoard: board.rows.length > 0 });
}
