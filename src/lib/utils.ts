import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(
  dateInput: string | number | Date | null | undefined,
) {
  if (!dateInput) return "Nie prawidłowy format daty";
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) return String(dateInput);

  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
