import { describe, it, expect, beforeEach } from "vitest";
import { storageGet, storageSet, storageRemove, storageMerge } from "@/lib/storage";

const KEY = "test_storage_key";

beforeEach(() => {
  localStorage.clear();
});

describe("storageGet", () => {
  it("returns defaultValue when key does not exist", () => {
    expect(storageGet(KEY, 42)).toBe(42);
    expect(storageGet(KEY, [])).toEqual([]);
    expect(storageGet(KEY, null)).toBeNull();
  });

  it("returns parsed value when key exists", () => {
    localStorage.setItem(KEY, JSON.stringify({ a: 1 }));
    expect(storageGet(KEY, {})).toEqual({ a: 1 });
  });

  it("returns defaultValue when value is corrupt JSON", () => {
    localStorage.setItem(KEY, "not valid json {{{{");
    expect(storageGet(KEY, "fallback")).toBe("fallback");
  });
});

describe("storageSet", () => {
  it("stores a value that can be read back", () => {
    storageSet(KEY, [1, 2, 3]);
    expect(storageGet(KEY, [])).toEqual([1, 2, 3]);
  });

  it("overwrites existing value", () => {
    storageSet(KEY, "first");
    storageSet(KEY, "second");
    expect(storageGet(KEY, "")).toBe("second");
  });

  it("handles nested objects", () => {
    const obj = { a: { b: { c: true } } };
    storageSet(KEY, obj);
    expect(storageGet(KEY, {})).toEqual(obj);
  });
});

describe("storageRemove", () => {
  it("removes an existing key", () => {
    storageSet(KEY, "hello");
    storageRemove(KEY);
    expect(storageGet(KEY, "default")).toBe("default");
  });

  it("does not throw when key does not exist", () => {
    expect(() => storageRemove("nonexistent_key")).not.toThrow();
  });
});

describe("storageMerge", () => {
  it("merges a patch into existing record", () => {
    storageSet(KEY, { x: 1, y: 2 });
    storageMerge(KEY, { y: 99, z: 3 });
    expect(storageGet(KEY, {})).toEqual({ x: 1, y: 99, z: 3 });
  });

  it("creates record if key does not exist", () => {
    storageMerge(KEY, { a: 1 });
    expect(storageGet(KEY, {})).toEqual({ a: 1 });
  });
});
