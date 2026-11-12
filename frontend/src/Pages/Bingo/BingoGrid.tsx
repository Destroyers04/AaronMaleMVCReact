import { Star } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { FREE_TILE, tilesById, winningCells, type Board } from "@/bingo/store";
import DifficultyIcon from "./DifficultyIcon";

interface Props {
    board: Board;
    onToggle?: (index: number) => void; // leave out for a read-only board
}

function BingoGrid({ board, onToggle }: Props) {
    const winners = winningCells(board.marked);
    const readOnly = !onToggle;

    return (
        // Pulled wider on phones so the 5 columns get as much room as possible.
        // Someone else's (read-only) board uses navy instead of orange so it never looks like your own.
        <Card className={cn("-mx-2 py-1.5 sm:mx-0 sm:py-4", readOnly && "border-2 border-dashed border-foreground/40 bg-muted")}>
            <CardContent className="px-1.5 sm:px-4">
                <div className="grid grid-cols-5 gap-1 sm:gap-2">
                    {board.tiles.map((id, i) => {
                        const tile = tilesById[id];
                        const marked = board.marked[i];
                        return (
                            <button
                                key={i}
                                type="button"
                                aria-pressed={marked}
                                disabled={!onToggle}
                                onClick={() => onToggle?.(i)}
                                className={cn(
                                    "relative flex aspect-square items-center justify-center rounded-md border p-0.5 text-center text-[10px] leading-[1.15] break-words hyphens-auto transition-[background-color,border-color,color,transform] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:rounded-lg sm:p-2 sm:text-sm sm:leading-tight",
                                    onToggle && "active:scale-95",
                                    // Someone else's marked squares: navy tint + border, so the navy (hard) dot stays visible
                                    marked && readOnly && "border-2 border-foreground bg-foreground/15 font-semibold text-foreground",
                                    marked && !readOnly && "border-primary bg-primary text-primary-foreground shadow-md sm:font-semibold",
                                    !marked &&
                                        cn("border-border bg-card", onToggle && "hover:border-primary/50 hover:bg-accent/50"),
                                    winners.has(i) &&
                                        cn("ring-2 ring-offset-1 sm:ring-offset-2", readOnly ? "ring-primary" : "ring-foreground")
                                )}
                            >
                                {id === FREE_TILE ? (
                                    <span className="flex flex-col items-center gap-0.5 font-title font-bold">
                                        <Star className="size-4 fill-current sm:size-6" />
                                        FREE
                                    </span>
                                ) : (
                                    <>
                                        {/* Difficulty shape, shown on marked and unmarked squares */}
                                        {tile && (
                                            <DifficultyIcon
                                                difficulty={tile.difficulty}
                                                className="absolute right-0.5 top-0.5 size-2.5 opacity-70 sm:right-1 sm:top-1 sm:size-3.5"
                                            />
                                        )}
                                        <span className="line-clamp-5 sm:line-clamp-4">{tile?.text ?? "Removed tile"}</span>
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export default BingoGrid;
