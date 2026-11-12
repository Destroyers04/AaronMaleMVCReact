import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn helper: merges Tailwind classes so later ones win (e.g. "px-2" + "px-4" -> "px-4")
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
