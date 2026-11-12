import { useEffect, useState } from "react";
import { useLoaderData, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, LogOut, PartyPopper } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import {
    FREE_TILE,
    LINE_BONUS,
    POINTS,
    POLL_INTERVAL_MS,
    fetchLeaderboard,
    logout,
    scoreBoard,
    setMark,
    type Board,
    type Player,
} from "@/bingo/store";
import BingoGrid from "./BingoGrid";
import DifficultyIcon from "./DifficultyIcon";
import LeaderboardDialog from "./LeaderboardDialog";
import PredictionSummary from "./PredictionSummary";

const LINE_NAMES: Record<number, string> = { 1: "BINGO!", 2: "Double BINGO!", 3: "Triple BINGO!" };

interface Viewed {
    player: Player;
    board: Board;
}

function BingoCard() {
    const me = useLoaderData() as { player: Player; board: Board };
    const player = me.player;
    const navigate = useNavigate();
    const [board, setBoard] = useState<Board>(me.board);
    const [saveError, setSaveError] = useState(false);

    // ?view=<player id> shows someone else's board read-only. Using the URL means the phone's back gesture also works.
    const [searchParams, setSearchParams] = useSearchParams();
    const viewParam = Number(searchParams.get("view"));
    const viewId = viewParam && viewParam !== player.id ? viewParam : null;
    const [viewed, setViewed] = useState<Viewed | null>(null);

    // Load the viewed board now and keep it fresh, so their newly marked squares show up
    useEffect(() => {
        if (!viewId) return;
        const load = () =>
            fetchLeaderboard()
                .then((entries) => {
                    const entry = entries.find((e) => e.player.id === viewId);
                    if (entry?.board) setViewed({ player: entry.player, board: entry.board });
                })
                .catch(() => undefined); // keep showing the last version
        load();
        const id = setInterval(load, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, [viewId]);

    const isViewing = !!viewId && viewed?.player.id === viewId;
    const shownPlayer = isViewing ? viewed.player : player;
    const shownBoard = isViewing ? viewed.board : board;
    const markedCount = shownBoard.marked.filter(Boolean).length;
    const score = scoreBoard(shownBoard);

    // Updates the screen right away, then saves. If saving fails the square flips back.
    const setSquare = (index: number, value: boolean) =>
        setBoard((current) => ({ ...current, marked: current.marked.map((m, i) => (i === index ? value : m)) }));

    const toggle = (index: number) => {
        if (board.tiles[index] === FREE_TILE) return;
        const value = !board.marked[index];
        setSquare(index, value);
        setSaveError(false);
        setMark(index, value).catch(() => {
            setSquare(index, !value);
            setSaveError(true);
        });
    };

    const viewBoard = (other: Player) => {
        setSearchParams({ view: String(other.id) });
        window.scrollTo({ top: 0 });
    };

    const backToMine = () => setSearchParams({});

    const signOut = () => {
        logout();
        navigate("/worlds2026bingo");
    };

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 pt-4">
            {/* Navy bar stuck to the top while viewing someone, so it's never mistaken for your own card */}
            {isViewing && (
                <div className="sticky top-0 z-20 -mx-4 flex items-center justify-between gap-3 bg-foreground px-4 py-2.5 text-background shadow-lg sm:mx-0 sm:rounded-xl">
                    <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                        <Eye className="size-4 shrink-0" />
                        <span className="truncate">Viewing {shownPlayer.name}'s card</span>
                    </span>
                    <Button size="sm" onClick={backToMine} className="shrink-0">
                        <ArrowLeft /> My board
                    </Button>
                </div>
            )}

            <div className="flex flex-wrap items-end justify-between gap-4">
                {isViewing ? (
                    <div>
                        <p className="text-sm text-muted-foreground">Read only</p>
                        <h1 className="font-title text-3xl font-bold tracking-wide sm:text-4xl">{shownPlayer.name}'s card</h1>
                    </div>
                ) : (
                    <div>
                        <p className="text-sm text-muted-foreground">{shownPlayer.name}'s card</p>
                        <h1 className="font-title text-3xl font-bold tracking-wide sm:text-4xl">
                            Worlds <span className="text-primary">Bingo</span>
                        </h1>
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Badge variant={isViewing ? "navy" : "default"} className="px-3 py-1 text-sm tabular-nums">
                        {score.total} pts
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 tabular-nums">
                        {markedCount} / 25 marked
                    </Badge>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2">
                <LeaderboardDialog me={player} onView={viewBoard} />
                {!isViewing && (
                    <Button variant="ghost" size="sm" onClick={signOut}>
                        <LogOut /> Log out
                    </Button>
                )}
            </div>

            {/* A line is a bonus, not the end: the game runs until the series is over */}
            {score.lines > 0 && (
                <div
                    className={cn(
                        "flex items-center gap-3 rounded-xl px-5 py-4",
                        isViewing ? "bg-accent" : "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    )}
                >
                    <PartyPopper className="size-6 shrink-0" />
                    <div>
                        <p className="font-title text-lg font-bold tracking-wide">
                            {LINE_NAMES[score.lines] ?? `BINGO ×${score.lines}!`} +{score.linePoints} pts
                        </p>
                        {!isViewing && <p className="text-sm">+{LINE_BONUS} pts for every line. Keep going until the trophy is lifted.</p>}
                    </div>
                </div>
            )}

            {shownBoard.prediction && <PredictionSummary prediction={shownBoard.prediction} />}

            {saveError && !isViewing && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                    Couldn't save that square. Check your connection and tap it again.
                </p>
            )}

            <BingoGrid board={shownBoard} onToggle={isViewing ? undefined : toggle} />

            <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                    {(["hard", "medium", "easy"] as const).map((d) => (
                        <span key={d} className="flex items-center gap-1.5">
                            <DifficultyIcon difficulty={d} className="size-3 text-foreground" />
                            <span className="capitalize">{d}</span> {POINTS[d]} pt{POINTS[d] > 1 && "s"}
                        </span>
                    ))}
                    <span>Line +{LINE_BONUS}</span>
                </div>
                {!isViewing && <p>Tap a square when it happens. Highest score when the trophy is lifted wins.</p>}
            </div>
        </div>
    );
}

export default BingoCard;
