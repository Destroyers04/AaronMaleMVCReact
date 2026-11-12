import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Eye, Loader2, Medal } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { cn } from "@/lib/utils";
import { POLL_INTERVAL_MS, fetchLeaderboard, type Difficulty, type LeaderboardEntry, type Player } from "@/bingo/store";
import DifficultyIcon from "./DifficultyIcon";

// Hardest first, matching the tiebreak order
const DIFFICULTIES: Difficulty[] = ["hard", "medium", "easy"];

interface Props {
    me: Player;
    onView: (player: Player) => void;
}

// Podium: gold, silver, bronze
const RANK_STYLE: Record<number, string> = {
    1: "bg-[#E8B931] text-foreground shadow-sm shadow-[#E8B931]/50",
    2: "bg-[#C3CAD4] text-foreground",
    3: "bg-[#CD8A4B] text-foreground",
};

function LeaderboardDialog({ me, onView }: Props) {
    const [open, setOpen] = useState(false);
    const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
    const [error, setError] = useState(false);

    const refresh = useCallback(
        () =>
            fetchLeaderboard()
                .then((next) => {
                    setEntries(next);
                    setError(false);
                })
                .catch(() => setError(true)), // keep showing the last standings
        []
    );

    // Fresh standings every time it opens
    const onOpenChange = (next: boolean) => {
        if (next) refresh();
        setOpen(next);
    };

    // ...and keep them fresh while it stays open
    useEffect(() => {
        if (!open) return;
        const id = setInterval(refresh, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, [open, refresh]);

    const view = (player: Player) => {
        setOpen(false);
        onView(player);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Medal /> Leaderboard
                </Button>
            </DialogTrigger>
            {/* Dialog renders outside the page, so it needs the bingo theme class itself */}
            <DialogContent className="bingo-theme gap-5 p-5 font-body text-foreground sm:p-6">
                <DialogHeader>
                    <DialogTitle>Leaderboard</DialogTitle>
                    <DialogDescription>
                        Highest score when the trophy is lifted wins.
                        <br />
                        <span className="flex items-center gap-1.5 whitespace-nowrap text-xs">
                            Tiebreak: lines
                            <ChevronRight className="size-3" />
                            hard
                            <DifficultyIcon difficulty="hard" className="size-2.5" />
                            <ChevronRight className="size-3" />
                            medium
                            <DifficultyIcon difficulty="medium" className="size-2.5" />
                        </span>
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                        Couldn't refresh, trying again in a few seconds.
                    </p>
                )}

                {!entries && !error && (
                    <p className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" /> Loading standings…
                    </p>
                )}

                <ol className="-mx-2 flex max-h-[60dvh] flex-col gap-1 overflow-y-auto px-2">
                    {entries?.map(({ player, board, score, rank }) => {
                        const isMe = player.id === me.id;
                        return (
                            <li
                                key={player.id}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-2 py-2",
                                    isMe ? "bg-accent" : "odd:bg-muted/60"
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex size-8 shrink-0 items-center justify-center rounded-full font-title text-sm font-bold",
                                        (board && RANK_STYLE[rank]) || "bg-card text-muted-foreground"
                                    )}
                                >
                                    {board ? rank : "–"}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <p className="flex items-center gap-1.5 truncate font-semibold">
                                        {player.name}
                                        {isMe && <Badge variant="navy" className="px-1.5 py-0 text-[10px]">You</Badge>}
                                    </p>
                                    {/* Shows the tiebreak values: lines first, then squares per difficulty */}
                                    {score ? (
                                        <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground tabular-nums">
                                            <span>
                                                {score.lines} line{score.lines === 1 ? "" : "s"}
                                            </span>
                                            <span className="flex items-center gap-1.5" aria-label="Hard, medium and easy squares marked">
                                                {DIFFICULTIES.map((d) => (
                                                    <span key={d} className="flex items-center gap-0.5" title={`${d} squares`}>
                                                        <DifficultyIcon difficulty={d} className="size-2.5" />
                                                        <span className={cn(d !== "easy" && "font-semibold text-foreground")}>
                                                            {score.squares[d]}
                                                        </span>
                                                    </span>
                                                ))}
                                            </span>
                                        </p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground">No card yet</p>
                                    )}
                                </div>

                                <span className="font-title text-lg font-bold tabular-nums">
                                    {score ? score.total : "–"}
                                    <span className="ml-0.5 text-xs font-normal text-muted-foreground">pts</span>
                                </span>

                                {/* Your own row has no eye, you're already looking at your board */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("size-9", isMe && "invisible")}
                                    disabled={!board}
                                    onClick={() => view(player)}
                                    aria-label={`View ${player.name}'s board`}
                                >
                                    <Eye />
                                </Button>
                            </li>
                        );
                    })}
                </ol>
            </DialogContent>
        </Dialog>
    );
}

export default LeaderboardDialog;
