import { getDB } from "@/infra/core";
import * as schema from "./schema";

export const db = getDB(schema);
