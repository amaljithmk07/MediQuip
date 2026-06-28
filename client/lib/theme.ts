import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges tailwind classes seamlessly, resolving conflicts
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const theme = {
  colors: {
    primary: '#2563eb',
    danger: '#ef4444',
    success: '#16a34a',
    warning: '#f59e0b',
    info: '#0ea5e9',
    base: {
      background: '#ffffff',
      surface: '#f8fafc',
      border: '#e5e7eb',
      text: '#0f172a',
      muted: '#64748b',
    }
  }
};
