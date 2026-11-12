// Worlds bingo data: tiles/teams come from the JSON files, players and cards from the /api functions (Turso).
// Only the player's code is kept in this browser, it works as their login.
import finalsData from "./finals.json";
import tileData from "./tiles.json";

export type Difficulty = "easy" | "medium" | "hard";

export interface Player {
    id: number;
    name: string;
}

export interface Tile {
    id: string;
    text: string;
    difficulty: Difficulty;
}

export type Team = (typeof finalsData.teams)[number];
export type FinalsPlayer = Team["players"][number] & { teamId: string };

export interface Prediction {
    winner: string; // team id
    score: string; // winner's score first, e.g. "3-1"
    mvp: string; // player id
}

export interface Board {
    tiles: string[]; // 25 tile ids in grid order, FREE_TILE in the middle
    marked: boolean[];
    prediction: Prediction | null;
}

export const CODE_LENGTH = 6;
export const POLL_INTERVAL_MS = 10_000; // how often the leaderboard and viewed boards refresh
export const TILES_PER_DIFFICULTY = 8;
export const FREE_TILE = "FREE";
const CENTER_INDEX = 12;

const SESSION_KEY = "worlds2026bingo:code";

export const tilesByDifficulty: Record<Difficulty, Tile[]> = {
    easy: tileData.easy.map((tile) => ({ ...tile, difficulty: "easy" })),
    medium: tileData.medium.map((tile) => ({ ...tile, difficulty: "medium" })),
    hard: tileData.hard.map((tile) => ({ ...tile, difficulty: "hard" })),
};

export const tilesById: Record<string, Tile> = Object.fromEntries(
    Object.values(tilesByDifficulty)
        .flat()
        .map((tile) => [tile.id, tile])
);

export const teams: Team[] = finalsData.teams;

export const teamsById: Record<string, Team> = Object.fromEntries(teams.map((team) => [team.id, team]));

export const playersById: Record<string, FinalsPlayer> = Object.fromEntries(
    teams.flatMap((team) => team.players.map((player) => [player.id, { ...player, teamId: team.id }]))
);

// Possible series results for the winning team, e.g. Bo5 -> ["3-0", "3-1", "3-2"]
const winsNeeded = Math.ceil(finalsData.bestOf / 2);
export const seriesScores = Array.from({ length: winsNeeded }, (_, losses) => `${winsNeeded}-${losses}`);

// --- Session (the code is the only thing stored in the browser) ---

export function getSessionCode(): string | null {
    try {
        return localStorage.getItem(SESSION_KEY);
    } catch {
        return null;
    }
}

function setSessionCode(code: string | null) {
    try {
        if (code === null) localStorage.removeItem(SESSION_KEY);
        else localStorage.setItem(SESSION_KEY, code);
    } catch {
        // storage unavailable (private window), they'll just have to enter the code again next visit
    }
}

export function logout() {
    setSessionCode(null);
}

// --- API ---

export class ApiError extends Error {
    readonly status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

async function api<T>(path: string, init: RequestInit = {}, code = getSessionCode()): Promise<T> {
    const response = await fetch(`/api/${path}`, {
        ...init,
        headers: { "Content-Type": "application/json", "X-Bingo-Code": code ?? "", ...init.headers },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new ApiError(response.status, data.error ?? `Request failed (${response.status})`);
    return data as T;
}

// How the API sends a card: marked squares as a list of indexes
interface ApiBoard {
    tiles: string[];
    prediction: Prediction | null;
    marks: number[];
}

const toBoard = ({ tiles, prediction, marks }: ApiBoard): Board => ({
    tiles,
    prediction,
    marked: tiles.map((id, i) => id === FREE_TILE || marks.includes(i)),
});

// Returns null for a wrong code
export async function login(code: string): Promise<{ player: Player; hasBoard: boolean } | null> {
    try {
        const result = await api<{ player: Player; hasBoard: boolean }>(
            "login",
            { method: "POST", body: JSON.stringify({ code }) },
            code
        );
        setSessionCode(code);
        return result;
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
    }
}

// The logged in player and their card. Null if not logged in or the saved code stopped working.
export async function loadMe(): Promise<{ player: Player; board: Board | null } | null> {
    if (!getSessionCode()) return null;
    try {
        const { player, board } = await api<{ player: Player; board: ApiBoard | null }>("board");
        return { player, board: board && toBoard(board) };
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            logout();
            return null;
        }
        throw error;
    }
}

export async function createBoard(board: Board) {
    try {
        await api("board", { method: "POST", body: JSON.stringify({ tiles: board.tiles, prediction: board.prediction }) });
    } catch (error) {
        // 409 = they already have a card (e.g. made on another device), that's fine
        if (!(error instanceof ApiError && error.status === 409)) throw error;
    }
}

// Marks are sent one at a time in order, so tapping the same square quickly can't arrive out of order
let markQueue: Promise<unknown> = Promise.resolve();

export function setMark(square: number, marked: boolean): Promise<void> {
    const request = markQueue.then(() =>
        api<void>("mark", { method: "POST", body: JSON.stringify({ square, marked }) })
    );
    markQueue = request.catch(() => undefined);
    return request;
}

// --- Board generation and scoring ---

export function shuffle<T>(items: T[]): T[] {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

// 24 picked tile ids -> 5x5 board with FREE in the middle
export function generateBoard(tileIds: string[], prediction: Prediction): Board {
    const tiles = shuffle(tileIds);
    tiles.splice(CENTER_INDEX, 0, FREE_TILE);
    return {
        tiles,
        marked: tiles.map((id) => id === FREE_TILE),
        prediction,
    };
}

const ROWS = [0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => r * 5 + c));
const COLUMNS = [0, 1, 2, 3, 4].map((c) => [0, 1, 2, 3, 4].map((r) => r * 5 + c));
const LINES = [...ROWS, ...COLUMNS, [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]];

const completedLines = (marked: boolean[]) => LINES.filter((line) => line.every((i) => marked[i]));

// Cell indexes that are part of a completed row, column or diagonal
export function winningCells(marked: boolean[]): Set<number> {
    return new Set(completedLines(marked).flat());
}

// Scoring: points per marked square by difficulty, plus a bonus per completed line. FREE is worth 0.
export const POINTS: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };
export const LINE_BONUS = 5;

export function scoreBoard(board: Board) {
    const squarePoints = board.tiles.reduce((sum, id, i) => {
        const tile = tilesById[id];
        return board.marked[i] && tile ? sum + POINTS[tile.difficulty] : sum;
    }, 0);
    const lines = completedLines(board.marked).length;
    const squares: Record<Difficulty, number> = { easy: 0, medium: 0, hard: 0 };
    board.tiles.forEach((id, i) => {
        const tile = tilesById[id];
        if (board.marked[i] && tile) squares[tile.difficulty]++;
    });
    return {
        squarePoints,
        lines,
        squares,
        linePoints: lines * LINE_BONUS,
        total: squarePoints + lines * LINE_BONUS,
    };
}

export type Score = ReturnType<typeof scoreBoard>;

// --- Leaderboard ---

export interface LeaderboardEntry {
    player: Player;
    board: Board | null; // null until they've made a card
    score: Score | null;
    marked: number;
    rank: number;
}

// Ranking: points, then lines, then hard squares, then medium squares. Players only share a rank if all are equal.
// Easy isn't needed: with equal points, lines, hard and medium, the easy count is equal too.
// Players without a card go last.
const TIEBREAKS: ((score: Score) => number)[] = [
    (s) => s.total,
    (s) => s.lines,
    (s) => s.squares.hard,
    (s) => s.squares.medium,
];

const compareScores = (a: Score | null, b: Score | null) => {
    if (!a || !b) return (b ? 1 : 0) - (a ? 1 : 0);
    for (const value of TIEBREAKS) {
        const difference = value(b) - value(a);
        if (difference !== 0) return difference;
    }
    return 0;
};

export async function fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    const rows = await api<{ player: Player; board: ApiBoard | null }[]>("leaderboard");
    const entries = rows
        .map(({ player, board: apiBoard }) => {
            const board = apiBoard && toBoard(apiBoard);
            return {
                player,
                board,
                score: board ? scoreBoard(board) : null,
                marked: board ? board.marked.filter(Boolean).length : 0,
                rank: 0,
            };
        })
        .sort((a, b) => compareScores(a.score, b.score) || a.player.name.localeCompare(b.player.name));

    entries.forEach((entry, i) => {
        const prev = entries[i - 1];
        entry.rank = prev && compareScores(prev.score, entry.score) === 0 ? prev.rank : i + 1;
    });
    return entries;
}
