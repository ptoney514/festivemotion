import { describe, expect, it } from "vitest";
import {
  getSeedCompletionMessage,
  getSeedModeConfig,
  shouldDeleteStaleEntries,
} from "@/scripts/catalog-seeding";

describe("catalog seeding modes", () => {
  it("keeps full sync behavior for the default seed mode", () => {
    expect(getSeedModeConfig("full-sync")).toEqual({
      deleteStaleEntries: true,
      updateExistingEntries: true,
    });
    expect(shouldDeleteStaleEntries("full-sync")).toBe(true);
    expect(getSeedCompletionMessage("full-sync")).toBe("Catalog seed complete.");
  });

  it("uses add-only behavior for additive production seeding", () => {
    expect(getSeedModeConfig("additive")).toEqual({
      deleteStaleEntries: false,
      updateExistingEntries: false,
    });
    expect(shouldDeleteStaleEntries("additive")).toBe(false);
    expect(getSeedCompletionMessage("additive")).toBe("Catalog additive seed complete.");
  });
});
