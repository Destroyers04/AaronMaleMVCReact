import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { playersById, teamsById, type Prediction } from "@/bingo/store";

interface Props {
    prediction: Prediction;
    className?: string;
}

// Compact "BLG wins 3–1 · MVP Viper" row, used in the review step and on the card
function PredictionSummary({ prediction, className }: Props) {
    const winner = teamsById[prediction.winner];
    const mvp = playersById[prediction.mvp];
    if (!winner || !mvp) return null;

    return (
        <div className={cn("grid grid-cols-2 gap-3", className)}>
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <img src={winner.logo} alt={`${winner.name} logo`} className="h-8 w-12 shrink-0 object-contain" />
                <div className="min-w-0">
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Trophy className="size-3" /> Winner
                    </p>
                    <p className="truncate font-title font-bold">
                        {winner.short} {prediction.score.replace("-", "–")}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                <img src={mvp.image} alt={mvp.name} className="size-10 shrink-0 rounded-full bg-white object-cover object-top" />
                <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Finals MVP</p>
                    <p className="truncate font-title font-bold">{mvp.name}</p>
                </div>
            </div>
        </div>
    );
}

export default PredictionSummary;
