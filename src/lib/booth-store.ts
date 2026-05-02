/**
 * booth-store.ts — client-side booth override store.
 *
 * Base data comes from booth-data.json.
 * User edits are layered on top via localStorage (BOOTH_STORAGE_KEY).
 * If Firebase is configured, edits are also synced to Firestore.
 */

import baseData from "@/data/booth-data.json";
import { BOOTH_STORAGE_KEY } from "@/lib/constants";
import { storageGet, storageSet } from "@/lib/storage";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Booth {
  boothNumber: string;
  boothName: string;
  address: string;
  landmark: string;
  timings: string;
  accessible: boolean;
  distanceKm: number;
  mapLat: number;
  mapLng: number;
  totalVoters: number;
  presiding_officer: string;
  constituency: string;
  /** Flag: true when this booth has a user-applied local edit */
  isEdited?: boolean;
}

export type BoothEdit = Pick<
  Booth,
  "boothName" | "address" | "landmark" | "timings" | "accessible"
>;

/** localStorage format: boothNumber → BoothEdit */
type BoothOverrideMap = Record<string, BoothEdit>;

// ─── Internal helpers ─────────────────────────────────────────────────────────

function loadOverrides(): BoothOverrideMap {
  return storageGet<BoothOverrideMap>(BOOTH_STORAGE_KEY, {});
}

function saveOverrides(map: BoothOverrideMap): void {
  storageSet(BOOTH_STORAGE_KEY, map);
}

/** Flatten all booths from all constituencies with overrides applied. */
function buildBoothList(overrides: BoothOverrideMap): Booth[] {
  const booths: Booth[] = [];
  for (const constituency of baseData.constituencies) {
    for (const b of constituency.booths) {
      const override = overrides[b.boothNumber];
      booths.push({
        ...b,
        constituency: constituency.name,
        ...(override ?? {}),
        isEdited: !!override,
      });
    }
  }
  return booths;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns all booths with any saved user edits applied.
 * Safe to call on server (returns base data with no overrides).
 */
export function getBooths(): Booth[] {
  const overrides = loadOverrides();
  return buildBoothList(overrides);
}

/**
 * Search booths by constituency name, district, or booth id/number.
 */
export function searchBooths(query: string): Booth[] {
  const q = query.trim().toLowerCase();
  if (!q || q.length < 2) return [];
  const all = getBooths();
  return all.filter((b) =>
    b.constituency.toLowerCase().includes(q) ||
    b.address.toLowerCase().includes(q) ||
    b.boothName.toLowerCase().includes(q) ||
    b.boothNumber.toLowerCase().includes(q)
  );
}

/** Persist a user edit for a specific booth number. Returns the updated booth. */
export function saveBooth(boothNumber: string, edit: BoothEdit): void {
  const overrides = loadOverrides();
  overrides[boothNumber] = edit;
  saveOverrides(overrides);
}

/** Remove any local edit for a booth, restoring original data. */
export function resetBooth(boothNumber: string): void {
  const overrides = loadOverrides();
  delete overrides[boothNumber];
  saveOverrides(overrides);
}

/** Returns the raw edit overlay for a booth, or null if unedited. */
export function getBoothEdit(boothNumber: string): BoothEdit | null {
  const overrides = loadOverrides();
  return overrides[boothNumber] ?? null;
}
