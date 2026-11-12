import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import { seriesScores, teams, teamsById, type Prediction, type Team } from "@/bingo/store";

interface Props {
    prediction: Partial<Prediction>;
    onChange: (prediction: Partial<Prediction>) => void;
}

const optionClass = (selected: boolean) =>
    cn(
        "relative rounded-lg border transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        selected
            ? "border-primary bg-accent shadow-xs ring-2 ring-primary"
            : "border-border bg-card hover:border-primary/50 hover:bg-accent/40"
    );

function SelectedCheck() {
    return (
        <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3.5" />
        </span>
    );
}

function FinalsStep({ prediction, onChange }: Props) {
    const winner = prediction.winner ? teamsById[prediction.winner] : null;

    // Finals MVP has to be on the winning team, so switching winner drops an MVP from the other team
    const pickWinner = (team: Team) => {
        const mvpOnTeam = team.players.some((player) => player.id === prediction.mvp);
        onChange({ ...prediction, winner: team.id, mvp: mvpOnTeam ? prediction.mvp : undefined });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Finals Pick'em</CardTitle>
                <CardDescription>Who lifts the trophy, how close it is, and who gets finals MVP.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                {/* Winner */}
                <section className="flex flex-col gap-3">
                    <h3 className="font-title text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        1. Winner
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {teams.map((team) => {
                            const selected = prediction.winner === team.id;
                            return (
                                <button
                                    key={team.id}
                                    type="button"
                                    onClick={() => pickWinner(team)}
                                    className={cn(optionClass(selected), "flex flex-col items-center gap-3 p-4 sm:p-6")}
                                >
                                    {selected && <SelectedCheck />}
                                    <img src={team.logo} alt={`${team.name} logo`} className="h-12 w-auto max-w-full object-contain sm:h-16" />
                                    <span className="font-title text-sm font-bold sm:text-base">{team.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Series score */}
                <section className="flex flex-col gap-3">
                    <h3 className="font-title text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        2. Series score
                    </h3>
                    {winner ? (
                        <div className="grid grid-cols-3 gap-3">
                            {seriesScores.map((score) => {
                                const selected = prediction.score === score;
                                return (
                                    <button
                                        key={score}
                                        type="button"
                                        onClick={() => onChange({ ...prediction, score })}
                                        className={cn(optionClass(selected), "flex flex-col items-center gap-0.5 px-2 py-3")}
                                    >
                                        <span className="font-title text-2xl font-bold tabular-nums">{score.replace("-", " – ")}</span>
                                        <span className="text-xs text-muted-foreground">{winner.short} wins</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                            Pick a winner first.
                        </p>
                    )}
                </section>

                {/* Finals MVP */}
                <section className="flex flex-col gap-3">
                    <h3 className="font-title text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        3. Finals MVP
                    </h3>
                    {winner ? (
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <img src={winner.logo} alt="" className="h-4 w-auto" />
                                <span className="text-sm font-semibold">{winner.name}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                                {winner.players.map((player) => {
                                    const selected = prediction.mvp === player.id;
                                    return (
                                        <button
                                            key={player.id}
                                            type="button"
                                            onClick={() => onChange({ ...prediction, mvp: player.id })}
                                            className={cn(optionClass(selected), "flex flex-col overflow-hidden")}
                                        >
                                            {selected && <SelectedCheck />}
                                            <img
                                                src={player.image}
                                                alt={player.name}
                                                className="aspect-square w-full bg-white object-cover object-top"
                                            />
                                            <span className="px-1 pt-1.5 font-title text-sm font-bold">{player.name}</span>
                                            <span className="px-1 pb-1.5 text-xs text-muted-foreground">{player.role}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <p className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                            Pick a winner first. Finals MVP comes from the winning team.
                        </p>
                    )}
                </section>
            </CardContent>
        </Card>
    );
}

export default FinalsStep;
