import { Circle, Square, Triangle, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/bingo/store";

// Difficulty shown as a shape, more corners = harder: circle easy, triangle medium, square hard.
// Filled with currentColor, so it's visible on white, orange (your marked) and navy-tinted squares alike.
const ICONS = { easy: Circle, medium: Triangle, hard: Square };

interface Props extends LucideProps {
    difficulty: Difficulty;
}

function DifficultyIcon({ difficulty, className, ...props }: Props) {
    const Icon = ICONS[difficulty];
    return (
        <Icon
            fill="currentColor"
            strokeWidth={1.5}
            aria-label={difficulty}
            className={cn("size-2.5 shrink-0", className)}
            {...props}
        />
    );
}

export default DifficultyIcon;
