import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a product name to a URL-safe slug.
 * "Royal Oud Attar" → "royal-oud-attar"
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric (keep spaces & hyphens)
    .replace(/\s+/g, '-')            // spaces → hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .replace(/^-|-$/g, '');          // strip leading/trailing hyphens
}

/**
 * Builds the full product slug string used in URLs.
 * Format: "royal-oud-attar-xF7kP2" (name-slug + 7-char Firestore ID suffix)
 */
export function buildProductSlug(name: string, firestoreId: string): string {
  const nameSlug = slugify(name);
  const idSuffix = firestoreId.slice(0, 7);
  return `${nameSlug}-${idSuffix}`;
}

/**
 * Extracts the Firestore document ID prefix from a full product slug.
 * "royal-oud-attar-xF7kP2" → "xF7kP2"
 */
export function extractIdFromSlug(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
}
