import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const kostenarten = [
  "Wartung", "Reparatur", "Versicherung", "Steuer", "Zubehör",
  "Tuning", "HU/AU", "Reifen", "Pflege", "Sonstiges"
];

export const waehrungen = ["EUR", "HUF", "USD"];