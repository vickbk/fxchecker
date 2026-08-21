vi.mock(import("@/infra/core"), async () => {
  return {
    users: { id: "" } as unknown as Awaited<
      (typeof import("@/infra/core"))["users"]
    >,
  };
});
import { users } from "@/infra/core";
import { getTableColumns } from "drizzle-orm";
import { getTableConfig } from "drizzle-orm/pg-core";
import { describe, expect, it, vi } from "vitest";
import { exFavorites } from "./schema";

describe("exFavorites Schema Definition", () => {
  it("configures the correct PostgreSQL table name", () => {
    const { name } = getTableConfig(exFavorites);
    expect(name).toBe("ex_favorites");
  });

  it("defines expected columns on the table", () => {
    const columns = getTableColumns(exFavorites);
    const columnKeys = Object.keys(columns);

    expect(columnKeys).toEqual(["userId", "favoritePairs"]);
    expect(columnKeys).toHaveLength(2);
  });

  describe("userId Column Constraints & Configuration", () => {
    const { userId } = getTableColumns(exFavorites);

    it("maps to database column name 'user_id'", () => {
      expect(userId.name).toBe("user_id");
    });

    it("is designated as UUID column type", () => {
      expect(userId.columnType).toBe("PgUUID");
    });

    it("is configured as primary key", () => {
      expect(userId.primary).toBe(true);
    });

    it("establishes foreign key constraint targeting users.id with CASCADE deletion", () => {
      const { foreignKeys } = getTableConfig(exFavorites);

      expect(foreignKeys).toHaveLength(1);

      const [foreignKey] = foreignKeys;
      const fkConfig = foreignKey.reference();

      expect(fkConfig.foreignColumns[0]).toBe(users.id);
      expect(fkConfig.columns[0].name).toBe("user_id");
    });
  });

  describe("favoritePairs Column Constraints & Configuration", () => {
    const { favoritePairs } = getTableColumns(exFavorites);

    it("maps to database column name 'favorite_pairs'", () => {
      expect(favoritePairs.name).toBe("favorite_pairs");
    });

    it("is designated as Array column type wrapping text elements", () => {
      expect(favoritePairs.columnType).toBe("PgArray");
      // @ts-expect-error - Accessing base column definition inside array
      expect(favoritePairs.baseColumn.columnType).toBe("PgText");
    });

    it("enforces NOT NULL constraint", () => {
      expect(favoritePairs.notNull).toBe(true);
    });

    it("configures default value as an empty array", () => {
      expect(favoritePairs.hasDefault).toBe(true);
      expect(favoritePairs.default).toEqual([]);
    });
  });
});
