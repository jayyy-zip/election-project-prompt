import { describe, it, expect, beforeEach } from "vitest";
import { getBooths, searchBooths, saveBooth, resetBooth, getBoothEdit } from "@/lib/booth-store";
import { BOOTH_STORAGE_KEY } from "@/lib/constants";

beforeEach(() => {
  localStorage.clear();
});

describe("getBooths", () => {
  it("returns booths from base JSON data", () => {
    const booths = getBooths();
    expect(booths.length).toBeGreaterThan(0);
  });

  it("every booth has required fields", () => {
    for (const booth of getBooths()) {
      expect(booth).toHaveProperty("boothNumber");
      expect(booth).toHaveProperty("boothName");
      expect(booth).toHaveProperty("address");
      expect(booth).toHaveProperty("constituency");
    }
  });

  it("isEdited is false for all booths with no overrides", () => {
    getBooths().forEach((b) => expect(b.isEdited).toBe(false));
  });
});

describe("searchBooths", () => {
  it("returns booths matching constituency name", () => {
    const results = searchBooths("Andheri West");
    expect(results.length).toBeGreaterThan(0);
    // All results should match — either constituency or address contains the query
    results.forEach((b) =>
      expect(
        b.constituency.toLowerCase().includes("andheri") ||
        b.address.toLowerCase().includes("andheri")
      ).toBe(true)
    );
  });

  it("is case-insensitive", () => {
    const lower = searchBooths("andheri west");
    const upper = searchBooths("ANDHERI WEST");
    expect(lower.length).toBe(upper.length);
    expect(lower.length).toBeGreaterThan(0);
  });

  it("returns empty array for unrecognised query", () => {
    expect(searchBooths("Narnia 12345")).toHaveLength(0);
  });

  it("returns empty array for single-char query", () => {
    expect(searchBooths("A")).toHaveLength(0);
  });

  it("returns empty array for empty string", () => {
    expect(searchBooths("")).toHaveLength(0);
  });

  it("searches by booth name", () => {
    // Use the first booth name from base data
    const all = getBooths();
    const firstName = all[0].boothName.split(" ")[0];
    const results = searchBooths(firstName);
    expect(results.length).toBeGreaterThan(0);
  });
});

describe("saveBooth / getBoothEdit / resetBooth", () => {
  const testBoothNumber = "42"; // Andheri West booth #42

  const testEdit = {
    boothName: "Updated School Hall",
    address: "123 New Address, Andheri West",
    landmark: "Near New Landmark",
    timings: "8:00 AM – 5:00 PM",
    accessible: false,
  };

  it("saves an edit and retrieves it via getBoothEdit", () => {
    saveBooth(testBoothNumber, testEdit);
    expect(getBoothEdit(testBoothNumber)).toEqual(testEdit);
  });

  it("saved edit appears in getBooths() with isEdited=true", () => {
    saveBooth(testBoothNumber, testEdit);
    const booth = getBooths().find((b) => b.boothNumber === testBoothNumber);
    expect(booth?.isEdited).toBe(true);
    expect(booth?.boothName).toBe("Updated School Hall");
  });

  it("edit overrides only the saved fields", () => {
    saveBooth(testBoothNumber, testEdit);
    const booth = getBooths().find((b) => b.boothNumber === testBoothNumber);
    // Non-editable fields remain from base data
    expect(typeof booth?.totalVoters).toBe("number");
    expect(booth?.mapLat).toBeGreaterThan(0);
  });

  it("persists to localStorage", () => {
    saveBooth(testBoothNumber, testEdit);
    const raw = localStorage.getItem(BOOTH_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed[testBoothNumber]).toEqual(testEdit);
  });

  it("resetBooth removes the edit", () => {
    saveBooth(testBoothNumber, testEdit);
    resetBooth(testBoothNumber);
    expect(getBoothEdit(testBoothNumber)).toBeNull();
  });

  it("after reset, getBooths shows original data", () => {
    saveBooth(testBoothNumber, testEdit);
    resetBooth(testBoothNumber);
    const booth = getBooths().find((b) => b.boothNumber === testBoothNumber);
    expect(booth?.isEdited).toBe(false);
    expect(booth?.boothName).not.toBe("Updated School Hall");
  });

  it("getBoothEdit returns null when no edit saved", () => {
    expect(getBoothEdit("999-nonexistent")).toBeNull();
  });
});
