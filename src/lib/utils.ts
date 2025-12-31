import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function runOnNull<A, B>(callback: (a: A) => B, value: A | null): B | null {
  if (value == null) return null;
  return callback(value);
}
