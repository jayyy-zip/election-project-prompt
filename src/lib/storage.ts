/**
 * storage.ts — type-safe localStorage wrapper with SSR guard.
 * All reads/writes go through this module so we have one safe access point.
 */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Read a JSON value from localStorage. Returns `defaultValue` if missing or corrupt. */
export function storageGet<T>(key: string, defaultValue: T): T {
  if (!isBrowser()) return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

/** Write a JSON-serialisable value to localStorage. Fails silently (e.g. private mode). */
export function storageSet<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

/** Remove a key from localStorage. */
export function storageRemove(key: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // fail silently
  }
}

/** Merge a partial record into an existing object stored at `key`. */
export function storageMerge<T extends Record<string, unknown>>(
  key: string,
  patch: Partial<T>
): void {
  const existing = storageGet<T>(key, {} as T);
  storageSet(key, { ...existing, ...patch });
}
