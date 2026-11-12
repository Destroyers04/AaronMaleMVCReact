import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw, Shuffle, Sparkles } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { cn } from "@/lib/utils";
import {
    TILES_PER_DIFFICULTY,
    createBoard,
    generateBoard,
    shuffle,
    tilesByDifficulty,
    tilesById,
    type Difficulty,
    type Player,
    type Prediction,
} from "@/bingo/store";
import FinalsStep from "./FinalsStep";
import PredictionSummary from "./PredictionSummary";

interface Step {
    key: "finals" | Difficulty | "review";
    label: string;
    blurb: string;
}

const STEPS: Step[] = [
    { key: "finals", label: "Finals Pick'em", blurb: "Predict the winner, score and finals MVP." },
    { key: "easy", label: "Easy", blurb: "Likely to happen this series. 1 pt each." },
    { key: "medium", label: "Medium", blurb: "Could go either way. 2 pts each." },
    { key: "hard", label: "Hard", blurb: "Long shots. You'll scream if these hit. 3 pts each." },
    { key: "review", label: "Review", blurb: "Check your picks, then generate your card." },
];

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const DIFFICULTY_BADGE = { easy: "secondary", medium: "accent", hard: "navy" } as const;

function BingoSetup() {
    const { player } = useLoaderData() as { player: Player };
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [picks, setPicks] = useState<Record<Difficulty, string[]>>({ easy: [], medium: [], hard: [] });
    const [prediction, setPrediction] = useState<Partial<Prediction>>({});

    const step = STEPS[stepIndex];
    const difficulty = DIFFICULTIES.find((d) => d === step.key) ?? null;
    const currentPicks = difficulty ? picks[difficulty] : [];
    const isFull = currentPicks.length === TILES_PER_DIFFICULTY;
    const predictionDone = !!(prediction.winner && prediction.score && prediction.mvp);
    const canContinue = step.key === "finals" ? predictionDone : isFull;

    const setCurrentPicks = (ids: string[]) => {
        if (difficulty) setPicks({ ...picks, [difficulty]: ids });
    };

    const toggle = (id: string) => {
        if (currentPicks.includes(id)) setCurrentPicks(currentPicks.filter((pick) => pick !== id));
        else if (!isFull) setCurrentPicks([...currentPicks, id]);
    };

    const fillRandom = () => {
        if (!difficulty) return;
        const remaining = shuffle(tilesByDifficulty[difficulty].map((tile) => tile.id))
            .filter((id) => !currentPicks.includes(id));
        setCurrentPicks([...currentPicks, ...remaining.slice(0, TILES_PER_DIFFICULTY - currentPicks.length)]);
    };

    const goToStep = (index: number) => {
        setStepIndex(index);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const generate = async () => {
        setSaving(true);
        setSaveError(false);
        try {
            await createBoard(generateBoard([...picks.easy, ...picks.medium, ...picks.hard], prediction as Prediction));
            navigate("/worlds2026bingo/card");
        } catch {
            setSaveError(true);
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 pt-4">
            <div>
                <p className="text-sm text-muted-foreground">
                    Hi <span className="font-semibold text-foreground">{player.name}</span>, let's build your card
                </p>
                <h1 className="font-title text-3xl font-bold tracking-wide sm:text-4xl">Setup wizard</h1>
            </div>

            {/* Step indicator */}
            <div className="flex flex-col gap-2">
                <ol className="grid grid-cols-5 gap-2">
                    {STEPS.map((s, i) => (
                        <li key={s.key} className="flex flex-col gap-1.5">
                            <div className={cn("h-1.5 rounded-full transition-colors", i <= stepIndex ? "bg-primary" : "bg-border")} />
                            {/* Labels don't fit 5 across on phones, so they only show from sm up */}
                            <p
                                className={cn(
                                    "hidden items-center gap-1 text-sm font-semibold sm:flex",
                                    i === stepIndex ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {i < stepIndex && <Check className="size-3.5 text-primary" />}
                                {s.label}
                            </p>
                        </li>
                    ))}
                </ol>
                <p className="text-sm font-semibold sm:hidden">
                    <span className="text-muted-foreground">
                        Step {stepIndex + 1} of {STEPS.length} ·
                    </span>{" "}
                    {step.label}
                </p>
            </div>

            {step.key === "finals" ? (
                <FinalsStep prediction={prediction} onChange={setPrediction} />
            ) : difficulty ? (
                <Card>
                    <CardHeader className="flex-row flex-wrap items-start justify-between gap-4">
                        <div className="flex flex-col gap-1.5">
                            <CardTitle>
                                Pick {TILES_PER_DIFFICULTY} {step.label.toLowerCase()} tiles
                            </CardTitle>
                            <CardDescription>{step.blurb}</CardDescription>
                        </div>
                        <Badge variant={isFull ? "default" : "outline"} className="px-3 py-1 text-sm tabular-nums">
                            {currentPicks.length} / {TILES_PER_DIFFICULTY}
                        </Badge>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="grid gap-2 sm:grid-cols-2">
                            {tilesByDifficulty[difficulty].map((tile) => {
                                const picked = currentPicks.includes(tile.id);
                                return (
                                    <button
                                        key={tile.id}
                                        type="button"
                                        disabled={isFull && !picked}
                                        onClick={() => toggle(tile.id)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                            picked
                                                ? "border-primary bg-accent font-semibold shadow-xs"
                                                : "border-border bg-card hover:border-primary/50 hover:bg-accent/40",
                                            "disabled:cursor-not-allowed disabled:opacity-40"
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "flex size-5 shrink-0 items-center justify-center rounded border transition-colors",
                                                picked ? "border-primary bg-primary text-primary-foreground" : "border-input"
                                            )}
                                        >
                                            {picked && <Check className="size-3.5" />}
                                        </span>
                                        {tile.text}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" disabled={isFull} onClick={fillRandom}>
                                <Shuffle /> Fill the rest randomly
                            </Button>
                            <Button variant="ghost" size="sm" disabled={!currentPicks.length} onClick={() => setCurrentPicks([])}>
                                <RotateCcw /> Clear
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Your picks</CardTitle>
                        <CardDescription>
                            These 24 tiles get shuffled onto a 5×5 card with a FREE square in the middle. Once
                            generated, your card is locked.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="default">Finals Pick'em</Badge>
                                <button
                                    type="button"
                                    className="text-xs font-semibold text-primary hover:underline"
                                    onClick={() => goToStep(0)}
                                >
                                    Edit
                                </button>
                            </div>
                            <PredictionSummary prediction={prediction as Prediction} />
                        </div>
                        <div className="grid gap-6 sm:grid-cols-3">
                        {DIFFICULTIES.map((d) => (
                            <div key={d} className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <Badge variant={DIFFICULTY_BADGE[d]} className="capitalize">{d}</Badge>
                                    <button
                                        type="button"
                                        className="text-xs font-semibold text-primary hover:underline"
                                        onClick={() => goToStep(STEPS.findIndex((s) => s.key === d))}
                                    >
                                        Edit
                                    </button>
                                </div>
                                <ul className="flex flex-col gap-1.5 text-sm">
                                    {picks[d].map((id) => (
                                        <li key={id} className="rounded-md bg-muted px-2.5 py-1.5">
                                            {tilesById[id].text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {saveError && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                    Couldn't save your card. Check your connection and try again.
                </p>
            )}

            {/* Navigation, stuck to the bottom of the screen so Next is always in thumb reach */}
            <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-2 border-t border-border bg-background px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:mx-0 sm:rounded-xl sm:border sm:px-4">
                <Button variant="outline" disabled={stepIndex === 0} onClick={() => goToStep(stepIndex - 1)}>
                    <ArrowLeft /> Back
                </Button>
                {step.key !== "review" ? (
                    <Button disabled={!canContinue} onClick={() => goToStep(stepIndex + 1)}>
                        Next <ArrowRight />
                    </Button>
                ) : (
                    <Button size="lg" onClick={generate} disabled={saving}>
                        {saving ? <Loader2 className="animate-spin" /> : <Sparkles />} Generate my card
                    </Button>
                )}
            </div>
        </div>
    );
}

export default BingoSetup;
