import { getDB } from "@/infra/core";
import { exFavorites } from "./schema";

export const db = getDB({ exFavorites });
