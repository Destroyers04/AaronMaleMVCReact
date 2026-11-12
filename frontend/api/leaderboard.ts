import { db, json, playerFromRequest, unauthorized } from "./_db.js";

// GET -> every player with their card (or null). Codes are never sent, players are identified by id.
export async function GET(request: Request) {
    const player = await playerFromRequest(request);
    if (!player) return unauthorized();

    const [players, marks] = await db().batch(
        [
            "SELECT p.id, p.name, b.tiles, b.prediction FROM players p LEFT JOIN boards b ON b.player_id = p.id",
            "SELECT player_id, square FROM marks",
        ],
        "read"
    );

    const marksByPlayer = new Map<number, number[]>();
    for (const row of marks.rows) {
        const id = Number(row.player_id);
        marksByPlayer.set(id, [...(marksByPlayer.get(id) ?? []), Number(row.square)]);
    }

    return json(
        players.rows.map((row) => ({
            player: { id: Number(row.id), name: String(row.name) },
            board: row.tiles
                ? {
                      tiles: JSON.parse(String(row.tiles)),
                      prediction: row.prediction ? JSON.parse(String(row.prediction)) : null,
                      marks: marksByPlayer.get(Number(row.id)) ?? [],
                  }
                : null,
        }))
    );
}
